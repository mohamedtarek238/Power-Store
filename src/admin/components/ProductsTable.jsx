import React from 'react';

const FALLBACK_IMAGE = 'https://via.placeholder.com/80?text=No+Image';

export default function ProductsTable({ products = [] }) {
  if (!products.length) {
    return (
      <div className="products-empty">
        No products found.
      </div>
    );
  }

  return (
    <div className="table products-table-wrap">
      <table>
        <thead>
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Price</th>
            <th>Category</th>
            <th>Stock</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>
                <img
                  src={product.image || FALLBACK_IMAGE}
                  alt={product.name}
                  className="thumb"
                  onError={(event) => {
                    event.currentTarget.src = FALLBACK_IMAGE;
                  }}
                />
              </td>
              <td>{product.name}</td>
              <td>${product.price.toFixed(2)}</td>
              <td>{product.category}</td>
              <td>{product.stock}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
