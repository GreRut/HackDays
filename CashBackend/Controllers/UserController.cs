using CashBackend.Data;
using CashBackend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CashBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public UsersController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserResponse>>> GetUsers()
        {
            return await _context.Users.Select(it => new UserResponse
            {
                Id = it.Id,
                Name = it.Name,
                Balance = it.Balance
            }).ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<UserResponse>> GetUser(int id)
        {
            var user = await _context.Users.FindAsync(id);

            if (user == null)
            {
                return NotFound();
            }
            var response = new UserResponse
            {
                Id = user.Id,
                Name = user.Name,
                Balance = user.Balance
            };
            return Ok(response);
        }

        [HttpPost]
        public async Task<ActionResult<UserResponse>> PostUser(UserRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Name))
            {
                return BadRequest("Name is required.");
            }

            var newUser = new User
            {
                Name = request.Name
            };

            _context.Users.Add(newUser);
            await _context.SaveChangesAsync();

            var users = await _context.Users.ToListAsync();
            var items = await _context.Items.ToListAsync();

            RecalculateBalances(users, items);

            var response = new UserResponse
            {
                Id = newUser.Id,
                Name = newUser.Name,
                Balance = 0,
            };

            return CreatedAtAction(nameof(GetUser), new { id = newUser.Id }, response);
        }

        private void RecalculateBalances(List<User> users, List<Item> items)
        {
            decimal totalExpenses = items.Sum(i => i.Price);
            int userCount = users.Count;
            decimal fairShare = userCount > 0 ? totalExpenses / userCount : 0;

            var userContributions = items
                .GroupBy(i => i.UserId)
                .ToDictionary(
                    group => group.Key,
                    group => group.Sum(i => i.Price)
                );

            _context.UserDebts.RemoveRange(_context.UserDebts);
            _context.SaveChanges();

            foreach (var user in users)
            {
                userContributions.TryGetValue(user.Id, out var contribution);
                user.Balance = contribution - fairShare;
            }

            foreach (var user in users)
            {
                foreach (var otherUser in users)
                {
                    if (user.Id == otherUser.Id) continue;

                    decimal difference = user.Balance - otherUser.Balance;

                    if (difference < 0)
                    {
                        _context.UserDebts.Add(new UserDebt
                        {
                            FromUserId = user.Id,
                            ToUserId = otherUser.Id,
                            Amount = -difference
                        });
                    }
                }
            }

            _context.SaveChanges();
        }
        [HttpGet("{id}/detailed-balance")]
        public async Task<ActionResult> GetDetailedUserBalances(int id)
        {
            var user = await _context.Users
                .Include(u => u.Payees)
                .ThenInclude(debt => debt.ToUser)
                .Include(u => u.Payers)
                .ThenInclude(debt => debt.FromUser)
                .FirstOrDefaultAsync(u => u.Id == id);

            if (user == null)
            {
                return NotFound($"User with ID {id} not found.");
            }

            var detailedBalances = new List<string>();

            foreach (var debt in user.Payees)
            {
                detailedBalances.Add($"{user.Name} owes {debt.Amount:C} to {debt.ToUser.Name}.");
            }

            foreach (var debt in user.Payers)
            {
                detailedBalances.Add($"{debt.FromUser.Name} owes {debt.Amount:C} to {user.Name}.");
            }
            return Ok(detailedBalances);
        }
    }
}
