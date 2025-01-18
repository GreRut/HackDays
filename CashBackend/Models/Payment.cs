using Microsoft.EntityFrameworkCore;

namespace CashBackend.Models
{
    public class Payment
    {
        public int Id { get; set; }
        public int FromUserId { get; set; }
        public int ToUserId { get; set; }
        [Precision(18, 2)]
        public decimal Amount { get; set; }
        public DateTime Timestamp { get; set; }

        public User FromUser { get; set; }
        public User ToUser { get; set; }
    }
}