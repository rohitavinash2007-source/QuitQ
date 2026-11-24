using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QuitQ.Api.Data;
using QuitQ.Api.DTOs;
using QuitQ.Api.Models;
using QuitQ.Api.Services;

namespace QuitQ.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly QuitQDbContext _context;
        private readonly IPasswordHasher _passwordHasher;
        private readonly IJwtService _jwtService;

        public AuthController(QuitQDbContext context, IPasswordHasher passwordHasher, IJwtService jwtService)
        {
            _context = context;
            _passwordHasher = passwordHasher;
            _jwtService = jwtService;
        }

        [HttpPost("register")]
        public async Task<ActionResult<AuthResponseDto>> Register([FromBody] RegisterDto dto)
        {
            if (await _context.Users.AnyAsync(u => u.Email.ToLower() == dto.Email.ToLower()))
            {
                return BadRequest(new { message = "Email address is already registered." });
            }

            if (await _context.Users.AnyAsync(u => u.Username.ToLower() == dto.Username.ToLower()))
            {
                return BadRequest(new { message = "Username is already taken." });
            }

            var role = dto.Role.Equals("Seller", StringComparison.OrdinalIgnoreCase) ? "Seller" : "Customer";

            var user = new User
            {
                Username = dto.Username.Trim(),
                Email = dto.Email.Trim().ToLower(),
                PasswordHash = _passwordHasher.HashPassword(dto.Password),
                FullName = dto.FullName.Trim(),
                Gender = dto.Gender,
                ContactNumber = dto.ContactNumber.Trim(),
                Address = dto.Address.Trim(),
                Role = role,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            string? storeName = null;
            if (role == "Seller")
            {
                storeName = string.IsNullOrWhiteSpace(dto.StoreName) ? $"{dto.FullName}'s Store" : dto.StoreName.Trim();
                var sellerProfile = new SellerProfile
                {
                    UserId = user.Id,
                    StoreName = storeName,
                    StoreDescription = dto.StoreDescription?.Trim() ?? "QuitQ Verified Seller Store",
                    BusinessAddress = dto.Address.Trim(),
                    GstNumber = dto.GstNumber?.Trim() ?? "GST-PENDING"
                };
                _context.SellerProfiles.Add(sellerProfile);
                await _context.SaveChangesAsync();
            }

            var token = _jwtService.GenerateToken(user);

            return Ok(new AuthResponseDto
            {
                Token = token,
                UserId = user.Id,
                Username = user.Username,
                Email = user.Email,
                FullName = user.FullName,
                Role = user.Role,
                ContactNumber = user.ContactNumber,
                Address = user.Address,
                StoreName = storeName
            });
        }

        [HttpPost("login")]
        public async Task<ActionResult<AuthResponseDto>> Login([FromBody] LoginDto dto)
        {
            var user = await _context.Users
                .Include(u => u.SellerProfile)
                .FirstOrDefaultAsync(u => 
                    u.Email.ToLower() == dto.UsernameOrEmail.ToLower() || 
                    u.Username.ToLower() == dto.UsernameOrEmail.ToLower());

            if (user == null || !_passwordHasher.VerifyPassword(dto.Password, user.PasswordHash))
            {
                return Unauthorized(new { message = "Invalid email/username or password." });
            }

            if (!user.IsActive)
            {
                return Unauthorized(new { message = "Your account has been deactivated. Please contact QuitQ support." });
            }

            var token = _jwtService.GenerateToken(user);

            return Ok(new AuthResponseDto
            {
                Token = token,
                UserId = user.Id,
                Username = user.Username,
                Email = user.Email,
                FullName = user.FullName,
                Role = user.Role,
                ContactNumber = user.ContactNumber,
                Address = user.Address,
                StoreName = user.SellerProfile?.StoreName
            });
        }

        [Authorize]
        [HttpGet("me")]
        public async Task<ActionResult<UserProfileDto>> GetCurrentUser()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value 
                ?? User.FindFirst("sub")?.Value;

            if (userIdClaim == null || !int.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized();
            }

            var user = await _context.Users
                .Include(u => u.SellerProfile)
                .FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null)
            {
                return NotFound(new { message = "User not found." });
            }

            return Ok(new UserProfileDto
            {
                Id = user.Id,
                Username = user.Username,
                Email = user.Email,
                FullName = user.FullName,
                Gender = user.Gender,
                ContactNumber = user.ContactNumber,
                Address = user.Address,
                Role = user.Role,
                IsActive = user.IsActive,
                CreatedAt = user.CreatedAt,
                StoreName = user.SellerProfile?.StoreName
            });
        }

        [HttpGet("demo-accounts")]
        public ActionResult GetDemoAccounts()
        {
            return Ok(new[]
            {
                new { role = "Customer", email = "john.doe@example.com", password = "Customer@123", name = "John Doe" },
                new { role = "Seller", email = "seller.tech@quitq.com", password = "Seller@123", name = "Apex Tech Traders" },
                new { role = "Admin", email = "admin@quitq.com", password = "Admin@123", name = "QuitQ Administrator" }
            });
        }
    }
}
