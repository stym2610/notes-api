// const { Client } = require('pg');
// var utils = require('./express-app/utils');

// const client = new Client({
// //   connectionString: process.env.DATABASE_URL,
//   connectionString: 'postgres://vxhndzidtvjwqz:d9911a89b48acabcd30911ffa5e8cba731dd4ac17bc2880cc8f7332625ab4d88@ec2-50-19-26-235.compute-1.amazonaws.com:5432/dc3lu4kj0bgis7',
//   ssl: {
//     rejectUnauthorized: false
//   }
// });


// client.connect();

// let value = 'rahul';
// let id = 3;
// let userId = 'fcc7d339-311f-4308-b135-f82109a0d101';

// var newUser = {
//   name: 'tinku',
//   email: 'tinku@gmail.com',
//   contact: 9191919191,
//   admin: false,
//   resgistrationDate: '1223456',
//   lastLogin: '1234567',
//   password: 'Abcd1234'
// };

// client.query(`INSERT INTO users (name, email, contact, admin, registration_date, last_login, password)
// VALUES('${newUser.name}', '${newUser.email}', ${newUser.contact}, ${newUser.admin}, '${newUser.registrationDate}', '${newUser.lastLogin}', '${newUser.password}')`, (err, res) => {
//   if (err) throw err;
//   console.log(res);
// //   for (let row of res.rows) {
// //     console.log(JSON.stringify(row));
// //   }
//   client.end();
// });

console.log(+'-');

