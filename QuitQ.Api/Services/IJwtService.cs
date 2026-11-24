using QuitQ.Api.Models;

namespace QuitQ.Api.Services
{
    public interface IJwtService
    {
        string GenerateToken(User user);
    }
}
