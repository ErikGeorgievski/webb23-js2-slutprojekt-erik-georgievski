import React from 'react';

const CartProduct = ({ product, quantity, removeFromCart }) => {
  return (
    <div className="cart-item" key={product.id}>
      <img className="product-image" src={product.image} alt={product.name} />
      <div className="product-details">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-price">{product.price.toFixed(2)} kr</p>
        <p className="product-quantity">Antal: {quantity}</p>
      </div>
      <button className="remove-button" onClick={() => removeFromCart(product)}>
        Ta bort
      </button>
    </div>
  );
};

export default CartProduct;