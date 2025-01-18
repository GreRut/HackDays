using Microsoft.EntityFrameworkCore;

namespace CashBackend.Models
{
public class PayeeResponse
{
    public int PayeeId { get; set; }
    public string PayeeName { get; set; }
    [Precision(18, 2)]
    public decimal AmountOwed { get; set; }
}
}