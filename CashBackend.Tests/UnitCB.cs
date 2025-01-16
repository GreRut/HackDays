using System.Net.Http.Json;
using CashBackend.Tests;
using CashBackend.Models;
using FluentAssertions;

public class UnitCB
{
public class UserTest : IClassFixture<WebApiFactory>
{
    private WebApiFactory _WebApiFactory;

    public UserTest(WebApiFactory WebApiFactory)
    {
        _WebApiFactory = WebApiFactory;
    }


    [Fact]
    public async Task UserResponseShouldNotBeNull()
    {
        var UserRequest = new UserRequest
        {
            Name = "Bob",
        };

        var createResponse = await _WebApiFactory.Client.PostAsJsonAsync("/api/Users", UserRequest);

        var response = await _WebApiFactory.Client.GetFromJsonAsync<UserResponse>(createResponse.Headers.Location);

        response.Should().NotBeNull();
    }
}
}