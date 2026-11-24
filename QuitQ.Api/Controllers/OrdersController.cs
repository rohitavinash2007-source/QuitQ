using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QuitQ.Api.Data;
using QuitQ.Api.DTOs;
using QuitQ.Api.Models;

namespace QuitQ.Api.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class OrdersController : ControllerBase
    {
        private readonly QuitQDbContext _context;

        public OrdersController(QuitQDbContext context)
        {
            _context = context;
        }

        private int GetUserId()
        {
            var claim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? User.FindFirst("sub")?.Value;
            return int.Parse(claim!);
        }

        // Checkout / Place Order (Image 2 & 3: checkout/place order)
        [HttpPost("checkout")]
        public async Task<ActionResult<OrderDto>> Checkout([FromBody] CheckoutDto dto)
        {
            var userId = GetUserId();

            var user = await _context.Users.FindAsync(userId);
            if (user == null) return Unauthorized();

            var cartItems = await _context.CartItems
                .Include(c => c.Product)
                    .ThenInclude(p => p.Seller)
                .Where(c => c.UserId == userId)
                .ToListAsync();

            if (!cartItems.Any())
            {
                return BadRequest(new { message = "Your cart is empty. Add items before checkout." });
            }

            // Verify stock
            foreach (var item in cartItems)
            {
                if (item.Product.StockQuantity < item.Quantity)
                {
                    return BadRequest(new { message = $"Insufficient stock for {item.Product.Title}." });
                }
            }

            var subtotal = cartItems.Sum(c => c.Product.Price * c.Quantity);
            var shipping = subtotal > 500 ? 0 : 50;
            var grandTotal = subtotal + shipping;

            var orderNumber = $"QQ-{DateTime.UtcNow:yyyyMMdd}-{Random.Shared.Next(10000, 99999)}";
            var trackingNumber = $"QQTRK-{Random.Shared.Next(10000000, 99999999)}";

            var order = new Order
            {
                OrderNumber = orderNumber,
                UserId = userId,
                TotalAmount = grandTotal,
                ShippingAddress = string.IsNullOrWhiteSpace(dto.ShippingAddress) ? user.Address : dto.ShippingAddress.Trim(),
                PaymentMethod = dto.PaymentMethod,
                PaymentStatus = "Completed",
                OrderStatus = "Placed",
                TrackingNumber = trackingNumber,
                EstimatedDeliveryDate = DateTime.UtcNow.AddDays(4),
                CreatedAt = DateTime.UtcNow
            };

            _context.Orders.Add(order);
            await _context.SaveChangesAsync();

            // Create OrderItems and deduct stock
            var orderItems = new List<OrderItem>();
            foreach (var cartItem in cartItems)
            {
                var orderItem = new OrderItem
                {
                    OrderId = order.Id,
                    ProductId = cartItem.ProductId,
                    SellerId = cartItem.Product.SellerId,
                    Quantity = cartItem.Quantity,
                    UnitPrice = cartItem.Product.Price,
                    TotalPrice = cartItem.Product.Price * cartItem.Quantity,
                    ItemStatus = "Placed"
                };
                orderItems.Add(orderItem);

                // Deduct stock
                cartItem.Product.StockQuantity -= cartItem.Quantity;
            }

            _context.OrderItems.AddRange(orderItems);

            // Clear user's cart
            _context.CartItems.RemoveRange(cartItems);

            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetOrderById), new { id = order.Id }, new OrderDto
            {
                Id = order.Id,
                OrderNumber = order.OrderNumber,
                UserId = order.UserId,
                CustomerName = user.FullName,
                CustomerEmail = user.Email,
                ContactNumber = user.ContactNumber,
                TotalAmount = order.TotalAmount,
                ShippingAddress = order.ShippingAddress,
                PaymentMethod = order.PaymentMethod,
                PaymentStatus = order.PaymentStatus,
                OrderStatus = order.OrderStatus,
                TrackingNumber = order.TrackingNumber,
                EstimatedDeliveryDate = order.EstimatedDeliveryDate,
                CreatedAt = order.CreatedAt,
                Items = orderItems.Select(oi => new OrderItemDto
                {
                    Id = oi.Id,
                    ProductId = oi.ProductId,
                    ProductTitle = oi.Product?.Title ?? "Product",
                    ProductImage = oi.Product?.ImageUrl ?? "",
                    Brand = oi.Product?.Brand ?? "",
                    SellerId = oi.SellerId,
                    Quantity = oi.Quantity,
                    UnitPrice = oi.UnitPrice,
                    TotalPrice = oi.TotalPrice,
                    ItemStatus = oi.ItemStatus
                }).ToList()
            });
        }

        // View orders history (Image 2 & 3: view orders history)
        [HttpGet]
        public async Task<ActionResult<List<OrderDto>>> GetMyOrders()
        {
            var userId = GetUserId();

            var orders = await _context.Orders
                .Include(o => o.User)
                .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.Product)
                .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.Seller)
                .Where(o => o.UserId == userId)
                .OrderByDescending(o => o.CreatedAt)
                .Select(o => new OrderDto
                {
                    Id = o.Id,
                    OrderNumber = o.OrderNumber,
                    UserId = o.UserId,
                    CustomerName = o.User.FullName,
                    CustomerEmail = o.User.Email,
                    ContactNumber = o.User.ContactNumber,
                    TotalAmount = o.TotalAmount,
                    ShippingAddress = o.ShippingAddress,
                    PaymentMethod = o.PaymentMethod,
                    PaymentStatus = o.PaymentStatus,
                    OrderStatus = o.OrderStatus,
                    TrackingNumber = o.TrackingNumber,
                    EstimatedDeliveryDate = o.EstimatedDeliveryDate,
                    CreatedAt = o.CreatedAt,
                    Items = o.OrderItems.Select(oi => new OrderItemDto
                    {
                        Id = oi.Id,
                        ProductId = oi.ProductId,
                        ProductTitle = oi.Product.Title,
                        ProductImage = oi.Product.ImageUrl,
                        Brand = oi.Product.Brand,
                        SellerId = oi.SellerId,
                        SellerName = oi.Seller.FullName,
                        Quantity = oi.Quantity,
                        UnitPrice = oi.UnitPrice,
                        TotalPrice = oi.TotalPrice,
                        ItemStatus = oi.ItemStatus
                    }).ToList()
                })
                .ToListAsync();

            return Ok(orders);
        }

        // View single order (Image 2: view order)
        [HttpGet("{id}")]
        public async Task<ActionResult<OrderDto>> GetOrderById(int id)
        {
            var userId = GetUserId();
            var userRole = User.FindFirst(ClaimTypes.Role)?.Value;

            var order = await _context.Orders
                .Include(o => o.User)
                .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.Product)
                .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.Seller)
                .FirstOrDefaultAsync(o => o.Id == id);

            if (order == null)
            {
                return NotFound(new { message = "Order not found." });
            }

            // Authorization: Customers can only see their own orders
            if (userRole == "Customer" && order.UserId != userId)
            {
                return Forbid();
            }

            return Ok(new OrderDto
            {
                Id = order.Id,
                OrderNumber = order.OrderNumber,
                UserId = order.UserId,
                CustomerName = order.User.FullName,
                CustomerEmail = order.User.Email,
                ContactNumber = order.User.ContactNumber,
                TotalAmount = order.TotalAmount,
                ShippingAddress = order.ShippingAddress,
                PaymentMethod = order.PaymentMethod,
                PaymentStatus = order.PaymentStatus,
                OrderStatus = order.OrderStatus,
                TrackingNumber = order.TrackingNumber,
                EstimatedDeliveryDate = order.EstimatedDeliveryDate,
                CreatedAt = order.CreatedAt,
                Items = order.OrderItems.Select(oi => new OrderItemDto
                {
                    Id = oi.Id,
                    ProductId = oi.ProductId,
                    ProductTitle = oi.Product.Title,
                    ProductImage = oi.Product.ImageUrl,
                    Brand = oi.Product.Brand,
                    SellerId = oi.SellerId,
                    SellerName = oi.Seller.FullName,
                    Quantity = oi.Quantity,
                    UnitPrice = oi.UnitPrice,
                    TotalPrice = oi.TotalPrice,
                    ItemStatus = oi.ItemStatus
                }).ToList()
            });
        }

        // Track Order (Image 2: track order)
        [HttpGet("{orderNumber}/track")]
        public async Task<ActionResult<OrderTrackingDto>> TrackOrder(string orderNumber)
        {
            var order = await _context.Orders.FirstOrDefaultAsync(o => o.OrderNumber == orderNumber);
            if (order == null)
            {
                return NotFound(new { message = "Order not found for tracking." });
            }

            var statuses = new[] { "Placed", "Processing", "Shipped", "Delivered" };
            var currentIndex = Array.IndexOf(statuses, order.OrderStatus);
            if (currentIndex == -1 && order.OrderStatus == "Cancelled")
            {
                currentIndex = -1;
            }

            var steps = new List<OrderTrackingStepDto>
            {
                new OrderTrackingStepDto
                {
                    Status = "Placed",
                    Description = "Order placed and payment authorized.",
                    IsCompleted = currentIndex >= 0,
                    IsCurrent = order.OrderStatus == "Placed",
                    Timestamp = order.CreatedAt
                },
                new OrderTrackingStepDto
                {
                    Status = "Processing",
                    Description = "Seller has verified and packed your items.",
                    IsCompleted = currentIndex >= 1,
                    IsCurrent = order.OrderStatus == "Processing",
                    Timestamp = currentIndex >= 1 ? order.CreatedAt.AddHours(4) : null
                },
                new OrderTrackingStepDto
                {
                    Status = "Shipped",
                    Description = "Dispatched with logistics carrier.",
                    IsCompleted = currentIndex >= 2,
                    IsCurrent = order.OrderStatus == "Shipped",
                    Timestamp = currentIndex >= 2 ? order.CreatedAt.AddDays(1) : null
                },
                new OrderTrackingStepDto
                {
                    Status = "Delivered",
                    Description = "Package safely delivered to your address.",
                    IsCompleted = currentIndex >= 3,
                    IsCurrent = order.OrderStatus == "Delivered",
                    Timestamp = currentIndex >= 3 ? order.CreatedAt.AddDays(3) : null
                }
            };

            return Ok(new OrderTrackingDto
            {
                OrderNumber = order.OrderNumber,
                CurrentStatus = order.OrderStatus,
                TrackingNumber = order.TrackingNumber,
                EstimatedDeliveryDate = order.EstimatedDeliveryDate,
                Steps = steps
            });
        }

        // Update Order Status (Seller / Admin)
        [Authorize(Roles = "Seller,Admin")]
        [HttpPut("{id}/status")]
        public async Task<ActionResult> UpdateOrderStatus(int id, [FromBody] UpdateOrderStatusDto dto)
        {
            var order = await _context.Orders
                .Include(o => o.OrderItems)
                .FirstOrDefaultAsync(o => o.Id == id);

            if (order == null)
            {
                return NotFound(new { message = "Order not found." });
            }

            order.OrderStatus = dto.OrderStatus;
            foreach (var item in order.OrderItems)
            {
                item.ItemStatus = dto.OrderStatus;
            }

            await _context.SaveChangesAsync();
            return Ok(new { message = $"Order status updated to {dto.OrderStatus}." });
        }
    }
}
