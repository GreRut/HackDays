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

            var newItem = new Item
            {
                Name = request.Name,
                Price = request.Price,
                UserId = request.UserId
            };

            _context.Items.Add(newItem);
            await _context.SaveChangesAsync();

            await UpdateDebtsForItemAddition(newItem);

            return CreatedAtAction(nameof(GetItem), new { id = newItem.Id }, new ItemPriceResponse
            {
                Id = newItem.Id,
                Name = newItem.Name,
                Price = newItem.Price,
                UserId = newItem.UserId,
                User = newItem.User
            });
        }

        private async Task UpdateDebtsForItemAddition(Item item)
        {
            var users = await _context.Users.ToListAsync();
            int userCount = users.Count;

            if (userCount <= 1) return;

            decimal splitCost = item.Price / userCount;

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

            await _context.SaveChangesAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ItemPriceResponse>> GetItem(int id)
        {
            var item = await _context.Items.FindAsync(id);
            if (item == null)
            {
                return NotFound();
            }

            return Ok(new ItemPriceResponse
            {
                Id = item.Id,
                Name = item.Name,
                Price = item.Price,
                UserId = item.UserId,
                User = item.User
            });
        }
    }
}
