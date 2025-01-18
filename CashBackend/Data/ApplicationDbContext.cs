using Microsoft.EntityFrameworkCore;
using CashBackend.Models;

namespace CashBackend.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Item> Items { get; set; }
        public DbSet<UserDebt> UserDebts { get; set; }
        public DbSet<Payment> Payments { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<UserDebt>()
                .HasOne(ud => ud.FromUser)
                .WithMany(u => u.Payees)
                .HasForeignKey(ud => ud.FromUserId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<UserDebt>()
                .HasOne(ud => ud.ToUser)
                .WithMany(u => u.Payers)
                .HasForeignKey(ud => ud.ToUserId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Payment>()
                .HasOne(p => p.FromUser)
                .WithMany()
                .HasForeignKey(p => p.FromUserId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Payment>()
                .HasOne(p => p.ToUser)
                .WithMany()
                .HasForeignKey(p => p.ToUserId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}