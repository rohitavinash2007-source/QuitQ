using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QuitQ.Api.Data;
using QuitQ.Api.DTOs;
using QuitQ.Api.Models;

namespace QuitQ.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductsController : ControllerBase
    {
        private readonly QuitQDbContext _context;

        public ProductsController(QuitQDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<PagedResult<ProductDto>>> GetProducts([FromQuery] ProductFilterParams filter)
        {
            var query = _context.Products
                .Include(p => p.Category)
                .Include(p => p.Seller)
                    .ThenInclude(s => s.SellerProfile)
                .Where(p => p.IsActive)
                .AsQueryable();

            // Search filter
            if (!string.IsNullOrWhiteSpace(filter.SearchTerm))
            {
                var term = filter.SearchTerm.Trim().ToLower();
                query = query.Where(p => 
                    p.Title.ToLower().Contains(term) || 
                    p.Description.ToLower().Contains(term) || 
                    p.Brand.ToLower().Contains(term) ||
                    p.Category.Name.ToLower().Contains(term));
            }

            // Category filter
            if (filter.CategoryId.HasValue && filter.CategoryId.Value > 0)
            {
                query = query.Where(p => p.CategoryId == filter.CategoryId.Value);
            }
            else if (!string.IsNullOrWhiteSpace(filter.CategoryName) && filter.CategoryName != "All")
            {
                query = query.Where(p => p.Category.Name.ToLower() == filter.CategoryName.Trim().ToLower());
            }

            // Brand filter
            if (!string.IsNullOrWhiteSpace(filter.Brand) && filter.Brand != "All")
            {
                query = query.Where(p => p.Brand.ToLower() == filter.Brand.Trim().ToLower());
            }

            // Price range filter
            if (filter.MinPrice.HasValue)
            {
                query = query.Where(p => p.Price >= filter.MinPrice.Value);
            }
            if (filter.MaxPrice.HasValue)
            {
                query = query.Where(p => p.Price <= filter.MaxPrice.Value);
            }

            // Sorting
            query = filter.SortBy switch
            {
                "price_asc" => query.OrderBy(p => p.Price),
                "price_desc" => query.OrderByDescending(p => p.Price),
                "title" => query.OrderBy(p => p.Title),
                _ => query.OrderByDescending(p => p.CreatedAt) // default newest
            };

            var totalCount = await query.CountAsync();
            var items = await query
                .Skip((filter.PageNumber - 1) * filter.PageSize)
                .Take(filter.PageSize)
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
                    SellerName = p.Seller.FullName,
                    StoreName = p.Seller.SellerProfile != null ? p.Seller.SellerProfile.StoreName : p.Seller.FullName,
                    IsActive = p.IsActive,
                    CreatedAt = p.CreatedAt
                })
                .ToListAsync();

            return Ok(new PagedResult<ProductDto>
            {
                Items = items,
                TotalCount = totalCount,
                PageNumber = filter.PageNumber,
                PageSize = filter.PageSize
            });
        }

        // Search Auto-Suggestions & Predictive Text (Image 4, Step 2.2)
        [HttpGet("auto-suggestions")]
        public async Task<ActionResult<List<AutoSuggestionDto>>> GetAutoSuggestions([FromQuery] string q)
        {
            if (string.IsNullOrWhiteSpace(q) || q.Trim().Length < 1)
            {
                return Ok(new List<AutoSuggestionDto>());
            }

            var query = q.Trim().ToLower();
            var suggestions = new List<AutoSuggestionDto>();

            // 1. Match Product titles
            var productMatches = await _context.Products
                .Where(p => p.IsActive && p.Title.ToLower().Contains(query))
                .OrderBy(p => p.Title)
                .Take(5)
                .Select(p => new AutoSuggestionDto
                {
                    Suggestion = p.Title,
                    Type = "Product",
                    TargetId = p.Id
                })
                .ToListAsync();

            suggestions.AddRange(productMatches);

            // 2. Match Brands
            var brandMatches = await _context.Products
                .Where(p => p.IsActive && p.Brand.ToLower().Contains(query))
                .Select(p => p.Brand)
                .Distinct()
                .Take(3)
                .Select(b => new AutoSuggestionDto
                {
                    Suggestion = b,
                    Type = "Brand",
                    TargetId = null
                })
                .ToListAsync();

            suggestions.AddRange(brandMatches);

            // 3. Match Categories
            var categoryMatches = await _context.Categories
                .Where(c => c.Name.ToLower().Contains(query))
                .Take(2)
                .Select(c => new AutoSuggestionDto
                {
                    Suggestion = c.Name,
                    Type = "Category",
                    TargetId = c.Id
                })
                .ToListAsync();

            suggestions.AddRange(categoryMatches);

            return Ok(suggestions);
        }

        // Get Available Brands for Filter (Image 4, Step 2.1)
        [HttpGet("brands")]
        public async Task<ActionResult<List<string>>> GetBrands()
        {
            var brands = await _context.Products
                .Where(p => p.IsActive)
                .Select(p => p.Brand)
                .Distinct()
                .OrderBy(b => b)
                .ToListAsync();

            return Ok(brands);
        }

        // Product Details with Seller Name and information (Image 4, Step 2.3)
        [HttpGet("{id}")]
        public async Task<ActionResult<ProductDto>> GetProductById(int id)
        {
            var product = await _context.Products
                .Include(p => p.Category)
                .Include(p => p.Seller)
                    .ThenInclude(s => s.SellerProfile)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (product == null)
            {
                return NotFound(new { message = "Product not found." });
            }

            return Ok(new ProductDto
            {
                Id = product.Id,
                Title = product.Title,
                Description = product.Description,
                Price = product.Price,
                StockQuantity = product.StockQuantity,
                Brand = product.Brand,
                ImageUrl = product.ImageUrl,
                CategoryId = product.CategoryId,
                CategoryName = product.Category.Name,
                SellerId = product.SellerId,
                SellerName = product.Seller.FullName,
                StoreName = product.Seller.SellerProfile != null ? product.Seller.SellerProfile.StoreName : product.Seller.FullName,
                IsActive = product.IsActive,
                CreatedAt = product.CreatedAt
            });
        }

        // Create Product (Seller / Admin)
        [Authorize(Roles = "Seller,Admin")]
        [HttpPost]
        public async Task<ActionResult<ProductDto>> CreateProduct([FromBody] CreateProductDto dto)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userIdClaim == null || !int.TryParse(userIdClaim, out var currentUserId))
            {
                return Unauthorized();
            }

            var category = await _context.Categories.FindAsync(dto.CategoryId);
            if (category == null)
            {
                return BadRequest(new { message = "Invalid Category." });
            }

            var product = new Product
            {
                Title = dto.Title.Trim(),
                Description = dto.Description.Trim(),
                Price = dto.Price,
                StockQuantity = dto.StockQuantity,
                Brand = dto.Brand.Trim(),
                ImageUrl = string.IsNullOrWhiteSpace(dto.ImageUrl) 
                    ? "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&auto=format&fit=crop&q=80" 
                    : dto.ImageUrl.Trim(),
                CategoryId = dto.CategoryId,
                SellerId = currentUserId,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            };

            _context.Products.Add(product);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetProductById), new { id = product.Id }, new ProductDto
            {
                Id = product.Id,
                Title = product.Title,
                Description = product.Description,
                Price = product.Price,
                StockQuantity = product.StockQuantity,
                Brand = product.Brand,
                ImageUrl = product.ImageUrl,
                CategoryId = product.CategoryId,
                CategoryName = category.Name,
                SellerId = currentUserId,
                SellerName = User.Identity?.Name ?? "Seller",
                IsActive = product.IsActive,
                CreatedAt = product.CreatedAt
            });
        }

        // Update Product (Seller / Admin)
        [Authorize(Roles = "Seller,Admin")]
        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateProduct(int id, [FromBody] UpdateProductDto dto)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null)
            {
                return NotFound(new { message = "Product not found." });
            }

            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var userRole = User.FindFirst(ClaimTypes.Role)?.Value;

            if (userIdClaim == null || !int.TryParse(userIdClaim, out var currentUserId))
            {
                return Unauthorized();
            }

            // Sellers can only update their own products
            if (userRole != "Admin" && product.SellerId != currentUserId)
            {
                return Forbid();
            }

            product.Title = dto.Title.Trim();
            product.Description = dto.Description.Trim();
            product.Price = dto.Price;
            product.StockQuantity = dto.StockQuantity;
            product.Brand = dto.Brand.Trim();
            if (!string.IsNullOrWhiteSpace(dto.ImageUrl))
            {
                product.ImageUrl = dto.ImageUrl.Trim();
            }
            product.CategoryId = dto.CategoryId;
            product.IsActive = dto.IsActive;

            await _context.SaveChangesAsync();
            return Ok(new { message = "Product updated successfully." });
        }

        // Delete / Deactivate Product
        [Authorize(Roles = "Seller,Admin")]
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteProduct(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null)
            {
                return NotFound(new { message = "Product not found." });
            }

            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var userRole = User.FindFirst(ClaimTypes.Role)?.Value;

            if (userIdClaim == null || !int.TryParse(userIdClaim, out var currentUserId))
            {
                return Unauthorized();
            }

            if (userRole != "Admin" && product.SellerId != currentUserId)
            {
                return Forbid();
            }

            // Soft delete
            product.IsActive = false;
            await _context.SaveChangesAsync();

            return Ok(new { message = "Product deactivated successfully." });
        }
    }
}
