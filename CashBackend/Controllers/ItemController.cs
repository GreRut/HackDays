using CashBackend.Data;
using CashBackend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CashBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ItemController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ItemController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ItemPriceResponse>>> GetItems()
        {
            return await _context.Items.Select(it => new ItemPriceResponse
            {
                Id = it.Id,
                Name = it.Name,
                Price = it.Price,
                UserId = it.UserId,
                User = it.User
            }).ToListAsync();
        }

        [HttpPost]
        public async Task<ActionResult<ItemPriceResponse>> PostItem(ItemRequest request)
        {

            var user = await _context.Users.FindAsync(request.UserId);

            if (user == null)
            {
                return NotFound($"User with ID {request.UserId} not found.");
            }

            var itemRequest = new Item()
            {
                Name = request.Name,
                Price = request.Price,
                UserId = request.UserId,
            };

            _context.Items.Add(itemRequest);
            await _context.SaveChangesAsync();

            var createdItem = await _context.Items
                                    .Include(i => i.User)
                                    .FirstOrDefaultAsync(i => i.Id == itemRequest.Id);

            var itemResponse = new ItemPriceResponse
            {
                Id = itemRequest.Id,
                Name = itemRequest.Name,
                Price = itemRequest.Price,
                UserId = itemRequest.UserId,
                User = itemRequest.User
            };

            var users = await _context.Users.ToListAsync();
            var items = await _context.Items.ToListAsync();
            RecalculateBalances(users, items);

            return CreatedAtAction(nameof(GetItem), new { id = itemRequest.Id }, itemResponse);
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

        [HttpGet("{id}")]
        public async Task<ActionResult<UserResponse>> GetItem(int id)
        {
            var item = await _context.Items.FindAsync(id);

            if (item == null)
            {
                return NotFound();
            }
            var response = new ItemPriceResponse
            {
                Id = item.Id,
                Name = item.Name,
                Price = item.Price,
                UserId = item.UserId,
                User = item.User

            };
            return Ok(response);
        }
    }
}