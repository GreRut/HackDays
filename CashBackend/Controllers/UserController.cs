
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
            var users = await _context.Users.FindAsync(id);

            if (users == null)
            {
                return NotFound();
            }
            var response = new UserResponse
            {
                Name = users.Name,
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
    }
}
