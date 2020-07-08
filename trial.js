const jwt = require('jsonwebtoken');

let token = "'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InN0eW0yNjEwQGdtYWlsLmNvbSIsInVzZXJJZCI6ImQyNzFmMDA3LWFjNGYtNDZhYi04MGQxLTUwYzQ2MzViYWJlNiIsImlhdCI6MTU5NDEwODAzMywiZXhwIjoxNTk0MTExNjMzfQ.iYljar2-UP-pqunjja3L5wagI6kOj4k1SxRUeQB_u8Q'";
 console.log(jwt.decode(token));