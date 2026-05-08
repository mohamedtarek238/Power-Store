import React, { useState } from 'react';
import { initialProducts, initialOrders, getMockTotals } from '../data/mockData';

export default function AdminDashboard(){
  const [products] = useState(initialProducts);
  const [orders] = useState(initialOrders);
  const totals = getMockTotals(products, orders);

  return (
    <div>
      <div className="admin-top">
        <h2>Dashboard</h2>
        <div className="muted">Overview of store metrics</div>
      </div>

      <div className="cards">
        <div className="card">
          <h3>Total Products</h3>
          <p>{totals.totalProducts}</p>
        </div>
        <div className="card">
          <h3>Total Orders</h3>
          <p>{totals.totalOrders}</p>
        </div>
        <div className="card">
          <h3>Total Revenue</h3>
          <p>${totals.revenue}</p>
        </div>
      </div>

      <div style={{marginTop:20}} className="table">
        <h3 style={{marginTop:0}}>Recent Orders</h3>
        <table>
          <thead>
            <tr><th>ID</th><th>Customer</th><th>Total</th><th>Status</th><th>Date</th></tr>
          </thead>
          <tbody>
            {orders.slice(0,6).map(o=> (
              <tr key={o.id}>
                <td>{o.id}</td>
                <td>{o.customer}</td>
                <td>${o.total.toFixed(2)}</td>
                <td><span className={`status ${o.status.toLowerCase()}`}>{o.status}</span></td>
                <td>{o.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
