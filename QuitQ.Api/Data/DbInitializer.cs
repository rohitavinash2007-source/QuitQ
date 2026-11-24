using QuitQ.Api.Models;
using QuitQ.Api.Services;

namespace QuitQ.Api.Data
{
    public static class DbInitializer
    {
        public static void Initialize(QuitQDbContext context, IPasswordHasher passwordHasher)
        {
            context.Database.EnsureCreated();

            if (context.Users.Any())
            {
                return; // Database has already been seeded
            }

            // 1. Create Users
            var adminUser = new User
            {
                Username = "admin",
                Email = "admin@quitq.com",
                PasswordHash = passwordHasher.HashPassword("Admin@123"),
                FullName = "Administrator QuitQ",
                Gender = "Other",
                ContactNumber = "+91 9876543210",
                Address = "Hexaware Towers, Cyber City, Bangalore",
                Role = "Admin",
                IsActive = true,
                CreatedAt = DateTime.UtcNow.AddMonths(-3)
            };

            var seller1User = new User
            {
                Username = "apex_electronics",
                Email = "seller.tech@quitq.com",
                PasswordHash = passwordHasher.HashPassword("Seller@123"),
                FullName = "Apex Tech Traders",
                Gender = "Male",
                ContactNumber = "+91 9811223344",
                Address = "Plot 42, Electronic City Phase 1, Bangalore",
                Role = "Seller",
                IsActive = true,
                CreatedAt = DateTime.UtcNow.AddMonths(-2)
            };

            var seller2User = new User
            {
                Username = "vogue_fashion",
                Email = "seller.style@quitq.com",
                PasswordHash = passwordHasher.HashPassword("Seller@123"),
                FullName = "Vogue Trendsetters",
                Gender = "Female",
                ContactNumber = "+91 9855667788",
                Address = "Shop 12, Fashion Boulevard, Mumbai",
                Role = "Seller",
                IsActive = true,
                CreatedAt = DateTime.UtcNow.AddMonths(-2)
            };

            var customerUser = new User
            {
                Username = "john_doe",
                Email = "john.doe@example.com",
                PasswordHash = passwordHasher.HashPassword("Customer@123"),
                FullName = "John Doe",
                Gender = "Male",
                ContactNumber = "+91 9123456789",
                Address = "Flat 304, Green Heights, Indiranagar, Bangalore - 560038",
                Role = "Customer",
                IsActive = true,
                CreatedAt = DateTime.UtcNow.AddMonths(-1)
            };

            context.Users.AddRange(adminUser, seller1User, seller2User, customerUser);
            context.SaveChanges();

            // 2. Seller Profiles
            var sellerProfile1 = new SellerProfile
            {
                UserId = seller1User.Id,
                StoreName = "Apex Electronics & Gadgets",
                StoreDescription = "Authorized retailer for top global brands in consumer tech, smartphones, and accessories.",
                BusinessAddress = "Plot 42, Electronic City Phase 1, Bangalore",
                GstNumber = "29ABCDE1234F1Z5"
            };

            var sellerProfile2 = new SellerProfile
            {
                UserId = seller2User.Id,
                StoreName = "Vogue & Urban Living",
                StoreDescription = "Premium lifestyle apparel, designer wear, ergonomic home furnishings and modern decor.",
                BusinessAddress = "Shop 12, Fashion Boulevard, Mumbai",
                GstNumber = "27XYZAB9876C1Z2"
            };

            context.SellerProfiles.AddRange(sellerProfile1, sellerProfile2);
            context.SaveChanges();

            // 3. Categories (Electronics, Fashion, Mobile, Home & Furniture as per Image 4)
            var catElectronics = new Category
            {
                Name = "Electronics",
                Description = "High-performance laptops, noise-cancelling audio, smart home devices, and cameras.",
                ImageUrl = "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600&auto=format&fit=crop&q=80"
            };

            var catMobile = new Category
            {
                Name = "Mobile",
                Description = "Flagship smartphones, 5G cellular tablets, and official smart accessories.",
                ImageUrl = "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80"
            };

            var catFashion = new Category
            {
                Name = "Fashion",
                Description = "Contemporary men's & women's apparel, footwear, timepieces, and accessories.",
                ImageUrl = "https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&auto=format&fit=crop&q=80"
            };

            var catHome = new Category
            {
                Name = "Home & Furniture",
                Description = "Ergonomic workspace furniture, Scandinavian decor, bedding, and kitchen essentials.",
                ImageUrl = "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&auto=format&fit=crop&q=80"
            };

            context.Categories.AddRange(catElectronics, catMobile, catFashion, catHome);
            context.SaveChanges();

            // 4. Products
            var products = new List<Product>
            {
                // Mobile
                new Product
                {
                    Title = "Apple iPhone 15 Pro Max 256GB Titanium",
                    Description = "Forged in titanium with industry-leading A17 Pro chip, customizable Action button, and 48MP camera system with 5x optical zoom.",
                    Price = 134999.00m,
                    StockQuantity = 24,
                    Brand = "Apple",
                    ImageUrl = "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&auto=format&fit=crop&q=80",
                    CategoryId = catMobile.Id,
                    SellerId = seller1User.Id,
                    IsActive = true
                },
                new Product
                {
                    Title = "Samsung Galaxy S24 Ultra 5G AI Smartphone",
                    Description = "Experience Galaxy AI with circle to search, live translate, 200MP camera, built-in S-Pen, and Snapdragon 8 Gen 3 processor.",
                    Price = 129999.00m,
                    StockQuantity = 18,
                    Brand = "Samsung",
                    ImageUrl = "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600&auto=format&fit=crop&q=80",
                    CategoryId = catMobile.Id,
                    SellerId = seller1User.Id,
                    IsActive = true
                },
                new Product
                {
                    Title = "Google Pixel 8 Pro 128GB Obsidian",
                    Description = "Google Tensor G3 chip, advanced triple camera system with Super Res Zoom up to 30x, and 24-hour battery life.",
                    Price = 98999.00m,
                    StockQuantity = 12,
                    Brand = "Google",
                    ImageUrl = "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&auto=format&fit=crop&q=80",
                    CategoryId = catMobile.Id,
                    SellerId = seller1User.Id,
                    IsActive = true
                },

                // Electronics
                new Product
                {
                    Title = "Sony WH-1000XM5 Wireless Noise-Canceling Headphones",
                    Description = "Two processors and 8 microphones for industry-leading noise cancellation, crystal clear hands-free calling, and 30-hour battery life.",
                    Price = 28990.00m,
                    StockQuantity = 45,
                    Brand = "Sony",
                    ImageUrl = "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80",
                    CategoryId = catElectronics.Id,
                    SellerId = seller1User.Id,
                    IsActive = true
                },
                new Product
                {
                    Title = "MacBook Pro 14\" M3 Pro (18GB Unified Memory, 512GB SSD)",
                    Description = "Liquid Retina XDR display, up to 18 hours of battery life, advanced connectivity including three Thunderbolt 4 ports.",
                    Price = 199900.00m,
                    StockQuantity = 10,
                    Brand = "Apple",
                    ImageUrl = "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80",
                    CategoryId = catElectronics.Id,
                    SellerId = seller1User.Id,
                    IsActive = true
                },
                new Product
                {
                    Title = "Dell XPS 15 9530 Core i9 32GB RAM RTX 4070 OLED",
                    Description = "Stunning 3.5K OLED touch display, 13th Gen Intel Core i9 processor, NVIDIA GeForce RTX 4070 graphics, and machined aluminum chassis.",
                    Price = 224990.00m,
                    StockQuantity = 7,
                    Brand = "Dell",
                    ImageUrl = "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=600&auto=format&fit=crop&q=80",
                    CategoryId = catElectronics.Id,
                    SellerId = seller1User.Id,
                    IsActive = true
                },

                // Fashion
                new Product
                {
                    Title = "Nike Air Jordan 1 Retro High OG Sneaker",
                    Description = "Iconic basketball silhouette crafted from premium leather, encapsulated Air-Sole unit for lightweight cushioning, and rubber cupsole.",
                    Price = 16995.00m,
                    StockQuantity = 30,
                    Brand = "Nike",
                    ImageUrl = "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80",
                    CategoryId = catFashion.Id,
                    SellerId = seller2User.Id,
                    IsActive = true
                },
                new Product
                {
                    Title = "Levi's Men's 511 Slim Fit Stretch Denim Jeans",
                    Description = "Modern slim-cut jeans with room to move. Added stretch for all-day comfort, classic five-pocket styling, and zip fly.",
                    Price = 3499.00m,
                    StockQuantity = 80,
                    Brand = "Levi's",
                    ImageUrl = "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&auto=format&fit=crop&q=80",
                    CategoryId = catFashion.Id,
                    SellerId = seller2User.Id,
                    IsActive = true
                },
                new Product
                {
                    Title = "Fossil Gen 6 Hybrid Smartwatch with Leather Strap",
                    Description = "Classic analog watch aesthetics with always-on display, heart rate monitor, SpO2 sensor, and 2-week battery life.",
                    Price = 18495.00m,
                    StockQuantity = 22,
                    Brand = "Fossil",
                    ImageUrl = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80",
                    CategoryId = catFashion.Id,
                    SellerId = seller2User.Id,
                    IsActive = true
                },

                // Home & Furniture
                new Product
                {
                    Title = "Ergonomic High-Back Executive Mesh Office Chair",
                    Description = "Adjustable 3D armrests, dynamic lumbar support, breathable Korean mesh, pneumatic height adjustment, and tilt lock mechanism.",
                    Price = 14999.00m,
                    StockQuantity = 15,
                    Brand = "GreenSoul",
                    ImageUrl = "https://images.unsplash.com/photo-1580481077195-c266a815a1a1?w=600&auto=format&fit=crop&q=80",
                    CategoryId = catHome.Id,
                    SellerId = seller2User.Id,
                    IsActive = true
                },
                new Product
                {
                    Title = "Solid Sheesham Wood Queen Size Bed with Storage",
                    Description = "Handcrafted from seasoned Sheesham hardwood with warm walnut finish, hydraulic lift-up storage compartments, and sturdy slat support.",
                    Price = 38990.00m,
                    StockQuantity = 8,
                    Brand = "Wakefit",
                    ImageUrl = "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600&auto=format&fit=crop&q=80",
                    CategoryId = catHome.Id,
                    SellerId = seller2User.Id,
                    IsActive = true
                },
                new Product
                {
                    Title = "IKEA Modern Minimalist Floor Standing Lamp",
                    Description = "Architectural brushed nickel finish with dual warm ambient diffusers, foot-pedal switch, and energy-saving LED bulbs included.",
                    Price = 4990.00m,
                    StockQuantity = 35,
                    Brand = "IKEA",
                    ImageUrl = "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&auto=format&fit=crop&q=80",
                    CategoryId = catHome.Id,
                    SellerId = seller2User.Id,
                    IsActive = true
                }
            };

            context.Products.AddRange(products);
            context.SaveChanges();

            // 5. Seed an initial sample order for Customer to test View Order & Track Order immediately
            var initialOrder = new Order
            {
                OrderNumber = "QQ-202611-00198",
                UserId = customerUser.Id,
                TotalAmount = 45985.00m,
                ShippingAddress = customerUser.Address,
                PaymentMethod = "UPI",
                PaymentStatus = "Completed",
                OrderStatus = "Shipped", // Test tracking in Shipped state!
                TrackingNumber = "BLUEDART-882910471",
                EstimatedDeliveryDate = DateTime.UtcNow.AddDays(2),
                CreatedAt = DateTime.UtcNow.AddDays(-2)
            };

            context.Orders.Add(initialOrder);
            context.SaveChanges();

            var orderItem1 = new OrderItem
            {
                OrderId = initialOrder.Id,
                ProductId = products[3].Id, // Sony WH-1000XM5
                SellerId = seller1User.Id,
                Quantity = 1,
                UnitPrice = 28990.00m,
                TotalPrice = 28990.00m,
                ItemStatus = "Shipped"
            };

            var orderItem2 = new OrderItem
            {
                OrderId = initialOrder.Id,
                ProductId = products[6].Id, // Nike Air Jordan 1
                SellerId = seller2User.Id,
                Quantity = 1,
                UnitPrice = 16995.00m,
                TotalPrice = 16995.00m,
                ItemStatus = "Shipped"
            };

            context.OrderItems.AddRange(orderItem1, orderItem2);

            // 6. Seed one active item in Customer cart for quick testing
            var initialCartItem = new CartItem
            {
                UserId = customerUser.Id,
                ProductId = products[0].Id, // iPhone 15 Pro Max
                Quantity = 1,
                AddedAt = DateTime.UtcNow
            };
            context.CartItems.Add(initialCartItem);

            context.SaveChanges();
        }
    }
}
