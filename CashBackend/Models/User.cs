using Microsoft.EntityFrameworkCore;

namespace CashBackend.Models
{
    public class User
    {
        public int Id { get; set; }
        public required string Name { get; set; }
        [Precision(18, 2)]
        public decimal Balance { get; set; }
        public ICollection<UserDebt> Payees { get; set; } = new List<UserDebt>();
        public ICollection<UserDebt> Payers { get; set; } = new List<UserDebt>();
    }
}