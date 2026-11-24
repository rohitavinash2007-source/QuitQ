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
    public class CartController : ControllerBase
    {
        private readonly QuitQDbContext _context;

        public CartController(QuitQDbContext context)
        {
            _context = context;
        }

        private int GetUserId()
        {
            var claim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? User.FindFirst("sub")?.Value;
            return int.Parse(claim!);
        }

        [HttpGet]
        public async Task<ActionResult<CartDto>> GetCart()
        {
            var userId = GetUserId();

            var cartItems = await _context.CartItems
                .Include(c => c.Product)
                    .ThenInclude(p => p.Seller)
                .Where(c => c.UserId == userId)
                .Select(c => new CartItemDto
                {
                    Id = c.Id,
                    ProductId = c.ProductId,
                    Title = c.Product.Title,
                    Brand = c.Product.Brand,
                    ImageUrl = c.Product.ImageUrl,
                    UnitPrice = c.Product.Price,
                    Quantity = c.Quantity,
                    AvailableStock = c.Product.StockQuantity,
                    SellerName = c.Product.Seller.FullName
                })
                .ToListAsync();

            return Ok(new CartDto
            {
                Items = cartItems
            });
        }

        [HttpPost]
        public async Task<ActionResult<CartDto>> AddToCart([FromBody] AddToCartDto dto)
        {
            var userId = GetUserId();

            var product = await _context.Products.FindAsync(dto.ProductId);
            if (product == null || !product.IsActive)
            {
                return NotFound(new { message = "Product not available." });
            }

            if (product.StockQuantity < dto.Quantity)
            {
                return BadRequest(new { message = $"Only {product.StockQuantity} items in stock." });
            }

            var existingItem = await _context.CartItems
                .FirstOrDefaultAsync(c => c.UserId == userId && c.ProductId == dto.ProductId);

            if (existingItem != null)
            {
                var newQty = existingItem.Quantity + dto.Quantity;
                if (newQty > product.StockQuantity)
                {
                    return BadRequest(new { message = $"Cannot exceed available stock of {product.StockQuantity}." });
                }
                existingItem.Quantity = newQty;
            }
            else
            {
                var cartItem = new CartItem
                {
                    UserId = userId,
                    ProductId = dto.ProductId,
                    Quantity = dto.Quantity,
                    AddedAt = DateTime.UtcNow
                };
                _context.CartItems.Add(cartItem);
            }

            await _context.SaveChangesAsync();
            return await GetCart();
        }

        [HttpPut("{productId}")]
        public async Task<ActionResult<CartDto>> UpdateQuantity(int productId, [FromBody] UpdateCartItemDto dto)
        {
            var userId = GetUserId();

            var cartItem = await _context.CartItems
                .Include(c => c.Product)
                .FirstOrDefaultAsync(c => c.UserId == userId && c.ProductId == productId);

            if (cartItem == null)
            {
                return NotFound(new { message = "Item not found in cart." });
            }

            if (dto.Quantity <= 0)
            {
                _context.CartItems.Remove(cartItem);
            }
            else
            {
                if (cartItem.Product.StockQuantity < dto.Quantity)
                {
                    return BadRequest(new { message = $"Only {cartItem.Product.StockQuantity} items in stock." });
                }
                cartItem.Quantity = dto.Quantity;
            }

            await _context.SaveChangesAsync();
            return await GetCart();
        }

        [HttpDelete("{productId}")]
        public async Task<ActionResult<CartDto>> RemoveFromCart(int productId)
        {
            var userId = GetUserId();

            var cartItem = await _context.CartItems
                .FirstOrDefaultAsync(c => c.UserId == userId && c.ProductId == productId);

            if (cartItem != null)
            {
                _context.CartItems.Remove(cartItem);
                await _context.SaveChangesAsync();
            }

            return await GetCart();
        }

        [HttpDelete]
        public async Task<ActionResult> ClearCart()
        {
            var userId = GetUserId();
            var items = await _context.CartItems.Where(c => c.UserId == userId).ToListAsync();
            _context.CartItems.RemoveRange(items);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Cart cleared." });
        }
    }
}
