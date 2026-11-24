-- ==============================================================================
-- QuitQ (QuitQueue) Fullstack E-Commerce Database Schema
-- Technology: Microsoft SQL Server 2022 / 2025 / LocalDB
-- Case Study: Hexaware Technologies Limited
-- ==============================================================================

USE master;
GO

IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = N'QuitQDb')
BEGIN
    CREATE DATABASE QuitQDb;
END
GO

USE QuitQDb;
GO

-- 1. Users Table (Customer, Seller, Administrator)
IF OBJECT_ID(N'dbo.Users', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.Users (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        Username NVARCHAR(50) NOT NULL UNIQUE,
        Email NVARCHAR(100) NOT NULL UNIQUE,
        PasswordHash NVARCHAR(500) NOT NULL,
        FullName NVARCHAR(100) NOT NULL,
        Gender NVARCHAR(20) NULL,
        ContactNumber NVARCHAR(20) NOT NULL,
        Address NVARCHAR(250) NOT NULL,
        Role NVARCHAR(20) NOT NULL DEFAULT 'Customer', -- Customer, Seller, Admin
        IsActive BIT NOT NULL DEFAULT 1,
        CreatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
    );
END
GO

-- 2. Seller Profiles Table
IF OBJECT_ID(N'dbo.SellerProfiles', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.SellerProfiles (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        UserId INT NOT NULL UNIQUE,
        StoreName NVARCHAR(100) NOT NULL,
        StoreDescription NVARCHAR(500) NULL,
        BusinessAddress NVARCHAR(200) NULL,
        GstNumber NVARCHAR(50) NULL,
        CreatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
        CONSTRAINT FK_SellerProfiles_Users FOREIGN KEY (UserId) REFERENCES dbo.Users(Id) ON DELETE CASCADE
    );
END
GO

-- 3. Categories Table
IF OBJECT_ID(N'dbo.Categories', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.Categories (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        Name NVARCHAR(100) NOT NULL UNIQUE,
        Description NVARCHAR(500) NULL,
        ImageUrl NVARCHAR(250) NULL,
        CreatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
    );
END
GO

-- 4. Products Table
IF OBJECT_ID(N'dbo.Products', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.Products (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        Title NVARCHAR(150) NOT NULL,
        Description NVARCHAR(2000) NOT NULL,
        Price DECIMAL(18,2) NOT NULL CHECK (Price > 0),
        StockQuantity INT NOT NULL DEFAULT 0 CHECK (StockQuantity >= 0),
        Brand NVARCHAR(80) NOT NULL,
        ImageUrl NVARCHAR(500) NULL,
        CategoryId INT NOT NULL,
        SellerId INT NOT NULL,
        IsActive BIT NOT NULL DEFAULT 1,
        CreatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
        CONSTRAINT FK_Products_Categories FOREIGN KEY (CategoryId) REFERENCES dbo.Categories(Id),
        CONSTRAINT FK_Products_Users_Seller FOREIGN KEY (SellerId) REFERENCES dbo.Users(Id)
    );

    CREATE NONCLUSTERED INDEX IX_Products_Title ON dbo.Products(Title);
    CREATE NONCLUSTERED INDEX IX_Products_Brand ON dbo.Products(Brand);
    CREATE NONCLUSTERED INDEX IX_Products_Price ON dbo.Products(Price);
    CREATE NONCLUSTERED INDEX IX_Products_CategoryId ON dbo.Products(CategoryId);
END
GO

-- 5. Cart Items Table
IF OBJECT_ID(N'dbo.CartItems', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.CartItems (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        UserId INT NOT NULL,
        ProductId INT NOT NULL,
        Quantity INT NOT NULL DEFAULT 1 CHECK (Quantity > 0),
        AddedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
        CONSTRAINT UQ_CartItems_User_Product UNIQUE (UserId, ProductId),
        CONSTRAINT FK_CartItems_Users FOREIGN KEY (UserId) REFERENCES dbo.Users(Id) ON DELETE CASCADE,
        CONSTRAINT FK_CartItems_Products FOREIGN KEY (ProductId) REFERENCES dbo.Products(Id) ON DELETE CASCADE
    );
END
GO

-- 6. Orders Table
IF OBJECT_ID(N'dbo.Orders', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.Orders (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        OrderNumber NVARCHAR(40) NOT NULL UNIQUE,
        UserId INT NOT NULL,
        TotalAmount DECIMAL(18,2) NOT NULL,
        ShippingAddress NVARCHAR(300) NOT NULL,
        PaymentMethod NVARCHAR(50) NOT NULL DEFAULT 'Credit Card',
        PaymentStatus NVARCHAR(30) NOT NULL DEFAULT 'Completed',
        OrderStatus NVARCHAR(30) NOT NULL DEFAULT 'Placed', -- Placed, Processing, Shipped, Delivered, Cancelled
        TrackingNumber NVARCHAR(60) NULL,
        EstimatedDeliveryDate DATETIME2 NULL,
        CreatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
        CONSTRAINT FK_Orders_Users FOREIGN KEY (UserId) REFERENCES dbo.Users(Id)
    );

    CREATE NONCLUSTERED INDEX IX_Orders_UserId ON dbo.Orders(UserId);
    CREATE NONCLUSTERED INDEX IX_Orders_OrderNumber ON dbo.Orders(OrderNumber);
END
GO

-- 7. Order Items Table
IF OBJECT_ID(N'dbo.OrderItems', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.OrderItems (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        OrderId INT NOT NULL,
        ProductId INT NOT NULL,
        SellerId INT NOT NULL,
        Quantity INT NOT NULL CHECK (Quantity > 0),
        UnitPrice DECIMAL(18,2) NOT NULL,
        TotalPrice DECIMAL(18,2) NOT NULL,
        ItemStatus NVARCHAR(30) NOT NULL DEFAULT 'Placed',
        CONSTRAINT FK_OrderItems_Orders FOREIGN KEY (OrderId) REFERENCES dbo.Orders(Id) ON DELETE CASCADE,
        CONSTRAINT FK_OrderItems_Products FOREIGN KEY (ProductId) REFERENCES dbo.Products(Id),
        CONSTRAINT FK_OrderItems_Users_Seller FOREIGN KEY (SellerId) REFERENCES dbo.Users(Id)
    );

    CREATE NONCLUSTERED INDEX IX_OrderItems_OrderId ON dbo.OrderItems(OrderId);
    CREATE NONCLUSTERED INDEX IX_OrderItems_SellerId ON dbo.OrderItems(SellerId);
END
GO

-- ==============================================================================
-- SEED DATA
-- ==============================================================================

-- 1. Insert Default Users (Admin, Sellers, Customer)
IF NOT EXISTS (SELECT 1 FROM dbo.Users WHERE Email = 'admin@quitq.com')
BEGIN
    INSERT INTO dbo.Users (Username, Email, PasswordHash, FullName, Gender, ContactNumber, Address, Role, IsActive, CreatedAt)
    VALUES 
    ('admin', 'admin@quitq.com', 'AQAAAAIAAYagAAAAEG3J0s...', 'QuitQ Administrator', 'Other', '+91 9876543210', 'Hexaware Campus, Bangalore', 'Admin', 1, SYSUTCDATETIME()),
    ('apex_electronics', 'seller.tech@quitq.com', 'AQAAAAIAAYagAAAAEG3J0s...', 'Apex Tech Traders', 'Male', '+91 9811223344', 'Plot 42, Electronic City, Bangalore', 'Seller', 1, SYSUTCDATETIME()),
    ('vogue_fashion', 'seller.style@quitq.com', 'AQAAAAIAAYagAAAAEG3J0s...', 'Vogue Trendsetters', 'Female', '+91 9855667788', 'Shop 12, Fashion Blvd, Mumbai', 'Seller', 1, SYSUTCDATETIME()),
    ('john_doe', 'john.doe@example.com', 'AQAAAAIAAYagAAAAEG3J0s...', 'John Doe', 'Male', '+91 9123456789', 'Flat 304, Green Heights, Indiranagar, Bangalore', 'Customer', 1, SYSUTCDATETIME());
END
GO

-- 2. Insert Seller Profiles
IF NOT EXISTS (SELECT 1 FROM dbo.SellerProfiles WHERE StoreName = 'Apex Electronics & Gadgets')
BEGIN
    DECLARE @Seller1Id INT = (SELECT Id FROM dbo.Users WHERE Email = 'seller.tech@quitq.com');
    DECLARE @Seller2Id INT = (SELECT Id FROM dbo.Users WHERE Email = 'seller.style@quitq.com');

    INSERT INTO dbo.SellerProfiles (UserId, StoreName, StoreDescription, BusinessAddress, GstNumber)
    VALUES
    (@Seller1Id, 'Apex Electronics & Gadgets', 'Authorized retailer for top global brands in consumer tech & mobile.', 'Plot 42, Electronic City, Bangalore', '29ABCDE1234F1Z5'),
    (@Seller2Id, 'Vogue & Urban Living', 'Designer wear, contemporary apparel, and ergonomic furniture.', 'Shop 12, Fashion Blvd, Mumbai', '27XYZAB9876C1Z2');
END
GO

-- 3. Insert Categories
IF NOT EXISTS (SELECT 1 FROM dbo.Categories WHERE Name = 'Electronics')
BEGIN
    INSERT INTO dbo.Categories (Name, Description, ImageUrl)
    VALUES
    ('Electronics', 'High-performance laptops, noise-cancelling audio, smart home devices, and cameras.', 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600&auto=format&fit=crop&q=80'),
    ('Mobile', 'Flagship smartphones, 5G cellular tablets, and official smart accessories.', 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80'),
    ('Fashion', 'Contemporary men and women apparel, footwear, timepieces, and accessories.', 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&auto=format&fit=crop&q=80'),
    ('Home & Furniture', 'Ergonomic workspace furniture, Scandinavian decor, bedding, and kitchen essentials.', 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&auto=format&fit=crop&q=80');
END
GO

-- 4. Insert Products
IF NOT EXISTS (SELECT 1 FROM dbo.Products WHERE Title LIKE '%iPhone 15 Pro Max%')
BEGIN
    DECLARE @CatMobile INT = (SELECT Id FROM dbo.Categories WHERE Name = 'Mobile');
    DECLARE @CatElectronics INT = (SELECT Id FROM dbo.Categories WHERE Name = 'Electronics');
    DECLARE @CatFashion INT = (SELECT Id FROM dbo.Categories WHERE Name = 'Fashion');
    DECLARE @CatHome INT = (SELECT Id FROM dbo.Categories WHERE Name = 'Home & Furniture');

    DECLARE @SellerTech INT = (SELECT Id FROM dbo.Users WHERE Email = 'seller.tech@quitq.com');
    DECLARE @SellerStyle INT = (SELECT Id FROM dbo.Users WHERE Email = 'seller.style@quitq.com');

    INSERT INTO dbo.Products (Title, Description, Price, StockQuantity, Brand, ImageUrl, CategoryId, SellerId, IsActive)
    VALUES
    ('Apple iPhone 15 Pro Max 256GB Titanium', 'Forged in titanium with industry-leading A17 Pro chip and 48MP camera system.', 134999.00, 24, 'Apple', 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&auto=format&fit=crop&q=80', @CatMobile, @SellerTech, 1),
    ('Samsung Galaxy S24 Ultra 5G AI Smartphone', 'Experience Galaxy AI with circle to search, 200MP camera, and built-in S-Pen.', 129999.00, 18, 'Samsung', 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600&auto=format&fit=crop&q=80', @CatMobile, @SellerTech, 1),
    ('Google Pixel 8 Pro 128GB Obsidian', 'Google Tensor G3 chip with pro triple camera system and 24-hour battery.', 98999.00, 12, 'Google', 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&auto=format&fit=crop&q=80', @CatMobile, @SellerTech, 1),
    ('Sony WH-1000XM5 Wireless Noise-Canceling Headphones', 'Industry-leading noise cancellation with two processors and 8 microphones.', 28990.00, 45, 'Sony', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80', @CatElectronics, @SellerTech, 1),
    ('MacBook Pro 14 M3 Pro 18GB 512GB', 'Liquid Retina XDR display, up to 18 hours battery life, high speed performance.', 199900.00, 10, 'Apple', 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80', @CatElectronics, @SellerTech, 1),
    ('Dell XPS 15 9530 Core i9 OLED RTX 4070', 'Stunning 3.5K OLED touch display with NVIDIA GeForce RTX 4070 graphics.', 224990.00, 7, 'Dell', 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=600&auto=format&fit=crop&q=80', @CatElectronics, @SellerTech, 1),
    ('Nike Air Jordan 1 Retro High OG Sneaker', 'Iconic basketball silhouette with premium leather and encapsulated Air-Sole.', 16995.00, 30, 'Nike', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80', @CatFashion, @SellerStyle, 1),
    ('Levis Mens 511 Slim Fit Stretch Denim', 'Modern slim-cut jeans with stretch comfort and classic five-pocket styling.', 3499.00, 80, 'Levi''s', 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&auto=format&fit=crop&q=80', @CatFashion, @SellerStyle, 1),
    ('Fossil Gen 6 Hybrid Smartwatch', 'Classic analog watch aesthetics with always-on display and 2-week battery.', 18495.00, 22, 'Fossil', 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80', @CatFashion, @SellerStyle, 1),
    ('Ergonomic High-Back Executive Chair', 'Dynamic lumbar support, 3D armrests, and breathable Korean mesh.', 14999.00, 15, 'GreenSoul', 'https://images.unsplash.com/photo-1580481077195-c266a815a1a1?w=600&auto=format&fit=crop&q=80', @CatHome, @SellerStyle, 1),
    ('Solid Sheesham Wood Queen Size Bed', 'Handcrafted from seasoned Sheesham hardwood with hydraulic lift-up storage.', 38990.00, 8, 'Wakefit', 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600&auto=format&fit=crop&q=80', @CatHome, @SellerStyle, 1),
    ('IKEA Modern Minimalist Floor Lamp', 'Architectural brushed nickel finish with dual warm ambient diffusers.', 4990.00, 35, 'IKEA', 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&auto=format&fit=crop&q=80', @CatHome, @SellerStyle, 1);
END
GO

PRINT 'QuitQDb database schema and seed data created successfully!';
GO
