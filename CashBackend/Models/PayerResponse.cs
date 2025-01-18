using Microsoft.EntityFrameworkCore;

namespace CashBackend.Models
{
    public class PayerResponse
    {
        public int PayerId { get; set; }
        public string PayerName { get; set; }
        [Precision(18, 2)]
        public decimal AmountOwed { get; set; }
    }
}