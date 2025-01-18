using Microsoft.EntityFrameworkCore;

namespace CashBackend.Models
{
    public class User
    {
        public int Id { get; set; }
        public required string Name { get; set; }
        [Precision(18, 2)]
        public decimal Balance { get; set; }
    }
}