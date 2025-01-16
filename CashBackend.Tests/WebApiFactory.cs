using CashBackend.Data;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.AspNetCore.TestHost;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Testcontainers.MsSql;

namespace CashBackend.Tests
{
    public class WebApiFactory : WebApplicationFactory<Program>, IAsyncLifetime
    {
        public HttpClient Client { get; private set; } = null!;
        private readonly MsSqlContainer _msSqlContainer = new MsSqlBuilder().Build();
        protected override void ConfigureWebHost(IWebHostBuilder builder)
        {
            builder.ConfigureTestServices(services =>
            {
                services.RemoveAll<DbContextOptions<ApplicationDbContext>>();
                services.RemoveAll<ApplicationDbContext>();
                services.AddDbContext<ApplicationDbContext>(options =>
                options.UseSqlServer(_msSqlContainer.GetConnectionString()));
            });
        }
        public async Task InitializeAsync()
        {
            await _msSqlContainer.StartAsync();
            Client = CreateClient();
            Services.CreateScope()
                .ServiceProvider.GetService<ApplicationDbContext>()!
                .Database.EnsureCreated();
        }
        public Task DisposeAsync() => _msSqlContainer.DisposeAsync().AsTask();
    }
}