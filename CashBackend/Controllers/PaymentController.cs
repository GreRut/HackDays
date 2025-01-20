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

        [HttpPost("transfer")]
        public async Task<IActionResult> TransferMoney(PaymentRequest request)
        {
            if (request.Amount <= 0)
            {
                return BadRequest("Amount must be greater than zero.");
            }

            var fromUser = await _context.Users.FindAsync(request.FromUserId);
            var toUser = await _context.Users.FindAsync(request.ToUserId);

            if (fromUser == null || toUser == null)
            {
                return NotFound("One or both users not found.");
            }

            var existingDebt = await _context.UserDebts
                .FirstOrDefaultAsync(d => d.FromUserId == request.FromUserId && d.ToUserId == request.ToUserId);

            if (existingDebt == null || existingDebt.Amount < request.Amount)
            {
                return BadRequest("Invalid payment amount or no outstanding debt.");
            }

            var payment = new Payment
            {
                FromUserId = request.FromUserId,
                ToUserId = request.ToUserId,
                Amount = request.Amount,
                Timestamp = DateTime.UtcNow
            };

            _context.Payments.Add(payment);

            existingDebt.Amount -= request.Amount;

            if (existingDebt.Amount == 0)
            {
                _context.UserDebts.Remove(existingDebt);
            }
            else
            {
                _context.UserDebts.Update(existingDebt);
            }

            await _context.SaveChangesAsync();

            return Ok(new
            {
                Message = "Payment processed successfully.",
                Payment = new
                {
                    payment.Id,
                    payment.FromUserId,
                    payment.ToUserId,
                    payment.Amount,
                    payment.Timestamp
                }
            });
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
        [HttpGet("/all-payments")]
        public async Task<ActionResult> GetAllPayments()
        {
            var allPayments = await _context.Payments
                .Select(p => new
                {
                    p.Id,
                    p.FromUserId,
                    p.ToUserId,
                    p.Amount,
                    p.Timestamp
                })
                .ToListAsync();

            return Ok(allPayments);
        }
    }
}