import React from 'react';
import { UpdateInventory } from './UpdateInventory';
import CartProduct from './CartProduct';

const ShoppingCart = ({
  products,
  cart,
  setCart,
  totalPrice,
  setTotalPrice,
  showDescription,
  setShowDescription,
  okMessage,
  setOkMessage,
  statusPurchase,
  setStatusPurchase,
  setIsCartOpen,
}) => {
  const addToCart = (product) => {
    if (product.inventory > 0) {
      if (cart[product.id] === undefined || cart[product.id] < product.inventory) {
        const updatedCart = { ...cart };
        updatedCart[product.id] = (updatedCart[product.id] || 0) + 1;
        setCart(updatedCart);
        setTotalPrice(totalPrice + product.price);
      } else {
        setOkMessage('Du kan inte lägga till fler av denna produkt i varukorgen.');
      }
    } else {
      setOkMessage('Produkten är slutsåld.');
    }
  };
  const removeFromCart = (product) => {
    const updatedCart = { ...cart };
    if (updatedCart[product.id] > 1) {
      updatedCart[product.id] -= 1;
    } else {
      delete updatedCart[product.id]; 
    }
    setCart(updatedCart);
    setTotalPrice(totalPrice - product.price);
  };
  
  

  const removeAllFromCart = () => {
    setCart({});
    setTotalPrice(0);
  };

  const handleClick = (productId) => {
    setShowDescription((prevState) => {
      const updatedDescription = { ...prevState };
      updatedDescription[productId] = !prevState[productId] || false;
      return updatedDescription;
    });
  };
/*Funktionen skapar en array av produkter i varukorgen genom att matcha produkt i varukorgen med produkterna i den totala produktlistan.*/ 
  const completePurchase = () => {
    const cartArray = Object.keys(cart)
      .map((productId) => ({
        ...products.find((product) => product.id === parseInt(productId)),
        quantity: cart[productId],
      }))
      .filter((product) => product.quantity > 0);

    UpdateInventory(cartArray);

    setCart({});
    setStatusPurchase('success');
    setTotalPrice(0);
    setOkMessage('Köpet har genomförts! Tack för din beställning.');

    setTimeout(() => {
      setStatusPurchase('');
      setOkMessage('');
      window.location.reload(); // Ladda om sidan efter 2 sekunder
    }, 2000);
  };

  const numProductsInCart = Object.keys(cart).reduce((total, productId) => total + cart[productId], 0);

  return (
    <div className="shopping-cart">
      <div className="varukorg">
        {Object.keys(cart).map((productId) => {
          const product = products.find((p) => p.id === parseInt(productId));
          const quantity = cart[productId];
          return (
            <CartProduct
              key={product.id}
              product={product}
              quantity={quantity}
              removeFromCart={removeFromCart}
            />
          );
        })}
        <div className="total-price korg">Totalt pris: {totalPrice.toFixed(2)} kr</div>
        <button className="checkout-button" onClick={completePurchase}>
          Genomför Köp
        </button>
        <button className="remove-all-button" onClick={removeAllFromCart}>
          Ta bort allt
        </button>
        
      </div>
    </div>
  );
};

export default ShoppingCart;



