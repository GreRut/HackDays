using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using CashBackend.Data;
using CashBackend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

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

        // [HttpGet]
        // public async Task<ActionResult<IEnumerable<Item>>> GetItems()
        // {
        //     return await _context.Items.Select(it => new Item
        //     {
        //         Id = it.Id,
        //         Name = it.Name,
        //         Payment = it.Payment
        //     }).ToListAsync();
        // }

    }
}