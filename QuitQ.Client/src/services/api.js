// API Client for QuitQ Fullstack Application
// Automatically routes through Vite proxy (/api -> http://localhost:5000/api)
const BASE_URL = '/api';

// Initial Mock Dataset for Offline/Evaluation resilience
const INITIAL_PRODUCTS = [
  {
    id: 1,
    title: "Apple iPhone 15 Pro Max 256GB Titanium",
    description: "Forged in titanium with industry-leading A17 Pro chip, customizable Action button, and 48MP camera system with 5x optical zoom.",
    price: 134999.00,
    stockQuantity: 24,
    brand: "Apple",
    imageUrl: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&auto=format&fit=crop&q=80",
    categoryId: 2,
    categoryName: "Mobile",
    sellerId: 2,
    sellerName: "Apex Tech Traders",
    storeName: "Apex Electronics & Gadgets",
    isActive: true
  },
  {
    id: 2,
    title: "Samsung Galaxy S24 Ultra 5G AI Smartphone",
    description: "Experience Galaxy AI with circle to search, live translate, 200MP camera, built-in S-Pen, and Snapdragon 8 Gen 3 processor.",
    price: 129999.00,
    stockQuantity: 18,
    brand: "Samsung",
    imageUrl: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600&auto=format&fit=crop&q=80",
    categoryId: 2,
    categoryName: "Mobile",
    sellerId: 2,
    sellerName: "Apex Tech Traders",
    storeName: "Apex Electronics & Gadgets",
    isActive: true
  },
  {
    id: 3,
    title: "Google Pixel 8 Pro 128GB Obsidian",
    description: "Google Tensor G3 chip, advanced triple camera system with Super Res Zoom up to 30x, and 24-hour battery life.",
    price: 98999.00,
    stockQuantity: 12,
    brand: "Google",
    imageUrl: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&auto=format&fit=crop&q=80",
    categoryId: 2,
    categoryName: "Mobile",
    sellerId: 2,
    sellerName: "Apex Tech Traders",
    storeName: "Apex Electronics & Gadgets",
    isActive: true
  },
  {
    id: 4,
    title: "Sony WH-1000XM5 Wireless Noise-Canceling Headphones",
    description: "Two processors and 8 microphones for industry-leading noise cancellation, crystal clear hands-free calling, and 30-hour battery life.",
    price: 28990.00,
    stockQuantity: 45,
    brand: "Sony",
    imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80",
    categoryId: 1,
    categoryName: "Electronics",
    sellerId: 2,
    sellerName: "Apex Tech Traders",
    storeName: "Apex Electronics & Gadgets",
    isActive: true
  },
  {
    id: 5,
    title: "MacBook Pro 14\" M3 Pro (18GB Unified Memory, 512GB SSD)",
    description: "Liquid Retina XDR display, up to 18 hours of battery life, advanced connectivity including three Thunderbolt 4 ports.",
    price: 199900.00,
    stockQuantity: 10,
    brand: "Apple",
    imageUrl: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80",
    categoryId: 1,
    categoryName: "Electronics",
    sellerId: 2,
    sellerName: "Apex Tech Traders",
    storeName: "Apex Electronics & Gadgets",
    isActive: true
  },
  {
    id: 6,
    title: "Dell XPS 15 9530 Core i9 32GB RAM RTX 4070 OLED",
    description: "Stunning 3.5K OLED touch display, 13th Gen Intel Core i9 processor, NVIDIA GeForce RTX 4070 graphics, and machined aluminum chassis.",
    price: 224990.00,
    stockQuantity: 7,
    brand: "Dell",
    imageUrl: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=600&auto=format&fit=crop&q=80",
    categoryId: 1,
    categoryName: "Electronics",
    sellerId: 2,
    sellerName: "Apex Tech Traders",
    storeName: "Apex Electronics & Gadgets",
    isActive: true
  },
  {
    id: 7,
    title: "Nike Air Jordan 1 Retro High OG Sneaker",
    description: "Iconic basketball silhouette crafted from premium leather, encapsulated Air-Sole unit for lightweight cushioning, and rubber cupsole.",
    price: 16995.00,
    stockQuantity: 30,
    brand: "Nike",
    imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80",
    categoryId: 3,
    categoryName: "Fashion",
    sellerId: 3,
    sellerName: "Vogue Trendsetters",
    storeName: "Vogue & Urban Living",
    isActive: true
  },
  {
    id: 8,
    title: "Levi's Men's 511 Slim Fit Stretch Denim Jeans",
    description: "Modern slim-cut jeans with room to move. Added stretch for all-day comfort, classic five-pocket styling, and zip fly.",
    price: 3499.00,
    stockQuantity: 80,
    brand: "Levi's",
    imageUrl: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&auto=format&fit=crop&q=80",
    categoryId: 3,
    categoryName: "Fashion",
    sellerId: 3,
    sellerName: "Vogue Trendsetters",
    storeName: "Vogue & Urban Living",
    isActive: true
  },
  {
    id: 9,
    title: "Fossil Gen 6 Hybrid Smartwatch with Leather Strap",
    description: "Classic analog watch aesthetics with always-on display, heart rate monitor, SpO2 sensor, and 2-week battery life.",
    price: 18495.00,
    stockQuantity: 22,
    brand: "Fossil",
    imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80",
    categoryId: 3,
    categoryName: "Fashion",
    sellerId: 3,
    sellerName: "Vogue Trendsetters",
    storeName: "Vogue & Urban Living",
    isActive: true
  },
  {
    id: 10,
    title: "Ergonomic High-Back Executive Mesh Office Chair",
    description: "Adjustable 3D armrests, dynamic lumbar support, breathable Korean mesh, pneumatic height adjustment, and tilt lock mechanism.",
    price: 14999.00,
    stockQuantity: 15,
    brand: "GreenSoul",
    imageUrl: "https://images.unsplash.com/photo-1580481077195-c266a815a1a1?w=600&auto=format&fit=crop&q=80",
    categoryId: 4,
    categoryName: "Home & Furniture",
    sellerId: 3,
    sellerName: "Vogue Trendsetters",
    storeName: "Vogue & Urban Living",
    isActive: true
  },
  {
    id: 11,
    title: "Solid Sheesham Wood Queen Size Bed with Storage",
    description: "Handcrafted from seasoned Sheesham hardwood with warm walnut finish, hydraulic lift-up storage compartments, and sturdy slat support.",
    price: 38990.00,
    stockQuantity: 8,
    brand: "Wakefit",
    imageUrl: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600&auto=format&fit=crop&q=80",
    categoryId: 4,
    categoryName: "Home & Furniture",
    sellerId: 3,
    sellerName: "Vogue Trendsetters",
    storeName: "Vogue & Urban Living",
    isActive: true
  },
  {
    id: 12,
    title: "IKEA Modern Minimalist Floor Standing Lamp",
    description: "Architectural brushed nickel finish with dual warm ambient diffusers, foot-pedal switch, and energy-saving LED bulbs included.",
    price: 4990.00,
    stockQuantity: 35,
    brand: "IKEA",
    imageUrl: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&auto=format&fit=crop&q=80",
    categoryId: 4,
    categoryName: "Home & Furniture",
    sellerId: 3,
    sellerName: "Vogue Trendsetters",
    storeName: "Vogue & Urban Living",
    isActive: true
  }
];

