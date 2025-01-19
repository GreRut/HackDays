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
            var users = await _context.Users
                .Include(u => u.Payees)
                .ThenInclude(debt => debt.ToUser)
                .Include(u => u.Payers)
                .ThenInclude(debt => debt.FromUser)
                .ToListAsync();

            return Ok(users.Select(user => new UserResponse
            {
                Id = user.Id,
                Name = user.Name,
                Payees = user.Payees.Select(debt => new PayeeResponse
                {
                    PayeeId = debt.ToUserId,
                    PayeeName = debt.ToUser.Name,
                    AmountOwed = debt.Amount
                }).ToList(),
                Payers = user.Payers.Select(debt => new PayerResponse
                {
                    PayerId = debt.FromUserId,
                    PayerName = debt.FromUser.Name,
                    AmountOwed = debt.Amount
                }).ToList()
            }));
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

            await UpdateDebtsForNewUser(newUser);

            return CreatedAtAction(nameof(GetUser), new { id = newUser.Id }, new UserResponse
            {
                Id = newUser.Id,
                Name = newUser.Name,
                Payees = new List<PayeeResponse>(),
                Payers = new List<PayerResponse>()
            });
        }

        private async Task UpdateDebtsForNewUser(User newUser)
        {
            var users = await _context.Users.ToListAsync();
            var items = await _context.Items.ToListAsync();

            if (users.Count <= 1) return;

            foreach (var item in items)
            {
                decimal splitCost = item.Price / users.Count;

                foreach (var user in users)
                {
                    if (user.Id == item.UserId) continue;

                    var existingDebt = await _context.UserDebts
                        .FirstOrDefaultAsync(d => d.FromUserId == user.Id && d.ToUserId == item.UserId);

                    if (existingDebt == null)
                    {
                        _context.UserDebts.Add(new UserDebt
                        {
                            FromUserId = user.Id,
                            ToUserId = item.UserId,
                            Amount = splitCost
                        });
                    }
                    else
                    {
                        existingDebt.Amount += splitCost;
                    }
                }
            }

            await _context.SaveChangesAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<UserResponse>> GetUser(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            return Ok(new UserResponse
            {
                Id = user.Id,
                Name = user.Name
            });
        }
    }
}
