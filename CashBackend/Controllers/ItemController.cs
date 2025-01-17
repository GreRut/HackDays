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
                User = user,
            };

            _context.Items.Add(itemRequest);
            await _context.SaveChangesAsync();

            var itemResponse = new ItemPriceResponse
            {
                Id = itemRequest.Id,
                Name = itemRequest.Name,
                Price = itemRequest.Price,
                UserId = itemRequest.UserId,
                User = itemRequest.User
            };
            return CreatedAtAction(nameof(GetItem), new { id = itemRequest.Id }, itemResponse);
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