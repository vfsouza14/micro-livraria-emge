const express = require('express');
const shipping = require('./shipping');
const inventory = require('./inventory');
const cors = require('cors');

const app = express();
app.use(cors());

/**
 * Retorna a lista de produtos da loja via InventoryService
 */
app.get('/products', (req, res, next) => {
    inventory.SearchAllProducts(null, (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send({ error: 'something failed :(' });
        } else {
            res.json(data.products);
        }
    });
});

app.get('/books/:id', (req, res) => {
    const { id } = req.query;

    const updatedProduct = inventory.UpdateProduct(id);

    return updatedProduct;
});


/**
 * Consulta o frete de envio no ShippingService
 */
app.get('/shipping/:cep', (req, res, next) => {
    shipping.GetShippingRate(
        {
            cep: req.params.cep,
        },
        (err, data) => {
            if (err) {
                console.error(err);
                res.status(500).send({ error: 'something failed :(' });
            } else {
                res.json({
                    cep: req.params.cep,
                    value: data.value,
                });
            }
        }
    );
});

app.get('/product/:id', (req, res, next)=> {
    inventory.SearchProductByID({id: req.params.id}, (err, product) => {
         // Se ocorrer algum erro de comunicação
        // com o microsserviço, retorna para o navegador.
        if (err){
            console.error(err);
            res.status(500).send({ error: 'Houve algum erro'});
        }else{
            // Caso contrário, retorna resultado do
            // microsserviço (um arquivo JSON) com os dados
            // do produto pesquisado
            res.json(product);
        }
    });
});


/**
 * Inicia o router
 */
app.listen(3000, () => {
    console.log('Controller Service running on http://localhost:3000');
});
