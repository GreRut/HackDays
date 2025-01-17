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
            }).ToListAsync();
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

            };
            return Ok(response);
        }
    }
}