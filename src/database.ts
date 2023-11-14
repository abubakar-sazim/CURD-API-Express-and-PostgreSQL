import { Client } from 'pg'
import * as dotenv from 'dotenv'
dotenv.config()

const client = new Client({
  host: 'localhost',
  user: process.env.DB_USERNAME,
  port: 5432,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
})

client.connect()

export default client
