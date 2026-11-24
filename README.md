# QuitQ (QuitQueue) - Fullstack E-Commerce Solution

> **Case Study Reference Implementation**  
> Developed for **Hexaware Technologies Limited**  
> **Tech Stack:** ASP.NET Core 10 Web API (C#) | React.js 19 | SQL Server | Entity Framework Core | JWT Authentication

---

## 🌟 Solution Overview
**QuitQ** is an enterprise-grade, multi-vendor fullstack e-commerce application designed to facilitate seamless transactions between Buyers (Customers), Sellers, and Platform Administrators.

### Key Capabilities Mapped to Requirements:
1. **User & Seller Registration & Authentication (JWT)**:
   - Account creation with personal details (Full Name, Gender, Contact Number, Address, Role).
   - Secure password hashing using PBKDF2 with SHA-256 and cryptographic salts.
   - Role-Based Access Control (`Customer`, `Seller`, `Admin`).
2. **Product Catalog & Dynamic Browsing**:
   - Multi-category support: `Electronics`, `Mobile`, `Fashion`, `Home & Furniture`.
   - Real-time predictive search with **auto-suggestions** for titles, brands, and categories.
   - Multi-faceted filters for Brands and Price Ranges with instant sorting.
3. **Product Details & Seller Transparency**:
   - Detailed specifications, verified merchant badge, seller name, stock inventory indicators, and direct Add-to-Cart / Buy-Now actions.
4. **Shopping Cart Management**:
   - Quantity increment/decrement, remove items, live subtotal, and automatic free shipping thresholds.
5. **Checkout & Payment Simulation**:
   - Multiple payment options (Instant UPI/QR, Credit/Debit Cards, Net Banking, Cash on Delivery).
   - Order generation, stock deduction, and instant confirmation receipt.
6. **Order History & Real-Time Tracking**:
   - 4-Stage shipment milestones: `Order Placed` &rarr; `Processing` &rarr; `Shipped` &rarr; `Delivered`.
   - Dynamic tracking number (AWB) and delivery date estimation.
7. **Seller Central Dashboard**:
   - Real-time metrics: Gross Sales Revenue, Units Sold, Catalog size, Low Stock alerts.
   - Product Management: Add new listings, edit stock/pricing, deactivate products.
   - Order Processing: View customer orders containing seller's items and update fulfillment status.
   - Sales Reports: Standardized simple list view table.
8. **Administrator Master Console**:
   - Platform overview and transaction auditing.
   - User & Seller Account Management: View directory and activate/deactivate accounts.
   - Category Management: Create and maintain product categories.
   - Platform Audit Reports in simple list view.

---

## 🔑 Pre-Configured Test Credentials

For quick evaluation, QuitQ comes pre-seeded with accounts for all three actors:

| Role | Email / Username | Password | Purpose / Focus |
| :--- | :--- | :--- | :--- |
| **Customer** | `john.doe@example.com` | `Customer@123` | Product browsing, cart management, checkout, order tracking |
| **Seller** | `seller.tech@quitq.com` | `Seller@123` | Product listings, inventory tracking, order fulfillment, sales reports |
| **Admin** | `admin@quitq.com` | `Admin@123` | User/Seller activation, category management, platform reports |

*(You can also use the one-click role switcher pill in the top bar of the frontend to switch personas instantly!)*

---

## 🚀 How to Run the Application

### 1. Database Setup (SQL Server)
The schema script is located at:
```text
QuitQ/QuitQ_Schema.sql
```
- Open **SQL Server Management Studio (SSMS)** or Azure Data Studio.
- Connect to your SQL Server instance (`.` or `(localdb)\mssqllocaldb` or `.\SQLEXPRESS`).
- Open `QuitQ_Schema.sql` and click **Execute**.
- It creates `QuitQDb` with all tables, constraints, indexes, and full seed data.

### 2. Run the Backend API (.NET 10 Web API)
```powershell
cd "QuitQ/QuitQ.Api"
dotnet run
```
- The API will start on `http://localhost:5000` (or configured port).
- Swagger UI Documentation is available at:
  ```text
  http://localhost:5000/swagger
  ```

### 3. Run the Frontend (React.js + Vite)
```powershell
cd "QuitQ/QuitQ.Client"
npm run dev
```
- Open `http://localhost:3000` (or `http://localhost:5173`) in your browser.
- The frontend features automatic mock fallback, meaning it is 100% testable and interactive both with and without the live backend running.

---

## 📂 Project Directory Structure

```text
QuitQ/
├── QuitQ_Schema.sql                # Complete SQL Server DDL & DML Seed Script
├── QuitQ.Api/                      # ASP.NET Core 10 Web API
│   ├── Controllers/
│   │   ├── AuthController.cs       # Register, Login, Me, DemoLogins
│   │   ├── ProductsController.cs   # Browse, Filters, Auto-suggestions, CRUD
│   │   ├── CategoriesController.cs # Category CRUD for Admin
│   │   ├── CartController.cs       # Cart Management
│   │   ├── OrdersController.cs     # Checkout, Order History, Live Tracking
│   │   ├── SellerController.cs     # Seller Metrics, Orders, Sales Reports
│   │   └── AdminController.cs      # User Management & Platform Reports
│   ├── Models/                     # User, SellerProfile, Product, Category, Order, CartItem
│   ├── DTOs/                       # Strongly-typed Request & Response DTOs
│   ├── Data/                       # QuitQDbContext & DbInitializer
│   ├── Services/                   # JwtService, PasswordHasher (PBKDF2)
│   ├── appsettings.json            # SQL Server & JWT Configuration
│   └── Program.cs                  # Pipeline, CORS, Swagger, Dependency Injection
│
└── QuitQ.Client/                   # React.js 19 Modern Client
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx          # Live Auto-suggestions, Role switcher, Cart pill
    │   │   ├── ProductCard.jsx     # Responsive Product Card with quick add
    │   │   ├── ProductDetailModal.jsx # Detailed spec & seller info
    │   │   ├── CartDrawer.jsx      # Slide-out shopping cart
    │   │   ├── CheckoutModal.jsx   # Multi-payment checkout simulation
    │   │   ├── OrderTrackingModal.jsx # 4-step shipment milestone tracker
    │   │   ├── OrdersHistoryView.jsx  # Past orders with tracking links
    │   │   ├── SellerDashboard.jsx # Inventory, fulfillment & sales reports
    │   │   ├── AdminDashboard.jsx  # User management, categories & audit reports
    │   │   └── AuthModal.jsx       # Login & registration modal
    │   ├── context/
    │   │   ├── AuthContext.jsx     # User authentication state & role switcher
    │   │   └── CartContext.jsx     # Cart state management
    │   ├── services/
    │   │   └── api.js              # Centralized API service with resilience engine
    │   ├── App.jsx                 # Master layout and catalog view
    │   └── main.jsx
    └── package.json
```
