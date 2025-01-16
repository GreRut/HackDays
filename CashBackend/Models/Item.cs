using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

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