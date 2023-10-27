import React, { useState, useEffect } from 'react';
import img from './img/logo.png';
import ShoppingCart from './ShoppingCart';
import SearchBar from './SearchBar';
import Product from './Product';
import { UpdateInventory } from './UpdateInventory';

export default function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState({});
  const [totalPrice, setTotalPrice] = useState(0);
  const [showDescription, setShowDescription] = useState({});
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [okMessage, setOkMessage] = useState('');
  const [statusPurchase, setStatusPurchase] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');

/*function för att hämta produktdatan från min backend http://localhost:3000/products. Om hämtningen är ok, uppdateras komponentens products-tillstånd med den hämtade datan. Om det uppstår något fel under hämtningen loggas felmeddelandet.*/
  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch('http://localhost:3000/products');
        if (response.ok) {
          const data = await response.json();
          setProducts(data);
        } else {
          console.error('Error fetching products:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    }

    fetchProducts();
  }, []);

  const addToCart = (product) => {
     /*Kollar om produkten är tillgänglig i lagret och saldot är mer ån 0 (inventariet > 0)*/
    if (product.inventory > 0) {
       /* Kontrollera om antalet produkter som användaren vill lägga till inte överstiger lagersaldot */
      if (cart[product.id] === undefined || cart[product.id] < product.inventory) {
        const updatedCart = { ...cart };
        updatedCart[product.id] = (updatedCart[product.id] || 0) + 1;
        setCart(updatedCart);
        setTotalPrice(totalPrice + product.price);
      } else {
        setOkMessage('Du kan inte lägga till fler av denna produkt i varukorgen.');
        setTimeout(() => {
          setOkMessage(''); // Tar bort meddelandet efter 3 sekunder
        }, 3000);
      }
    } else {
      
      setOkMessage('Produkten är slutsåld.');
      setTimeout(() => {
        setOkMessage(''); // Tar bort meddelandet efter 3 sekunder
      }, 3000);
    }
  };
/*Denna funktion minskar antalet av en produkt i varukorgen och uppdaterar varukorgens tillstånd samt det totala priset.*/
const removeFromCart = (product) => {
  const updatedCart = { ...cart };
  if (updatedCart[product.id] > 1) {
    updatedCart[product.id] -= 1;
  } else {
    delete updatedCart[product.id]; // Ta bort produkten från varukorgen om antalet är 1
  }
  setCart(updatedCart);
  setTotalPrice(totalPrice - product.price);
};

/*Tomma varukorgen och uppdatera priset till 0*/
  const removeAllFromCart = () => {
    setCart({});
    setTotalPrice(0);
  };
/* funktion hanterar klickhändelsen för att visa eller dölja produktbeskrivningen genom att växla mellan true och false för den angivna produktens id i showDescription*/
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

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
/*funktionen används för att sortera produkterna antingen stigande (asc) eller fallande (desc) efter deras pris och uppdateras komponentens products med de sorterade produkterna och sorteringsordningen sparas också.*/ 
  const sortProductsByPrice = (order) => {
    const sortedProducts = [...products];

    sortedProducts.sort((a, b) => {
      if (order === 'asc') {
        return a.price - b.price;
      } else if (order === 'desc') {
        return b.price - a.price;
      }

      return 0;
    });

    setProducts(sortedProducts);
    setSortOrder(order);
  };

  return (
    <div className="App">
      <header className="App-header">
        <img className='logo-img' src={img} alt="ElectroElegance Logo" />
        <h1 className='namn'>ElectroElegance</h1>
      </header>

      <div className="shopping-cart">
        <marquee behavior="" direction="">
        🌟 Black Friday hos ElectroElegance! 🌟 Slå till på årets bästa erbjudanden hos
      ElectroElegance den här Black Friday! 🎉 Våra Black Friday Erbjudanden: 🎉
      Upp till 40% rabatt på utvalda laptops och smartwatches!, Gratis frakt för alla beställningar
      inom Sverige!  Exklusiva gåvor med ditt köp  bara för Black Friday!✨ ElectroElegance - Framtidens Teknik Med Elegans! ✨
        </marquee>

        <div className="cart-icon" onClick={() => setIsCartOpen(!isCartOpen)}>
          🛒 {numProductsInCart > 0 && <span className="cart-count">{numProductsInCart}</span>}
        </div>

        <div className='shop'>
          <div className='varukorg'>
            {isCartOpen && (
              <ShoppingCart
                products={products}
                cart={cart}
                setCart={setCart}
                totalPrice={totalPrice}
                setTotalPrice={setTotalPrice}
                showDescription={showDescription}
                setShowDescription={setShowDescription}
                okMessage={okMessage}
                setOkMessage={setOkMessage}
                statusPurchase={statusPurchase}
                setStatusPurchase={setStatusPurchase}
                sortOrder={sortOrder}
                setSortOrder={setSortOrder}
                setIsCartOpen={setIsCartOpen}
              />
            )}
          </div>
        </div>
        <a href=".product-list">
        <h2 className='produkter'>Produkter</h2>
      </a>

      <div className="div01">
      <div className='search-bar'>
        <SearchBar searchTerm={searchTerm} onSearchTermChange={setSearchTerm} />
        <select onChange={(e) => sortProductsByPrice(e.target.value)}>
          <option value="">Sortera Pris</option>
          <option value="asc">Pris-Stigande</option>
          <option value="desc">Pris-Fallande</option>
        </select>
        
      </div>
      </div>
      {okMessage && <div className="ok-message">{okMessage}</div>}

      <div className="product-list">
        {filteredProducts.map((product) => (
          <Product
            key={product.id}
            product={product}
            addToCart={addToCart}
            handleClick={handleClick}
            showDescription={showDescription}
          />
        ))}
      </div>
    </div>
  </div>
);
}













