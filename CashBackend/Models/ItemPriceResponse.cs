using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CashBackend.Models
{
    public class ItemPriceResponse
    {
        public int Id { get; set; }
        public required string Name { get; set; }
        public required int Price { get; set; }
        public required int UserId { get; set; }
    }
}