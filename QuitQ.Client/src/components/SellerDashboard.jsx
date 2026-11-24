import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export function SellerDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('inventory'); // inventory, orders, reports
  const [dashboardMetrics, setDashboardMetrics] = useState({
    totalProducts: 6,
    lowStockCount: 2,
    totalRevenue: 28990,
    totalUnitsSold: 1,
    totalOrders: 1
  });

  const [products, setProducts] = useState([]);
  const [sellerOrders, setSellerOrders] = useState([]);
  const [salesReport, setSalesReport] = useState(null);
  const [showAddProductModal, setShowAddProductModal] = useState(false);

  // New Product Form state
  const [newProduct, setNewProduct] = useState({
    title: '',
    brand: '',
    categoryId: 1,
    price: '',
    stockQuantity: '',
    imageUrl: '',
    description: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [metrics, prods, orders, report] = await Promise.all([
        api.getSellerDashboard(),
        api.getProducts({}),
        api.getSellerOrders(),
        api.getSellerSalesReport()
      ]);
      if (metrics) setDashboardMetrics(metrics);
      if (prods?.items) setProducts(prods.items);
      if (orders) setSellerOrders(orders);
      if (report) setSalesReport(report);
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    try {
      await api.createProduct({
        ...newProduct,
        price: parseFloat(newProduct.price),
        stockQuantity: parseInt(newProduct.stockQuantity),
        categoryId: parseInt(newProduct.categoryId)
      });
      setShowAddProductModal(false);
      setNewProduct({ title: '', brand: '', categoryId: 1, price: '', stockQuantity: '', imageUrl: '', description: '' });
      loadData();
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await api.updateOrderStatus(orderId, newStatus);
      loadData();
    } catch (e) {
      alert("Error updating order: " + e.message);
    }
  };

  const formatPrice = (val) => new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(val || 0);

  return (
    <div className="container py-8">
      {/* Portal Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span className="badge badge-warning text-[10px]">🏪 Merchant Console</span>
            <span style={{ fontSize: '12px', color: '#64748b' }}>Store ID: #{user?.userId || 2}</span>
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: '900', color: '#0f172a', margin: 0 }}>{user?.storeName || "Apex Electronics & Gadgets"}</h2>
          <p style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>Track sales revenue, inventory replenishment, and customer shipment processing.</p>
        </div>

        <button
          onClick={() => setShowAddProductModal(true)}
          className="btn btn-primary btn-sm"
          style={{ padding: '10px 18px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <span>+</span>
          <span>Add New Product Listing</span>
        </button>
      </div>

      {/* Metrics Overview Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div style={{ padding: '1.25rem', background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.04)' }}>
          <div style={{ fontSize: '11px', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Gross Sales Revenue</div>
          <div style={{ fontSize: '1.6rem', fontWeight: '900', color: '#0f172a', marginTop: '4px' }}>{formatPrice(dashboardMetrics.totalRevenue)}</div>
          <div style={{ fontSize: '11px', color: '#10b981', fontWeight: '700', marginTop: '4px' }}>&uarr; 14.8% growth vs last week</div>
        </div>

        <div style={{ padding: '1.25rem', background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.04)' }}>
          <div style={{ fontSize: '11px', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Units Dispatched</div>
          <div style={{ fontSize: '1.6rem', fontWeight: '900', color: '#2563eb', marginTop: '4px' }}>{dashboardMetrics.totalUnitsSold}</div>
          <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>Orders completed successfully</div>
        </div>

        <div style={{ padding: '1.25rem', background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.04)' }}>
          <div style={{ fontSize: '11px', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Active Listings</div>
          <div style={{ fontSize: '1.6rem', fontWeight: '900', color: '#0f172a', marginTop: '4px' }}>{products.length}</div>
          <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>Live in marketplace catalog</div>
        </div>

        <div style={{ padding: '1.25rem', background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.04)' }}>
          <div style={{ fontSize: '11px', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Low Stock Notice</div>
          <div style={{ fontSize: '1.6rem', fontWeight: '900', color: '#d97706', marginTop: '4px' }}>{dashboardMetrics.lowStockCount}</div>
          <div style={{ fontSize: '11px', color: '#d97706', fontWeight: '700', marginTop: '4px' }}>Items below 10 units</div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0', marginBottom: '24px', gap: '8px' }}>
        <button
          onClick={() => setActiveTab('inventory')}
          style={{
            padding: '10px 18px',
            fontSize: '13px',
            fontWeight: '800',
            cursor: 'pointer',
            borderBottom: activeTab === 'inventory' ? '3px solid #2563eb' : '3px solid transparent',
            color: activeTab === 'inventory' ? '#2563eb' : '#64748b'
          }}
        >
          📦 Product Inventory Management
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          style={{
            padding: '10px 18px',
            fontSize: '13px',
            fontWeight: '800',
            cursor: 'pointer',
            borderBottom: activeTab === 'orders' ? '3px solid #2563eb' : '3px solid transparent',
            color: activeTab === 'orders' ? '#2563eb' : '#64748b'
          }}
        >
          🚚 Order Processing & Shipments
        </button>
        <button
          onClick={() => setActiveTab('reports')}
          style={{
            padding: '10px 18px',
            fontSize: '13px',
            fontWeight: '800',
            cursor: 'pointer',
            borderBottom: activeTab === 'reports' ? '3px solid #2563eb' : '3px solid transparent',
            color: activeTab === 'reports' ? '#2563eb' : '#64748b'
          }}
        >
          📊 Sales Reports (Simple List View)
        </button>
      </div>

      {/* Tab 1: Product Management */}
      {activeTab === 'inventory' && (
        <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.04)' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', fontSize: '13px', textAlign: 'left', borderCollapse: 'collapse' }}>
              <thead style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontWeight: '800', textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.05em' }}>
                <tr>
                  <th style={{ padding: '14px 16px' }}>Item Details</th>
                  <th style={{ padding: '14px 16px' }}>Brand</th>
                  <th style={{ padding: '14px 16px' }}>Category</th>
                  <th style={{ padding: '14px 16px' }}>Unit Price</th>
                  <th style={{ padding: '14px 16px' }}>Current Stock</th>
                  <th style={{ padding: '14px 16px' }}>Status</th>
                  <th style={{ padding: '14px 16px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <img src={p.imageUrl} alt={p.title} style={{ width: '44px', height: '44px', borderRadius: '10px', objectFit: 'cover', background: '#f1f5f9' }} />
                      <strong style={{ color: '#0f172a' }}>{p.title}</strong>
                    </td>
                    <td style={{ padding: '12px 16px', color: '#475569', fontWeight: '600' }}>{p.brand}</td>
                    <td style={{ padding: '12px 16px', color: '#64748b' }}>{p.categoryName}</td>
                    <td style={{ padding: '12px 16px', fontWeight: '800', color: '#0f172a' }}>{formatPrice(p.price)}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ fontWeight: '700', color: p.stockQuantity < 10 ? '#d97706' : '#1e293b' }}>
                        {p.stockQuantity} units
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span className="badge badge-success text-[10px]">Active</span>
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                      <button 
                        onClick={() => alert(`Edit Product #${p.id} functionality is accessible in the API.`)}
                        style={{ color: '#2563eb', fontWeight: '700', cursor: 'pointer', marginRight: '12px' }}
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Order Processing (Image 3) */}
      {activeTab === 'orders' && (
        <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.04)' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', fontSize: '13px', textAlign: 'left', borderCollapse: 'collapse' }}>
              <thead style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontWeight: '800', textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.05em' }}>
                <tr>
                  <th style={{ padding: '14px 16px' }}>Order Number</th>
                  <th style={{ padding: '14px 16px' }}>Customer</th>
                  <th style={{ padding: '14px 16px' }}>Product & Qty</th>
                  <th style={{ padding: '14px 16px' }}>Total Amount</th>
                  <th style={{ padding: '14px 16px' }}>Current Status</th>
                  <th style={{ padding: '14px 16px', textAlign: 'right' }}>Fulfillment Control</th>
                </tr>
              </thead>
              <tbody>
                {sellerOrders.map((o, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '14px 16px', fontWeight: '800', color: '#0f172a' }}>{o.orderNumber}</td>
                    <td style={{ padding: '14px 16px', color: '#334155', fontWeight: '600' }}>{o.customerName}</td>
                    <td style={{ padding: '14px 16px', color: '#475569' }}>{o.productTitle} ({o.quantity}x)</td>
                    <td style={{ padding: '14px 16px', fontWeight: '800', color: '#0f172a' }}>{formatPrice(o.totalPrice)}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <span className={`badge ${
                        o.itemStatus === 'Delivered' ? 'badge-success' :
                        o.itemStatus === 'Shipped' ? 'badge-primary' :
                        o.itemStatus === 'Processing' ? 'badge-warning' : 'badge-slate'
                      }`}>
                        {o.itemStatus}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                      <select
                        value={o.itemStatus}
                        onChange={(e) => handleUpdateOrderStatus(o.orderId, e.target.value)}
                        style={{ padding: '6px 10px', fontSize: '12px', fontWeight: '700', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }}
                      >
                        <option value="Placed">Placed</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Sales Reports (List View) (Image 3: Use Case: Sales Reports) */}
      {activeTab === 'reports' && salesReport && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '1.5rem', boxShadow: '0 2px 4px rgba(0,0,0,0.04)' }}>
            <h3 style={{ fontSize: '14px', fontWeight: '900', color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px' }}>Itemized Product Performance</h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', fontSize: '13px', textAlign: 'left', borderCollapse: 'collapse' }}>
                <thead style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontWeight: '800', textTransform: 'uppercase', fontSize: '11px' }}>
                  <tr>
                    <th style={{ padding: '12px 14px' }}>Product Title</th>
                    <th style={{ padding: '12px 14px' }}>Brand</th>
                    <th style={{ padding: '12px 14px' }}>Units Sold</th>
                    <th style={{ padding: '12px 14px' }}>Total Sales</th>
                    <th style={{ padding: '12px 14px' }}>Inventory Left</th>
                  </tr>
                </thead>
                <tbody>
                  {salesReport.productSales?.map((ps) => (
                    <tr key={ps.productId} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '12px 14px', fontWeight: '700', color: '#0f172a' }}>{ps.title}</td>
                      <td style={{ padding: '12px 14px', color: '#475569' }}>{ps.brand}</td>
                      <td style={{ padding: '12px 14px', fontWeight: '800', color: '#2563eb' }}>{ps.unitsSold}</td>
                      <td style={{ padding: '12px 14px', fontWeight: '900', color: '#0f172a' }}>{formatPrice(ps.revenue)}</td>
                      <td style={{ padding: '12px 14px', color: '#64748b' }}>{ps.remainingStock}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '1.5rem', boxShadow: '0 2px 4px rgba(0,0,0,0.04)' }}>
            <h3 style={{ fontSize: '14px', fontWeight: '900', color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px' }}>Sales Transactions (Simple List View Format)</h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', fontSize: '13px', textAlign: 'left', borderCollapse: 'collapse' }}>
                <thead style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontWeight: '800', textTransform: 'uppercase', fontSize: '11px' }}>
                  <tr>
                    <th style={{ padding: '12px 14px' }}>Order Number</th>
                    <th style={{ padding: '12px 14px' }}>Date</th>
                    <th style={{ padding: '12px 14px' }}>Customer</th>
                    <th style={{ padding: '12px 14px' }}>Product</th>
                    <th style={{ padding: '12px 14px' }}>Quantity</th>
                    <th style={{ padding: '12px 14px' }}>Amount</th>
                    <th style={{ padding: '12px 14px' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {salesReport.recentSalesList?.map((row, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '12px 14px', fontWeight: '800', color: '#0f172a' }}>{row.orderNumber}</td>
                      <td style={{ padding: '12px 14px', color: '#64748b' }}>{new Date(row.orderDate).toLocaleDateString()}</td>
                      <td style={{ padding: '12px 14px', color: '#334155' }}>{row.customerName}</td>
                      <td style={{ padding: '12px 14px', color: '#334155' }}>{row.productName}</td>
                      <td style={{ padding: '12px 14px', fontWeight: '700' }}>{row.quantity}</td>
                      <td style={{ padding: '12px 14px', fontWeight: '900', color: '#0f172a' }}>{formatPrice(row.amount)}</td>
                      <td style={{ padding: '12px 14px' }}>
                        <span className="badge badge-success text-[10px]">{row.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Add Product Modal (Image 1 & 3: Seller Product Management) */}
      {showAddProductModal && (
        <div className="modal-overlay" onClick={() => setShowAddProductModal(false)}>
          <div 
            className="modal-content"
            style={{ maxWidth: '480px', padding: '2rem', borderRadius: '24px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ fontSize: '18px', fontWeight: '900', color: '#0f172a', marginBottom: '4px' }}>Add Product to Catalog</h3>
            <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '20px' }}>Fill in details to list your merchandise on QuitQ marketplace.</p>

            <form onSubmit={handleCreateProduct} style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '12px' }}>
              <div>
                <label style={{ display: 'block', fontWeight: '800', color: '#475569', marginBottom: '4px' }}>Product Title</label>
                <input
                  type="text"
                  required
                  value={newProduct.title}
                  onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })}
                  placeholder="e.g. Sony Wireless Headphones"
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontWeight: '800', color: '#475569', marginBottom: '4px' }}>Brand</label>
                  <input
                    type="text"
                    required
                    value={newProduct.brand}
                    onChange={(e) => setNewProduct({ ...newProduct, brand: e.target.value })}
                    placeholder="e.g. Sony"
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: '800', color: '#475569', marginBottom: '4px' }}>Category</label>
                  <select
                    value={newProduct.categoryId}
                    onChange={(e) => setNewProduct({ ...newProduct, categoryId: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none', background: '#ffffff' }}
                  >
                    <option value={1}>Electronics</option>
                    <option value={2}>Mobile</option>
                    <option value={3}>Fashion</option>
                    <option value={4}>Home & Furniture</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontWeight: '800', color: '#475569', marginBottom: '4px' }}>Price (₹ INR)</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    placeholder="24999"
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: '800', color: '#475569', marginBottom: '4px' }}>Stock Units</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={newProduct.stockQuantity}
                    onChange={(e) => setNewProduct({ ...newProduct, stockQuantity: e.target.value })}
                    placeholder="25"
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: '800', color: '#475569', marginBottom: '4px' }}>Image URL</label>
                <input
                  type="url"
                  value={newProduct.imageUrl}
                  onChange={(e) => setNewProduct({ ...newProduct, imageUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: '800', color: '#475569', marginBottom: '4px' }}>Product Description</label>
                <textarea
                  rows="2"
                  required
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  placeholder="Detailed specifications and highlights..."
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                <button
                  type="button"
                  onClick={() => setShowAddProductModal(false)}
                  className="btn btn-outline"
                  style={{ flex: 1, padding: '10px' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ flex: 1, padding: '10px', fontWeight: '800' }}
                >
                  Publish Listing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
