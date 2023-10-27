import React from 'react';

export default function Product ({ product, addToCart, handleClick, showDescription })  {
  return (
    <div key={product.id} className="product">
      <img className='img-product' src={product.image} alt={product.name} />
      <h3>{product.name}</h3>
      <ul>
        {product.points && product.points.map((point, index) => (
          <li key={index}>{point}</li>
        ))}
      </ul>
      <h3 className='product-price'>Pris: {product.price}:-</h3>
      <p className='product-stock'>I lager online: {product.inventory}st.</p>
      <div>
        <button className='des-button' onClick={() => handleClick(product.id)}>
          {showDescription[product.id] ? 'Visa mindre' : 'Läs mer...'}
        </button>
        {showDescription[product.id] && <p>{product.description}</p>}
      </div>
      <button className='product-button' onClick={() => addToCart(product)}>Lägg i kundvagn</button>
    </div>
  );
};
