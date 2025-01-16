namespace CashBackend.Models
{
    public class Item
    {
        public int Id { get; set; }
        public required string Name { get; set; }
        public int Price { get; set; }
        public int UserId { get; set; }
        public required virtual User User {get; set;}
    }
}