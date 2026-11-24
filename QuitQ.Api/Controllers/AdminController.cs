using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QuitQ.Api.Data;
using QuitQ.Api.DTOs;

namespace QuitQ.Api.Controllers
{
    [Authorize(Roles = "Admin")]
    [ApiController]
    [Route("api/[controller]")]
    public class AdminController : ControllerBase
    {
        private readonly QuitQDbContext _context;

        public AdminController(QuitQDbContext context)
        {
            _context = context;
        }

        // Platform overview dashboard
        [HttpGet("dashboard")]
        public async Task<ActionResult> GetAdminDashboard()
        {
            var totalUsers = await _context.Users.CountAsync(u => u.Role == "Customer");
            var totalSellers = await _context.Users.CountAsync(u => u.Role == "Seller");
            var totalProducts = await _context.Products.CountAsync(p => p.IsActive);
            var totalOrders = await _context.Orders.CountAsync();
            var totalRevenue = await _context.Orders.SumAsync(o => o.TotalAmount);

            return Ok(new
            {
                totalUsers,
                totalSellers,
                totalProducts,
                totalOrders,
                totalRevenue
            });
        }

        // User Management: List Users and Sellers (Image 2 & 3)
        [HttpGet("users")]
        public async Task<ActionResult<List<UserProfileDto>>> GetUsers([FromQuery] string? role)
        {
            var query = _context.Users
                .Include(u => u.SellerProfile)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(role) && role != "All")
            {
                query = query.Where(u => u.Role.ToLower() == role.Trim().ToLower());
            }

            var users = await query
                .OrderByDescending(u => u.CreatedAt)
                .Select(u => new UserProfileDto
                {
                    Id = u.Id,
                    Username = u.Username,
                    Email = u.Email,
                    FullName = u.FullName,
                    Gender = u.Gender,
                    ContactNumber = u.ContactNumber,
                    Address = u.Address,
                    Role = u.Role,
                    IsActive = u.IsActive,
                    CreatedAt = u.CreatedAt,
                    StoreName = u.SellerProfile != null ? u.SellerProfile.StoreName : null
                })
                .ToListAsync();

            return Ok(users);
        }

        // User Management: Toggle Active/Deactivate account (Image 2: Manage user and seller accounts)
        [HttpPut("users/{id}/toggle-status")]
        public async Task<ActionResult> ToggleUserStatus(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound(new { message = "User not found." });
            }

            if (user.Role == "Admin")
            {
                return BadRequest(new { message = "Cannot deactivate master Administrator account." });
            }

            user.IsActive = !user.IsActive;
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = $"Account for {user.FullName} has been {(user.IsActive ? "Activated" : "Deactivated")}.",
                isActive = user.IsActive
            });
        }

        // Generate Reports (As simple list view) (Image 3: Use Case: Generate Reports(As simple list view))
        [HttpGet("reports")]
        public async Task<ActionResult<AdminSystemReportDto>> GenerateReports()
        {
            var totalUsers = await _context.Users.CountAsync(u => u.Role == "Customer");
            var totalSellers = await _context.Users.CountAsync(u => u.Role == "Seller");
            var totalProducts = await _context.Products.CountAsync(p => p.IsActive);
            var totalOrders = await _context.Orders.CountAsync();
            var totalRevenue = await _context.Orders.SumAsync(o => o.TotalAmount);

            var transactions = await _context.Orders
                .Include(o => o.User)
                .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.Seller)
                .OrderByDescending(o => o.CreatedAt)
                .Take(50)
                .Select(o => new PlatformTransactionRowDto
                {
                    OrderNumber = o.OrderNumber,
                    OrderDate = o.CreatedAt,
                    CustomerEmail = o.User.Email,
                    SellerName = o.OrderItems.Select(oi => oi.Seller.FullName).FirstOrDefault() ?? "Multiple Sellers",
                    TotalAmount = o.TotalAmount,
                    PaymentMethod = o.PaymentMethod,
                    PaymentStatus = o.PaymentStatus,
                    OrderStatus = o.OrderStatus
                })
                .ToListAsync();

            return Ok(new AdminSystemReportDto
            {
                TotalUsers = totalUsers,
                TotalSellers = totalSellers,
                TotalProducts = totalProducts,
                TotalOrders = totalOrders,
                TotalPlatformRevenue = totalRevenue,
                TransactionsList = transactions
            });
        }
    }
}
