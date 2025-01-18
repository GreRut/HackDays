using Microsoft.EntityFrameworkCore;

namespace CashBackend.Models
{
    public class UserResponse
    {
        public int Id { get; set; }
        public required string Name { get; set; }
        [Precision(18, 2)]
        public decimal Balance { get; set; }
    }
}