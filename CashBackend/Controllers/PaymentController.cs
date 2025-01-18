using CashBackend.Data;
using CashBackend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CashBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]

    public class PaymentController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public PaymentController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("{id}/payment-history")]
        public async Task<ActionResult> GetPaymentHistory(int id)
        {
            var payments = await _context.Payments
                .Where(p => p.FromUserId == id || p.ToUserId == id)
                .Select(p => new
                {
                    p.Id,
                    FromUserId = p.FromUserId,
                    FromUserName = p.FromUser.Name,
                    ToUserId = p.ToUserId,
                    ToUserName = p.ToUser.Name,
                    p.Amount,
                    p.Timestamp
                })
                .ToListAsync();

            return Ok(payments);
        }
    }
}