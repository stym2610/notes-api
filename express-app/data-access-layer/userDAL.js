var utils = require('../utils');
const { Client } = require('pg');


// (()=>{
//     console.log('-----------------------------logged------------------------------------')
// })()

function getConnection(){
    return  new Client({
          connectionString: process.env.DATABASE_URL,
        //   connectionString: 'postgres://vxhndzidtvjwqz:d9911a89b48acabcd30911ffa5e8cba731dd4ac17bc2880cc8f7332625ab4d88@ec2-50-19-26-235.compute-1.amazonaws.com:5432/dc3lu4kj0bgis7',
          ssl: {
            rejectUnauthorized: false
          }});
}
//CRUD
module.exports = {
    getUser: async (userId) => {
        const client = getConnection();
        try{
            client.connect();
            var response = await client.query(`SELECT * FROM users WHERE user_id = '${userId}'`);
            await client.end();
            if(response.rowCount)
                return utils.transformUserProperties(response.rows)[0];
            else 
                return null;    
        }
        catch(err){
            await client.end();
        }
    },

    checkUserCredentials: async (credentials) => {
        const client = getConnection();
        try{
            client.connect();
            var response = await client.query(`SELECT user_id FROM users WHERE email = '${credentials.email}' AND password = '${credentials.password}'`);
            if(response.rowCount)
                return utils.transformUserProperties(response.rows)[0].userId;
            else 
                return null;    
        }
        catch(err){
            await client.end();
        }
    },

    checkUserExist: async (email) => {
        const client = getConnection();
        try{
            client.connect();
            var response = await client.query(`SELECT * FROM users WHERE email = '${email}'`);
            await client.end();
            if(response.rowCount)
                return utils.transformUserProperties(response.rows)[0];
            else    
                return null;    
                
        }
        catch(err){
            await client.end();
        }
    },

    getAllUsers: async () => { 
        const client = getConnection();
        try{
            client.connect();
            var response = await client.query(`SELECT * FROM users`);
            await client.end();
            return utils.transformUserProperties(response.rows);
        }
        catch(ex){
            console.error(ex);
            await client.end();
        }
    },

    addUser: async (newUser) => {
        const client = getConnection();
        try{
            client.connect();
            var response = await client.query(`INSERT INTO users (name, email, contact, admin, registration_date, last_login, password)
                          VALUES('${newUser.name}', '${newUser.email}', ${newUser.contact}, ${newUser.admin}, '${newUser.registrationDate}', '${newUser.lastLogin}', '${newUser.password}')`);
            await client.end();
            return response.rowCount;
        }
        catch(err){
            await client.end();
        }
    },

    updatePassword : async (changedUserDetails) => {
        const client = getConnection();
        try{
            client.connect();
            var response = await client.query(`UPDATE users SET password = '${changedUserDetails.password}' WHERE user_id = '${changedUserDetails.userId}'`);
            await client.end();
            return response.rowCount;
        }
        catch(err){
            await client.end();
        }
    },

    updateLastLogin: async (userId) => {
        const client = getConnection();
        try{
            client.connect();
            var response = await client.query(`UPDATE users SET last_login = '${('' + (+new Date()))}' WHERE user_id = '${userId}'`);
            await client.end();
            return response.rowCount;
        }
        catch(err){
            await client.end();
        }
    }

    // deleteUser: (userId) => {
    //     let userFound = false;
    //     let users = readAllUsers().filter(user => )
    // },

    
}