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

            var userContributions = users.ToDictionary(
                u => u.Id,
                u => items.Where(i => i.UserId == u.Id).Sum(i => i.Price)
            );

            foreach (var user in users)
            {
                user.Balance = userContributions[user.Id] - fairShare;
            }

            _context.SaveChanges();
        }

        [HttpGet("{id}/detailed-balance")]
        public async Task<ActionResult> GetDetailedUserBalances(int id)
        {
            var _users = await _context.Users.Select(it => new UserResponse
            {
                Id = it.Id,
                Name = it.Name,
            }).ToListAsync();

            var _items = await _context.Items.Select(it => new ItemPriceResponse
            {
                Id = it.Id,
                Name = it.Name,
                Price = it.Price,
                UserId = it.UserId,
                User = it.User
            }).ToListAsync();

            var user = _users.FirstOrDefault(u => u.Id == id);
            if (user == null)
                return NotFound($"User with ID {id} not found.");

            int totalExpenses = _items.Sum(i => i.Price);
            int numberOfUsers = _users.Count;
            int fairShare = totalExpenses / numberOfUsers;

            var userContributions = _users.ToDictionary(
                u => u.Id,
                u => _items.Where(i => i.UserId == u.Id).Sum(i => i.Price)
            );

            var userBalances = userContributions.ToDictionary(
                entry => entry.Key,
                entry => entry.Value - fairShare
            );

            var detailedBalances = new List<string>();
            foreach (var otherUser in _users)
            {
                if (otherUser.Id == id)
                    continue;

                int difference = userBalances[id] - userBalances[otherUser.Id];

                if (difference > 0)
                {
                    detailedBalances.Add($"{user.Name} is owed {difference} by {otherUser.Name}.");
                }
                else if (difference < 0)
                {
                    detailedBalances.Add($"{user.Name} owes {-difference} to {otherUser.Name}.");
                }
            }

            return Ok(detailedBalances);
        }
    }
}
