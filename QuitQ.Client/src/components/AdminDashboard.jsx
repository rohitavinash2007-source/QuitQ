import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('users'); // users, categories, reports
  const [dashboardMetrics, setDashboardMetrics] = useState({
    totalUsers: 1,
    totalSellers: 2,
    totalProducts: 12,
    totalOrders: 2,
    totalRevenue: 74975
  });

  const [usersList, setUsersList] = useState([]);
  const [categoriesList, setCategoriesList] = useState([]);
  const [reportsData, setReportsData] = useState(null);
  const [selectedRoleFilter, setSelectedRoleFilter] = useState('All');

  // Category creation
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');

  useEffect(() => {
    loadData();
  }, [selectedRoleFilter]);

  const loadData = async () => {
    try {
      const [metrics, users, cats, reports] = await Promise.all([
        api.getAdminDashboard(),
        api.getAdminUsers(selectedRoleFilter),
        api.getCategories(),
        api.getAdminReports()
      ]);
      if (metrics) setDashboardMetrics(metrics);
      if (users) setUsersList(users);
      if (cats) setCategoriesList(cats);
      if (reports) setReportsData(reports);
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggleUser = async (userId) => {
    try {
      await api.toggleUserStatus(userId);
      loadData();
    } catch (err) {
      alert("Error updating user status: " + err.message);
    }
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    try {
      await api.createCategory({
        name: newCatName,
        description: newCatDesc,
        imageUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&auto=format&fit=crop&q=80"
      });
      setNewCatName('');
      setNewCatDesc('');
      loadData();
    } catch (err) {
      alert("Error adding category: " + err.message);
    }
  };

  const formatPrice = (val) => new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(val || 0);

  return (
    <div className="container py-8">
      {/* Admin Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span className="badge badge-primary text-[10px]">⚡ Hexaware QuitQ Administration</span>
            <span style={{ fontSize: '12px', color: '#64748b' }}>Master System Console</span>
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: '900', color: '#0f172a', margin: 0 }}>Platform Operations & Governance</h2>
          <p style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>Audit all registered customers, seller accounts, categories, and system sales reports.</p>
        </div>
      </div>

      {/* Platform Overview Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div style={{ padding: '1.25rem', background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.04)' }}>
          <div style={{ fontSize: '11px', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Buyers</div>
          <div style={{ fontSize: '1.6rem', fontWeight: '900', color: '#2563eb', marginTop: '4px' }}>{dashboardMetrics.totalUsers}</div>
          <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>Customer accounts</div>
        </div>

        <div style={{ padding: '1.25rem', background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.04)' }}>
          <div style={{ fontSize: '11px', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Merchant Partners</div>
          <div style={{ fontSize: '1.6rem', fontWeight: '900', color: '#d97706', marginTop: '4px' }}>{dashboardMetrics.totalSellers}</div>
          <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>Verified seller stores</div>
        </div>

        <div style={{ padding: '1.25rem', background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.04)' }}>
          <div style={{ fontSize: '11px', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Catalog Items</div>
          <div style={{ fontSize: '1.6rem', fontWeight: '900', color: '#0f172a', marginTop: '4px' }}>{dashboardMetrics.totalProducts}</div>
          <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>Across all 4 categories</div>
        </div>

        <div style={{ padding: '1.25rem', background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.04)' }}>
          <div style={{ fontSize: '11px', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Gross Merchandise Value</div>
          <div style={{ fontSize: '1.6rem', fontWeight: '900', color: '#10b981', marginTop: '4px' }}>{formatPrice(dashboardMetrics.totalRevenue)}</div>
          <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>All transactions processed</div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0', marginBottom: '24px', gap: '8px' }}>
        <button
          onClick={() => setActiveTab('users')}
          style={{
            padding: '10px 18px',
            fontSize: '13px',
            fontWeight: '800',
            cursor: 'pointer',
            borderBottom: activeTab === 'users' ? '3px solid #9333ea' : '3px solid transparent',
            color: activeTab === 'users' ? '#9333ea' : '#64748b'
          }}
        >
          👥 User & Seller Management (Image 2 & 3)
        </button>
        <button
          onClick={() => setActiveTab('categories')}
          style={{
            padding: '10px 18px',
            fontSize: '13px',
            fontWeight: '800',
            cursor: 'pointer',
            borderBottom: activeTab === 'categories' ? '3px solid #9333ea' : '3px solid transparent',
            color: activeTab === 'categories' ? '#9333ea' : '#64748b'
          }}
        >
          📁 Category Taxonomy Management
        </button>
        <button
          onClick={() => setActiveTab('reports')}
          style={{
            padding: '10px 18px',
            fontSize: '13px',
            fontWeight: '800',
            cursor: 'pointer',
            borderBottom: activeTab === 'reports' ? '3px solid #9333ea' : '3px solid transparent',
            color: activeTab === 'reports' ? '#9333ea' : '#64748b'
          }}
        >
          📄 Platform Audit Reports (Simple List View)
        </button>
      </div>

      {/* Tab 1: User Management (Image 2: Manage user and seller accounts) */}
      {activeTab === 'users' && (
        <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.04)' }}>
          <div style={{ padding: '14px 18px', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f8fafc' }}>
            <span style={{ fontSize: '11px', fontWeight: '800', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>User Directory</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' }}>
              <span style={{ color: '#64748b' }}>Filter Role:</span>
              <select
                value={selectedRoleFilter}
                onChange={(e) => setSelectedRoleFilter(e.target.value)}
                style={{ padding: '4px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontWeight: '700', outline: 'none' }}
              >
                <option value="All">All User Types</option>
                <option value="Customer">Customers</option>
                <option value="Seller">Sellers</option>
                <option value="Admin">Admins</option>
              </select>
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', fontSize: '13px', textAlign: 'left', borderCollapse: 'collapse' }}>
              <thead style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontWeight: '800', textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.05em' }}>
                <tr>
                  <th style={{ padding: '14px 16px' }}>Account Name</th>
                  <th style={{ padding: '14px 16px' }}>Role</th>
                  <th style={{ padding: '14px 16px' }}>Contact Phone</th>
                  <th style={{ padding: '14px 16px' }}>Address</th>
                  <th style={{ padding: '14px 16px' }}>Status</th>
                  <th style={{ padding: '14px 16px', textAlign: 'right' }}>Moderation Action</th>
                </tr>
              </thead>
              <tbody>
                {usersList.map((u) => (
                  <tr key={u.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ fontWeight: '800', color: '#0f172a' }}>{u.fullName}</div>
                      <div style={{ fontSize: '11px', color: '#94a3b8' }}>{u.email}</div>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span className={`badge ${
                        u.role === 'Admin' ? 'badge-primary' :
                        u.role === 'Seller' ? 'badge-warning' : 'badge-slate'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px', color: '#475569', fontWeight: '600' }}>{u.contactNumber}</td>
                    <td style={{ padding: '14px 16px', color: '#64748b', maxWidth: '240px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{u.address}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <span className={`badge ${u.isActive ? 'badge-success' : 'badge-danger'}`}>
                        {u.isActive ? 'Active' : 'Deactivated'}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                      {u.role !== 'Admin' && (
                        <button
                          onClick={() => handleToggleUser(u.id)}
                          style={{
                            fontWeight: '800',
                            fontSize: '12px',
                            cursor: 'pointer',
                            color: u.isActive ? '#ef4444' : '#10b981'
                          }}
                        >
                          {u.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Category Management (Image 2: manage category) */}
      {activeTab === 'categories' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
          <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.04)' }}>
            <div style={{ padding: '14px 18px', borderBottom: '1px solid #e2e8f0', background: '#f8fafc', fontWeight: '800', fontSize: '11px', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Active Category Taxonomies
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {categoriesList.map((cat) => (
                <div key={cat.id} style={{ padding: '16px 18px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <img src={cat.imageUrl} alt={cat.name} style={{ width: '48px', height: '48px', borderRadius: '12px', objectFit: 'cover', background: '#f8fafc' }} />
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: '800', color: '#0f172a' }}>{cat.name}</div>
                      <div style={{ fontSize: '12px', color: '#64748b' }}>{cat.description}</div>
                    </div>
                  </div>
                  <span className="badge badge-primary text-[11px]">{cat.productCount} Live Products</span>
                </div>
              ))}
            </div>
          </div>

          {/* Add Category Form */}
          <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '1.5rem', boxShadow: '0 2px 4px rgba(0,0,0,0.04)', height: 'fit-content' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '900', color: '#0f172a', marginBottom: '4px' }}>Add New Product Category</h3>
            <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '20px' }}>Expand marketplace taxonomy to support new merchandise types.</p>

            <form onSubmit={handleCreateCategory} style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '12px' }}>
              <div>
                <label style={{ display: 'block', fontWeight: '800', color: '#475569', marginBottom: '4px' }}>Category Name</label>
                <input
                  type="text"
                  required
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  placeholder="e.g. Sports & Fitness"
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: '800', color: '#475569', marginBottom: '4px' }}>Description</label>
                <textarea
                  rows="2"
                  value={newCatDesc}
                  onChange={(e) => setNewCatDesc(e.target.value)}
                  placeholder="Summary of products belonging to this category..."
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none' }}
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ padding: '12px', fontWeight: '800', background: '#7e22ce' }}
              >
                Create Category
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Tab 3: Generate Reports (As simple list view) (Image 3: Use Case: Generate Reports(As simple list view)) */}
      {activeTab === 'reports' && reportsData && (
        <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '1.5rem', boxShadow: '0 2px 4px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <h3 style={{ fontSize: '15px', fontWeight: '900', color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                All Platform Transactions (Simple List View Format)
              </h3>
              <p style={{ fontSize: '12px', color: '#64748b' }}>Standardized report output satisfying Hexaware use case requirements.</p>
            </div>
            <button
              onClick={() => window.print()}
              className="btn btn-outline btn-sm"
              style={{ fontSize: '12px', padding: '8px 16px' }}
            >
              Print / Save PDF
            </button>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', fontSize: '13px', textAlign: 'left', borderCollapse: 'collapse' }}>
              <thead style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontWeight: '800', textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.05em' }}>
                <tr>
                  <th style={{ padding: '12px 14px' }}>Order Number</th>
                  <th style={{ padding: '12px 14px' }}>Transaction Date</th>
                  <th style={{ padding: '12px 14px' }}>Customer Email</th>
                  <th style={{ padding: '12px 14px' }}>Merchant Store</th>
                  <th style={{ padding: '12px 14px' }}>Total Amount</th>
                  <th style={{ padding: '12px 14px' }}>Payment Mode</th>
                  <th style={{ padding: '12px 14px' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {reportsData.transactionsList?.map((t, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '12px 14px', fontWeight: '800', color: '#0f172a' }}>{t.orderNumber}</td>
                    <td style={{ padding: '12px 14px', color: '#64748b' }}>{new Date(t.orderDate).toLocaleDateString()}</td>
                    <td style={{ padding: '12px 14px', color: '#334155' }}>{t.customerEmail}</td>
                    <td style={{ padding: '12px 14px', color: '#334155', fontWeight: '600' }}>{t.sellerName}</td>
                    <td style={{ padding: '12px 14px', fontWeight: '900', color: '#0f172a' }}>{formatPrice(t.totalAmount)}</td>
                    <td style={{ padding: '12px 14px', color: '#64748b' }}>{t.paymentMethod}</td>
                    <td style={{ padding: '12px 14px' }}>
                      <span className="badge badge-success text-[10px]">{t.orderStatus}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
