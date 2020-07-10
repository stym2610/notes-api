var fs = require('fs');
const constants = require('../constants');

function readAllUsers(){
    return JSON.parse(fs.readFileSync(constants.USER_LIST_DATABASE_ADDRESS).toString());
}

function writeUsers(data){
    fs.writeFileSync(constants.USER_LIST_DATABASE_ADDRESS, JSON.stringify(data, null, 2));
}

//CRUD
module.exports = {
    getUser : (userId) => {
        return readAllUsers().find(user => user.userId == userId);
    },

    getAllUsers: () => {
        return readAllUsers();
    },

    addUser: (newUser) => {
        let users = readAllUsers();
        users.push(newUser);
        writeUsers(users);
    },

    writeAllUsers: (data) => {
        writeUsers(data);
    },

    updateUser : (changedUserDetails) => {
        let userFound = false;
        let users = readAllUsers().map(user => {
            if(user.userId == changedUserDetails.userId){
                userFound = true;
                return changedUserDetails;
            }
            return user;
        });
        if(userFound){
            writeUsers(users);
        }
        return userFound;
    }

    // deleteUser: (userId) => {
    //     let userFound = false;
    //     let users = readAllUsers().filter(user => )
    // },

    
}