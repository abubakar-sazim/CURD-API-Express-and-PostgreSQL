const { Client } = require('pg');

const client = new Client({
    host: "localhost",
    user: "postgres",
    port: 5432,
    password: "1808031",
    database: "demo"
})

client.connect();

client.query('Select * from products', (err, res) => {
    if(!err){
        console.log(res.rows);
    }else {
        console.log(err.message);
    }
    client.end;
})