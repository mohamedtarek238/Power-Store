import React, { useState } from 'react';
import { initialOrders } from '../data/mockData';

export default function AdminOrders(){
  const [orders] = useState(initialOrders);

  return (
    <div>
      <div className="admin-top">
        <h2>Orders</h2>
        <div className="muted">Manage and track orders</div>
      </div>

      <div className="table">
        <table>
          <thead>
            <tr><th>ID</th><th>Customer</th><th>Total</th><th>Status</th><th>Date</th></tr>
          </thead>
          <tbody>
            {orders.map(o=> (
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
