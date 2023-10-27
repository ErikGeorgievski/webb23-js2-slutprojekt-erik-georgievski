export async function UpdateInventory(cartArray) {
  const apiUrl = 'http://localhost:3000/products'; 
  const productsToUpdate = cartArray.map(product => ({
    id: product.id,
    quantity: product.quantity,
  }));

  try {
    const response = await fetch(apiUrl, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ products: productsToUpdate }),
    });

    if (response.ok) {
      console.log('Lagernivån har uppdaterats framgångsrikt.');
      
    } else {
      console.error('Gör inte att uppdatera lagernivån:', response.statusText);
      
    }
  } catch (error) {
    console.error('Fel att kommit vid uppdatering av lagernivån:', error);
   
  }
}


