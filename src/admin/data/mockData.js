export const initialProducts = [
  { id: 'p1', name: 'Wireless Headphones', price: 99.99, stock: 25, image: 'https://via.placeholder.com/80?text=Headphones' },
  { id: 'p2', name: 'Smart Watch', price: 149.99, stock: 12, image: 'https://via.placeholder.com/80?text=Watch' },
  { id: 'p3', name: 'Bluetooth Speaker', price: 59.0, stock: 40, image: 'https://via.placeholder.com/80?text=Speaker' }
];

export const initialOrders = [
  { id: 'o1001', customer: 'Alice', total: 199.98, status: 'Completed', date: '2026-02-10' },
  { id: 'o1002', customer: 'Bob', total: 59.0, status: 'Pending', date: '2026-02-11' },
  { id: 'o1003', customer: 'Charlie', total: 149.99, status: 'Cancelled', date: '2026-02-12' }
];

export const getMockTotals = (products = initialProducts, orders = initialOrders) => ({
  totalProducts: products.length,
  totalOrders: orders.length,
  revenue: orders.reduce((s, o) => s + o.total, 0).toFixed(2)
});
