const { Client } = require('pg');
var utils = require('./express-app/utils');

const client = new Client({
//   connectionString: process.env.DATABASE_URL,
  connectionString: 'postgres://vxhndzidtvjwqz:d9911a89b48acabcd30911ffa5e8cba731dd4ac17bc2880cc8f7332625ab4d88@ec2-50-19-26-235.compute-1.amazonaws.com:5432/dc3lu4kj0bgis7',
  ssl: {
    rejectUnauthorized: false
  }
});


client.connect();

let value = 'rahul';
let id = 3;
let userId = 'fcc7d339-311f-4308-b135-f82109a0d101';

client.query(`SELECT * FROM users WHERE user_id = '${userId}'`, (err, res) => {
  if (err) throw err;
  console.log(res);
//   for (let row of res.rows) {
//     console.log(JSON.stringify(row));
//   }
  client.end();
});