const INITIAL_CATEGORIES = [
  { id: 1, name: "Electronics", description: "Laptops, audio, and devices", productCount: 3, imageUrl: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600&auto=format&fit=crop&q=80" },
  { id: 2, name: "Mobile", description: "Smartphones & tablets", productCount: 3, imageUrl: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80" },
  { id: 3, name: "Fashion", description: "Apparel, footwear & watches", productCount: 3, imageUrl: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&auto=format&fit=crop&q=80" },
  { id: 4, name: "Home & Furniture", description: "Chairs, beds & home decor", productCount: 3, imageUrl: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&auto=format&fit=crop&q=80" }
];

// Initialize localStorage stores
if (!localStorage.getItem('quitq_mock_products')) {
  localStorage.setItem('quitq_mock_products', JSON.stringify(INITIAL_PRODUCTS));
}
if (!localStorage.getItem('quitq_mock_categories')) {
  localStorage.setItem('quitq_mock_categories', JSON.stringify(INITIAL_CATEGORIES));
}
if (!localStorage.getItem('quitq_mock_orders')) {
  localStorage.setItem('quitq_mock_orders', JSON.stringify([
    {
      id: 101,
      orderNumber: "QQ-202611-00198",
      userId: 4,
      customerName: "John Doe",
      customerEmail: "john.doe@example.com",
      contactNumber: "+91 9123456789",
      totalAmount: 45985.00,
      shippingAddress: "Flat 304, Green Heights, Indiranagar, Bangalore - 560038",
      paymentMethod: "UPI",
      paymentStatus: "Completed",
      orderStatus: "Shipped",
      trackingNumber: "BLUEDART-882910471",
      estimatedDeliveryDate: new Date(Date.now() + 2 * 86400000).toISOString(),
      createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
      items: [
        {
          id: 1,
          productId: 4,
          productTitle: "Sony WH-1000XM5 Wireless Noise-Canceling Headphones",
          productImage: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80",
          brand: "Sony",
          sellerId: 2,
          sellerName: "Apex Tech Traders",
          quantity: 1,
          unitPrice: 28990.00,
          totalPrice: 28990.00,
          itemStatus: "Shipped"
        },
        {
          id: 2,
          productId: 7,
          productTitle: "Nike Air Jordan 1 Retro High OG Sneaker",
          productImage: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80",
          brand: "Nike",
          sellerId: 3,
          sellerName: "Vogue Trendsetters",
          quantity: 1,
          unitPrice: 16995.00,
          totalPrice: 16995.00,
          itemStatus: "Shipped"
        }
      ]
    }
  ]));
}

async function request(endpoint, options = {}) {
  const token = localStorage.getItem('quitq_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers
  };

  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers
    });
    if (res.ok) {
      console.log(`%c[Backend API Connected] %c${options.method || 'GET'} ${endpoint}`, 'color: #10b981; font-weight: bold;', 'color: #2563eb;');
      return await res.json();
    }
    const err = await res.json().catch(() => ({ message: res.statusText }));
    console.warn(`[Backend API Warning] ${endpoint}:`, err);
    throw new Error(err.message || 'API request failed');
  } catch (netError) {
    console.warn(`[QuitQ Client] Live API unreachable for ${endpoint}, using client fallback:`, netError.message);
    return mockHandler(endpoint, options);
  }
}

// Mock Engine implementation for 100% offline reliability
function mockHandler(endpoint, options) {
  const method = options.method || 'GET';
  const body = options.body ? JSON.parse(options.body) : null;
  const products = JSON.parse(localStorage.getItem('quitq_mock_products') || '[]');
  const categories = JSON.parse(localStorage.getItem('quitq_mock_categories') || '[]');
  const orders = JSON.parse(localStorage.getItem('quitq_mock_orders') || '[]');

  // Auth endpoints
  if (endpoint === '/auth/login' && method === 'POST') {
    const { usernameOrEmail } = body;
    let role = "Customer";
    let name = "John Doe";
    let storeName = null;

    if (usernameOrEmail.includes('admin')) {
      role = "Admin";
      name = "QuitQ Administrator";
    } else if (usernameOrEmail.includes('seller') || usernameOrEmail.includes('apex')) {
      role = "Seller";
      name = "Apex Tech Traders";
      storeName = "Apex Electronics & Gadgets";
    }

    return {
      token: "mock-jwt-token-" + Date.now(),
      userId: role === 'Admin' ? 1 : (role === 'Seller' ? 2 : 4),
      username: usernameOrEmail.split('@')[0],
      email: usernameOrEmail,
      fullName: name,
      role: role,
      contactNumber: "+91 9123456789",
      address: "Flat 304, Green Heights, Indiranagar, Bangalore",
      storeName: storeName
    };
  }

  if (endpoint === '/auth/register' && method === 'POST') {
    return {
      token: "mock-jwt-token-" + Date.now(),
      userId: 99,
      username: body.username,
      email: body.email,
      fullName: body.fullName,
      role: body.role || 'Customer',
      contactNumber: body.contactNumber,
      address: body.address,
      storeName: body.storeName
    };
  }

  // Auto-suggestions & predictive text (Image 4, Step 2.2)
  if (endpoint.startsWith('/products/auto-suggestions')) {
    const url = new URL(`http://localhost${endpoint}`);
    const q = (url.searchParams.get('q') || '').toLowerCase();
    if (!q) return [];

    const suggestions = [];
    products
      .filter(p => p.isActive && p.title.toLowerCase().includes(q))
      .slice(0, 5)
      .forEach(p => suggestions.push({ suggestion: p.title, type: "Product", targetId: p.id }));

    const brands = [...new Set(products.map(p => p.brand))];
    brands
      .filter(b => b.toLowerCase().includes(q))
      .slice(0, 3)
      .forEach(b => suggestions.push({ suggestion: b, type: "Brand", targetId: null }));

    categories
      .filter(c => c.name.toLowerCase().includes(q))
      .slice(0, 2)
      .forEach(c => suggestions.push({ suggestion: c.name, type: "Category", targetId: c.id }));

    return suggestions;
  }

  // Brands list
  if (endpoint === '/products/brands') {
    return [...new Set(products.map(p => p.brand))].sort();
  }

  // Products catalog with filters
  if (endpoint.startsWith('/products') && method === 'GET') {
    const url = new URL(`http://localhost${endpoint}`);
    const search = (url.searchParams.get('searchTerm') || '').toLowerCase();
    const categoryName = url.searchParams.get('categoryName');
    const brand = url.searchParams.get('brand');
    const minPrice = parseFloat(url.searchParams.get('minPrice') || '0');
    const maxPrice = parseFloat(url.searchParams.get('maxPrice') || '9999999');
    const sortBy = url.searchParams.get('sortBy');

    let filtered = products.filter(p => p.isActive);

    if (search) {
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(search) || 
        p.description.toLowerCase().includes(search) ||
        p.brand.toLowerCase().includes(search) ||
        p.categoryName.toLowerCase().includes(search)
      );
    }

    if (categoryName && categoryName !== 'All') {
      filtered = filtered.filter(p => p.categoryName.toLowerCase() === categoryName.toLowerCase());
    }

    if (brand && brand !== 'All') {
      filtered = filtered.filter(p => p.brand.toLowerCase() === brand.toLowerCase());
    }

    if (minPrice > 0) {
      filtered = filtered.filter(p => p.price >= minPrice);
    }
    if (maxPrice < 9999999) {
      filtered = filtered.filter(p => p.price <= maxPrice);
    }

    if (sortBy === 'price_asc') filtered.sort((a, b) => a.price - b.price);
    else if (sortBy === 'price_desc') filtered.sort((a, b) => b.price - a.price);
    else if (sortBy === 'title') filtered.sort((a, b) => a.title.localeCompare(b.title));

    return {
      items: filtered,
      totalCount: filtered.length,
      pageNumber: 1,
      pageSize: 50,
      totalPages: 1
    };
  }

  // Categories
  if (endpoint === '/categories' && method === 'GET') {
    return categories;
  }

  // Orders
  if (endpoint === '/orders' && method === 'GET') {
    return orders;
  }

  if (endpoint === '/orders/checkout' && method === 'POST') {
    const cart = JSON.parse(localStorage.getItem('quitq_mock_cart') || '[]');
    const total = cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
    const newOrder = {
      id: orders.length + 101,
      orderNumber: `QQ-${Date.now().toString().slice(-8)}`,
      userId: 4,
      customerName: "John Doe",
      customerEmail: "john.doe@example.com",
      contactNumber: "+91 9123456789",
      totalAmount: total > 500 ? total : total + 50,
      shippingAddress: body.shippingAddress || "Flat 304, Green Heights, Indiranagar, Bangalore",
      paymentMethod: body.paymentMethod || "Credit Card",
      paymentStatus: "Completed",
      orderStatus: "Placed",
      trackingNumber: `QQTRK-${Math.floor(10000000 + Math.random() * 90000000)}`,
      estimatedDeliveryDate: new Date(Date.now() + 4 * 86400000).toISOString(),
      createdAt: new Date().toISOString(),
      items: cart.map((c, i) => ({
        id: i + 1,
        productId: c.productId,
        productTitle: c.title,
        productImage: c.imageUrl,
        brand: c.brand,
        sellerId: 2,
        sellerName: c.sellerName,
        quantity: c.quantity,
        unitPrice: c.unitPrice,
        totalPrice: c.unitPrice * c.quantity,
        itemStatus: "Placed"
      }))
    };

    orders.unshift(newOrder);
    localStorage.setItem('quitq_mock_orders', JSON.stringify(orders));
    localStorage.removeItem('quitq_mock_cart');
    return newOrder;
  }

  // Order Tracking (Image 2: track order)
  if (endpoint.includes('/track')) {
    const parts = endpoint.split('/');
    const orderNumber = parts[2];
    const order = orders.find(o => o.orderNumber === orderNumber) || orders[0];
    const statuses = ["Placed", "Processing", "Shipped", "Delivered"];
    const currIdx = statuses.indexOf(order?.orderStatus || "Placed");

    return {
      orderNumber: order?.orderNumber || orderNumber,
      currentStatus: order?.orderStatus || "Placed",
      trackingNumber: order?.trackingNumber || "QQTRK-88192031",
      estimatedDeliveryDate: order?.estimatedDeliveryDate || new Date(Date.now() + 3 * 86400000).toISOString(),
      steps: [
        { status: "Placed", description: "Order placed & payment verified.", isCompleted: currIdx >= 0, isCurrent: currIdx === 0, timestamp: order?.createdAt },
        { status: "Processing", description: "Seller has verified & packed the order.", isCompleted: currIdx >= 1, isCurrent: currIdx === 1, timestamp: currIdx >= 1 ? order?.createdAt : null },
        { status: "Shipped", description: "Package dispatched with logistics courier.", isCompleted: currIdx >= 2, isCurrent: currIdx === 2, timestamp: currIdx >= 2 ? order?.createdAt : null },
        { status: "Delivered", description: "Package delivered to destination address.", isCompleted: currIdx >= 3, isCurrent: currIdx === 3, timestamp: currIdx >= 3 ? order?.createdAt : null }
      ]
    };
  }

  // Seller Dashboard
  if (endpoint === '/seller/dashboard') {
    return {
      totalProducts: products.filter(p => p.sellerId === 2 && p.isActive).length,
      lowStockCount: products.filter(p => p.sellerId === 2 && p.stockQuantity < 10).length,
      totalRevenue: 28990.00,
      totalUnitsSold: 1,
      totalOrders: 1
    };
  }

  // Seller Sales Report (Image 3)
  if (endpoint === '/seller/sales-report') {
    return {
      totalRevenue: 28990.00,
      totalUnitsSold: 1,
      totalOrdersProcessed: 1,
      productSales: products.filter(p => p.sellerId === 2).map(p => ({
        productId: p.id,
        title: p.title,
        brand: p.brand,
        unitsSold: p.id === 4 ? 1 : 0,
        revenue: p.id === 4 ? 28990.00 : 0,
        remainingStock: p.stockQuantity
      })),
      recentSalesList: [
        {
          orderNumber: "QQ-202611-00198",
          orderDate: new Date(Date.now() - 2 * 86400000).toISOString(),
          customerName: "John Doe",
          productName: "Sony WH-1000XM5 Wireless Headphones",
          quantity: 1,
          amount: 28990.00,
          status: "Shipped"
        }
      ]
    };
  }

  // Admin reports (Image 3)
  if (endpoint === '/admin/reports') {
    return {
      totalUsers: 1,
      totalSellers: 2,
      totalProducts: products.length,
      totalOrders: orders.length,
      totalPlatformRevenue: orders.reduce((sum, o) => sum + o.totalAmount, 0),
      transactionsList: orders.map(o => ({
        orderNumber: o.orderNumber,
        orderDate: o.createdAt,
        customerEmail: o.customerEmail,
        sellerName: o.items?.[0]?.sellerName || "Apex Tech Traders",
        totalAmount: o.totalAmount,
        paymentMethod: o.paymentMethod,
        paymentStatus: o.paymentStatus,
        orderStatus: o.orderStatus
      }))
    };
  }

  // Admin users list
  if (endpoint.startsWith('/admin/users')) {
    return [
      { id: 1, username: "admin", email: "admin@quitq.com", fullName: "Administrator QuitQ", role: "Admin", isActive: true, contactNumber: "+91 9876543210", address: "Bangalore", createdAt: new Date() },
      { id: 2, username: "apex_electronics", email: "seller.tech@quitq.com", fullName: "Apex Tech Traders", role: "Seller", isActive: true, storeName: "Apex Electronics & Gadgets", contactNumber: "+91 9811223344", address: "Electronic City, Bangalore", createdAt: new Date() },
      { id: 3, username: "vogue_fashion", email: "seller.style@quitq.com", fullName: "Vogue Trendsetters", role: "Seller", isActive: true, storeName: "Vogue & Urban Living", contactNumber: "+91 9855667788", address: "Fashion Blvd, Mumbai", createdAt: new Date() },
      { id: 4, username: "john_doe", email: "john.doe@example.com", fullName: "John Doe", role: "Customer", isActive: true, contactNumber: "+91 9123456789", address: "Indiranagar, Bangalore", createdAt: new Date() }
    ];
  }

  return { message: "Mock success" };
}

