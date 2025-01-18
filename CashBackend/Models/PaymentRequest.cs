using Microsoft.EntityFrameworkCore;

namespace CashBackend.Models
{
    public class PaymentRequest
    {
        public int FromUserId { get; set; }
        public int ToUserId { get; set; }
        [Precision(18, 2)]
        public decimal Amount { get; set; }
    }
}
