/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-misused-promises */
import * as express from 'express'
import { type Request, type Response } from 'express'
import client from './database'

const app = express()
const PORT = 3000

app.use(express.json())

app.get('/', (req: Request, res: Response) => {
  return res.send('Hello from the Home Page')
})

app
  .route('/api/products')
  .get(async (_req: Request, res: Response) => {
    try {
      const result = await client.query('SELECT * FROM products')
      const data = result.rows
      return res.json(data)
    } catch (error) {
      console.error('Error executing query:', error)
      return res.status(500).json({ error: 'Internal Server Error' })
    }
  })
  .post(async (req: Request, res: Response) => {
    const { name, description, price, stockQuantity } = req.body

    if (!name || !description || !price || !stockQuantity) {
      return res.status(400).json({ error: 'Please provide all required fields.' })
    }

    try {
      const query = 'INSERT INTO products (name, description, price, stock_quantity) VALUES ($1, $2, $3, $4) RETURNING *'
      const values = [name, description, price, stockQuantity]
      const result = await client.query(query, values)

      return res.status(201).json(result.rows[0])
    } catch (error) {
      console.error('Error inserting product:', error)
      return res.status(500).json({ error: 'Internal Server Error' })
    }
  })

app
  .route('/api/products/:id')
  .get(async (req: Request, res: Response) => {
    const productId = req.params.id

    try {
      const result = await client.query('SELECT * FROM products WHERE product_id = $1', [productId])
      if (result.rows.length === 0) {
        return res.status(404).json({ error: `Product with ID ${productId} not found` })
      }

      return res.json(result.rows[0])
    } catch (error) {
      console.error('Error fetching product:', error)
      return res.status(500).json({ error: 'Internal Server Error' })
    }
  })
  .put(async (req: Request, res: Response) => {
    const productId = req.params.id
    const { name, description, price, stockQuantity } = req.body
    try {
      const checkProduct = await client.query('SELECT * FROM products WHERE product_id = $1', [productId])

      if (checkProduct.rows.length === 0) {
        return res.status(404).json({ error: `Product with ID ${productId} not found` })
      }

      const result = await client.query(
        'UPDATE products SET name = $1, description = $2, price = $3, stockQuantity = $4 WHERE product_id = $5 RETURNING *',
        [name, description, price, stockQuantity, productId]
      )

      return res.json(result.rows[0])
    } catch (error) {
      console.error('Error updating product:', error)
      return res.status(500).json({ error: 'Internal Server Error' })
    }
  })
  .delete(async (req: Request, res: Response) => {
    const productId = req.params.id
    try {
      const result = await client.query('DELETE FROM products WHERE product_id = $1', [productId])

      if (result.rowCount === 0) {
        return res.status(404).json({ error: `Product with ID ${productId} not found` })
      }

      return res.json({ message: `Product with ID ${productId} deleted successfully` })
    } catch (error) {
      console.error('Error deleting product:', error)
      return res.status(500).json({ error: 'Internal Server Error' })
    }
  })

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
