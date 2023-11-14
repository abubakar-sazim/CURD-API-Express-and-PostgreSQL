import * as express from "express"
import {Request, Response} from 'express';
const { Client } = require('pg');

const app = express();
const PORT = 3000;
const client = new Client({
    host: "localhost",
    user: "postgres",
    port: 5432,
    password: "1808031",
    database: "demo"
})

client.connect();

app.use(express.json())

app.get('/', (req: Request, res: Response) => {
    return res.send('Hello from the Home Page');
    });

app
    .route('/api/products')
    .get(async(req: Request, res: Response) => {
        try {
            const result = await client.query('Select * from products');
            const data = result.rows;
            return res.json(data);
        } catch (error) {
            console.error('Error executing query:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        } finally {
            // await client.end();
        }
    })
    .post(async (req: Request, res: Response) => {
        const { name, description, price, stock_quantity } = req.body;
        
            if (!name || !description || !price || !stock_quantity) {
            return res.status(400).json({ error: 'Please provide all required fields.' });
            }
        
            try {
            const query =
                'Insert into products (name, description, price, stock_quantity) VALUES ($1, $2, $3, $4) RETURNING *';
            const values = [name, description, price, stock_quantity];
            const result = await client.query(query, values);
        
            return res.status(201).json(result.rows[0]);
            } catch (error) {
            console.error('Error inserting product:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
            }
        });
    // .put((req: Request, res: Response) => {
    //     return res.send('Product PUT Request');
    // })
    // .delete((req: Request, res: Response) => {
    //     return res.send('Product DELETE Request');
    // });

app
    .route('/api/products/:id')
    .get((req: Request, res: Response) => {
        const productId = req.params.id;
        return res.send(`Product ${productId} GET Request`);
    })
    .put((req: Request, res: Response) => {
        const productId = req.params.id;
        return res.send(`Product ${productId} PUT Request`);
    })
    .delete((req: Request, res: Response) => {
        const productId = req.params.id;
        return res.send(`Product ${productId} DELETE Request`);
    })

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
});