using Microsoft.EntityFrameworkCore;

namespace CashBackend.Models
{
    public class UserResponse
    {
        public int Id { get; set; }
        public string Name { get; set; }
        [Precision(18, 2)]
        public decimal Balance { get; set; }
        public List<PayeeResponse> Payees { get; set; } = new();
        public List<PayerResponse> Payers { get; set; } = new();
    }
}