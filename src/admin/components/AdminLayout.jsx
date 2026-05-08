import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import '../styles/admin.css';
import { clearAdminToken } from '../utils/auth';

function Sidebar() {
  const navigate = useNavigate();
  return (
    <div className="admin-sidebar">
      <div className="admin-brand">PowerStore Admin</div>
      <ul className="admin-nav">
        <li>
          <NavLink to="dashboard" className={({isActive})=>isActive? 'active':''}>
            Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink to="products" className={({isActive})=>isActive? 'active':''}>
            Products
          </NavLink>
        </li>
        <li>
          <NavLink to="orders" className={({isActive})=>isActive? 'active':''}>
            Orders
          </NavLink>
        </li>
        <li>
          <a
            href="#logout"
            onClick={(e) => {
              e.preventDefault();
              clearAdminToken();
              navigate('/login', { replace: true });
            }}
          >
            Logout
          </a>
        </li>
      </ul>
    </div>
  );
}

export default function AdminLayout() {
  return (
    <div className="admin-wrap">
      <Sidebar />
      <div className="admin-main">
        <Outlet />
      </div>
    </div>
  );
}
