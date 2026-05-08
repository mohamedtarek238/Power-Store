import React, { useState } from 'react';
import { initialOrders } from '../data/mockData';
import useProducts from '../hooks/useProducts';
import ProductsTable from '../components/ProductsTable';

export default function AdminDashboard(){
  const [orders] = useState(initialOrders);
  const { products, loading, error } = useProducts();
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0).toFixed(2);

  return (
    <div>
      <div className="admin-top">
        <h2>Dashboard</h2>
        <div className="muted">Overview of store metrics</div>
      </div>

      <div className="cards">
        <div className="card">
          <h3>Total Products</h3>
          <p>{products.length}</p>
        </div>
        <div className="card">
          <h3>Total Orders</h3>
          <p>{orders.length}</p>
        </div>
        <div className="card">
          <h3>Total Revenue</h3>
          <p>${totalRevenue}</p>
        </div>
      </div>

      <div style={{ marginTop: 20 }}>
        <h3 className="products-heading">All Products</h3>
        {loading && <div className="products-loading">Loading products...</div>}
        {error && <div className="products-error">{error}</div>}
        {!loading && !error && <ProductsTable products={products} />}
      </div>
    </div>
  );
}
