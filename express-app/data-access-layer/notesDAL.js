var utils = require('../utils');
const { Client } = require('pg');


function getConnection(){
    return  new Client({
          connectionString: process.env.DATABASE_URL,
        //   connectionString: 'postgres://vxhndzidtvjwqz:d9911a89b48acabcd30911ffa5e8cba731dd4ac17bc2880cc8f7332625ab4d88@ec2-50-19-26-235.compute-1.amazonaws.com:5432/dc3lu4kj0bgis7',
          ssl: {
            rejectUnauthorized: false
          }});
}


module.exports = {

    getNotes: async (userId) => {
        const client = getConnection();
        try{
            client.connect();
            var response = await client.query(`SELECT * FROM notes WHERE user_id = '${userId}' ORDER BY id ASC`);
            await client.end();
            return utils.transformNoteProperties(response.rows);
        }
        catch(err){
            await client.end();
        }
    },

    addNote: async (data) => {
        const client = getConnection();
        try{
            client.connect();
            var response = await client.query(`INSERT INTO notes (value, is_pinned, color, user_id, created_date, last_modified)
                          VALUES ('${data.value}', ${data.isPinned}, '${data.color}', '${data.userId}', '${('' + (+new Date()))}', '-');`);
            await client.end();
            return response.rowCount;             
        }
        catch(err){
            await client.end();
        }
    },

    updateNote: async (newNote) => {
        const client = getConnection();
        try{
            client.connect();
            var response = await client.query(`UPDATE notes SET value = '${newNote.value}', color = '${newNote.color}', is_pinned = ${newNote.isPinned}, last_modified = '${('' + (+new Date()))}' WHERE id = ${newNote.id}`);
            await client.end();
            return response.rowCount;
        }
        catch(err){
            await client.end();
        }
    },

    deleteNote: async (noteId) => {
        const client = getConnection();
        try{
            client.connect();
            var response = await client.query(`DELETE FROM notes WHERE id = ${noteId}`);
            await client.end();
            return response.rowCount;
        }
        catch(err){
            await client.end();
        }
    }
}