
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
                Name = it.Name,
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
                Name = user.Name,
            };
            return Ok(response);
        }

        [HttpPost]
        public async Task<ActionResult<User>> PostUser(UserRequest request)
        {
            var userRequest = new User()
            {
                Name = request.Name,
            };

            _context.Users.Add(userRequest);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetUser), new { id = userRequest.Id }, userRequest);
        }

        [HttpGet("{id}/balance")]
        public async Task<ActionResult<string>> GetUserBalance(int id)
        {
            var pick = await _context.Users.FindAsync(id);

            if (pick == null)
            {
                return NotFound($"User with ID {id} not found.");
            }

            var user = new UserResponse
            {
                Name = pick.Name,
            };

            var _users = await _context.Users.Select(it => new UserResponse
            {
                Name = it.Name,
            }).ToListAsync();

            var _items = await _context.Items.Select(it => new ItemPriceResponse
            {
                Id = it.Id,
                Price = it.Price,
                UserId = it.UserId
            }).ToListAsync();

            int totalExpenses = _items.Sum(i => i.Price);
            int numberOfUsers = _users.Count;

            int fairShare = totalExpenses / numberOfUsers;

            Dictionary<int, int> netBalances = new Dictionary<int, int>(); 
            foreach (var u in _users)
            {
                int userExpenses = _items.Where(i => i.UserId == u.Id).Sum(i => i.Price);
                netBalances[u.Id] = userExpenses - fairShare;
            }
            int userBalance = netBalances[id];

            if (userBalance == 0)
                return Ok($"User {user.Name} is settled with the group.");
            else if (userBalance > 0)
                return Ok($"User {user.Name} is owed {userBalance} by the group.");
            else
                return Ok($"User {user.Name} owes {-userBalance} to the group.");
        }
    }
}
