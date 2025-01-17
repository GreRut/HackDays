namespace CashBackend.Models
{
    public class ItemRequest
    {
        public required string Name { get; set; }
        public required int Price { get; set; }
        public required int UserId { get; set; }
        public virtual required User User {get; set;}
    }
}