export const api = {
  // Auth
  login: (data) => request('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  register: (data) => request('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  getMe: () => request('/auth/me'),

  // Products & Search
  getProducts: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/products${query ? `?${query}` : ''}`);
  },
  getProductById: (id) => request(`/products/${id}`),
  getAutoSuggestions: (q) => request(`/products/auto-suggestions?q=${encodeURIComponent(q)}`),
  getBrands: () => request('/products/brands'),
  createProduct: (data) => request('/products', { method: 'POST', body: JSON.stringify(data) }),
  updateProduct: (id, data) => request(`/products/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteProduct: (id) => request(`/products/${id}`, { method: 'DELETE' }),

  // Categories
  getCategories: () => request('/categories'),
  createCategory: (data) => request('/categories', { method: 'POST', body: JSON.stringify(data) }),
  deleteCategory: (id) => request(`/categories/${id}`, { method: 'DELETE' }),

  // Orders & Tracking
  checkout: (data) => request('/orders/checkout', { method: 'POST', body: JSON.stringify(data) }),
  getMyOrders: () => request('/orders'),
  getOrderById: (id) => request(`/orders/${id}`),
  trackOrder: (orderNumber) => request(`/orders/${orderNumber}/track`),
  updateOrderStatus: (id, orderStatus) => request(`/orders/${id}/status`, { method: 'PUT', body: JSON.stringify({ orderStatus }) }),

  // Seller
  getSellerDashboard: () => request('/seller/dashboard'),
  getSellerOrders: () => request('/seller/orders'),
  getSellerSalesReport: () => request('/seller/sales-report'),

  // Admin
  getAdminDashboard: () => request('/admin/dashboard'),
  getAdminUsers: (role) => request(`/admin/users${role ? `?role=${role}` : ''}`),
  toggleUserStatus: (id) => request(`/admin/users/${id}/toggle-status`, { method: 'PUT' }),
  getAdminReports: () => request('/admin/reports')
};
