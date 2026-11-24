using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QuitQ.Api.Data;
using QuitQ.Api.DTOs;

namespace QuitQ.Api.Controllers
{
    [Authorize(Roles = "Seller,Admin")]
    [ApiController]
    [Route("api/[controller]")]
    public class SellerController : ControllerBase
    {
        private readonly QuitQDbContext _context;

        public SellerController(QuitQDbContext context)
        {
            _context = context;
        }

        private int GetSellerId()
        {
            var claim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? User.FindFirst("sub")?.Value;
            return int.Parse(claim!);
        }

        // Seller Dashboard metrics
        [HttpGet("dashboard")]
        public async Task<ActionResult> GetDashboardMetrics()
        {
            var sellerId = GetSellerId();

            var totalProducts = await _context.Products.CountAsync(p => p.SellerId == sellerId && p.IsActive);
            var lowStockCount = await _context.Products.CountAsync(p => p.SellerId == sellerId && p.IsActive && p.StockQuantity < 10);
            
            var orderItems = await _context.OrderItems
                .Where(oi => oi.SellerId == sellerId)
                .ToListAsync();

            var totalRevenue = orderItems.Sum(oi => oi.TotalPrice);
            var totalUnitsSold = orderItems.Sum(oi => oi.Quantity);
            var totalOrders = orderItems.Select(oi => oi.OrderId).Distinct().Count();

            return Ok(new
            {
                totalProducts,
                lowStockCount,
                totalRevenue,
                totalUnitsSold,
                totalOrders
            });
        }

        // Seller Product Management (Image 3)
        [HttpGet("products")]
        public async Task<ActionResult<List<ProductDto>>> GetSellerProducts()
        {
            var sellerId = GetSellerId();

            var products = await _context.Products
                .Include(p => p.Category)
                .Where(p => p.SellerId == sellerId)
                .OrderByDescending(p => p.CreatedAt)
                .Select(p => new ProductDto
                {
                    Id = p.Id,
                    Title = p.Title,
                    Description = p.Description,
                    Price = p.Price,
                    StockQuantity = p.StockQuantity,
                    Brand = p.Brand,
                    ImageUrl = p.ImageUrl,
                    CategoryId = p.CategoryId,
                    CategoryName = p.Category.Name,
                    SellerId = p.SellerId,
                    SellerName = User.Identity!.Name ?? "Seller",
                    IsActive = p.IsActive,
                    CreatedAt = p.CreatedAt
                })
                .ToListAsync();

            return Ok(products);
        }

        // Seller Order Processing (Image 3)
        [HttpGet("orders")]
        public async Task<ActionResult> GetSellerOrders()
        {
            var sellerId = GetSellerId();

            var orderItems = await _context.OrderItems
                .Include(oi => oi.Order)
                    .ThenInclude(o => o.User)
                .Include(oi => oi.Product)
                .Where(oi => oi.SellerId == sellerId)
                .OrderByDescending(oi => oi.Order.CreatedAt)
                .Select(oi => new
                {
                    orderItemId = oi.Id,
                    orderId = oi.OrderId,
                    orderNumber = oi.Order.OrderNumber,
                    orderDate = oi.Order.CreatedAt,
                    customerName = oi.Order.User.FullName,
                    customerContact = oi.Order.User.ContactNumber,
                    shippingAddress = oi.Order.ShippingAddress,
                    productId = oi.ProductId,
                    productTitle = oi.Product.Title,
                    productImage = oi.Product.ImageUrl,
                    quantity = oi.Quantity,
                    unitPrice = oi.UnitPrice,
                    totalPrice = oi.TotalPrice,
                    itemStatus = oi.ItemStatus,
                    overallOrderStatus = oi.Order.OrderStatus
                })
                .ToListAsync();

            return Ok(orderItems);
        }

        // Sales Reports (Image 3: Use Case: Sales Reports)
        [HttpGet("sales-report")]
        public async Task<ActionResult<SellerSalesReportDto>> GetSalesReport()
        {
            var sellerId = GetSellerId();

            var orderItems = await _context.OrderItems
                .Include(oi => oi.Order)
                    .ThenInclude(o => o.User)
                .Include(oi => oi.Product)
                .Where(oi => oi.SellerId == sellerId)
                .ToListAsync();

            var totalRevenue = orderItems.Sum(oi => oi.TotalPrice);
            var totalUnitsSold = orderItems.Sum(oi => oi.Quantity);
            var totalOrdersProcessed = orderItems.Select(oi => oi.OrderId).Distinct().Count();

            // Product Sales breakdown
            var productSales = await _context.Products
                .Where(p => p.SellerId == sellerId)
                .Select(p => new ProductSalesItemDto
                {
                    ProductId = p.Id,
                    Title = p.Title,
                    Brand = p.Brand,
                    UnitsSold = p.OrderItems.Sum(oi => oi.Quantity),
                    Revenue = p.OrderItems.Sum(oi => oi.TotalPrice),
                    RemainingStock = p.StockQuantity
                })
                .OrderByDescending(ps => ps.Revenue)
                .ToListAsync();

            // Simple list view of sales
            var recentSalesList = orderItems
                .OrderByDescending(oi => oi.Order.CreatedAt)
                .Take(25)
                .Select(oi => new OrderReportRowDto
                {
                    OrderNumber = oi.Order.OrderNumber,
                    OrderDate = oi.Order.CreatedAt,
                    CustomerName = oi.Order.User.FullName,
                    ProductName = oi.Product.Title,
                    Quantity = oi.Quantity,
                    Amount = oi.TotalPrice,
                    Status = oi.ItemStatus
                })
                .ToList();

            return Ok(new SellerSalesReportDto
            {
                TotalRevenue = totalRevenue,
                TotalUnitsSold = totalUnitsSold,
                TotalOrdersProcessed = totalOrdersProcessed,
                ProductSales = productSales,
                RecentSalesList = recentSalesList
            });
        }
    }
}
