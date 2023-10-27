const fs = require('fs');
const express = require('express');
const cors = require('cors');
const app = express();
app.use(express.json());
app.use(cors());


app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

/*Get förfrågning till mina products som liger i json fil som innehålla data som respresentera producterna med hjälp av fs.readFileSync */ 
app.get('/products', (req, res) => {
  
  let body = [];

  try {
    const rawProducts = fs.readFileSync('./data/products.json');
    const products = JSON.parse(rawProducts);
     /*Detta kollar om det finns en query-parameter 'name' i GET-förfrågan och filtreras produkterna baserat på detta namn. Om det inte finns någon 'name'-parameter i förfrågan, används alla produkter som svar.*/ 

    if (req.query.name !== undefined) {
      const queryName = req.query.name.toLowerCase();
      products.forEach(product => {
        const productName = product.name.toLowerCase();
        if (productName.includes(queryName)) {
          body.push(product);
       }
      });
    } else {
      body = products;
    }
  } catch (e) {
    body = { error: 'something went wrong' };
  }

  res.send(body);
});

/* PATCH-förfrågan på min data för att updatera inventory (saldo) baserat på antal producter som anvädare har lagt till kundvagnen. Efter köpet är genomför inventoy ska uppdateras i min products.json fil*/ 
app.patch('/products', async (req, res) => {
  const productList = req.body.products;
  const rawData = fs.readFileSync('./data/products.json', 'utf-8');
  let products = JSON.parse(rawData);

  for (const cartProduct of productList) {
    const { id, quantity } = cartProduct;
    const productToUpdate = products.find((product) => product.id === id);
    if (productToUpdate) {
      productToUpdate.inventory -= quantity;
    }
  }
  await fs.writeFileSync('./data/products.json', JSON.stringify(products, null, 2));
  res.json({ message: 'Inventory updated successfully' });
});

/*listening på port 3000 för att testa min backend med postman*/ 
app.listen(3000, () => {
  console.log("Listening on port 3000 ...");
});
