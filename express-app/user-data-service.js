const fs = require('fs');
const uuid = require('uuid');
const jwt = require('jsonwebtoken');
const constants = require('./constants')


function checkProperty(object, key){
    if(object.hasOwnProperty(key) && (object[key] != "") && object[key])
        return true;
    return false;    
}


module.exports = {
    addUser: (request, response) => {
        let user = request.body;
        if(checkProperty(user, 'firstname') 
            && checkProperty(user, 'lastname') 
            && checkProperty(user, 'contact') 
            && checkProperty(user, 'password') 
            && checkProperty(user, 'email')) {
            let users = JSON.parse(fs.readFileSync(constants.USER_LIST_DATABASE_ADDRESS).toString());
            user['userId'] = uuid.v4();   // add new property userId to user
            users.push(user);
            fs.writeFileSync(constants.USER_LIST_DATABASE_ADDRESS, JSON.stringify(users, null, 2));
            response.status(200).send({ message: 'REGISTERED SUCCESSFULLY', status: true });
        } else {
                response.status(200).send({ message: "some properties are missing!!", status: false })
        }
    },

    authenticateUser: (request, response) => {
        let credentials = request.body;
        let token;     
        let userFound = false;
        let users = JSON.parse(fs.readFileSync(constants.USER_LIST_DATABASE_ADDRESS).toString());
        users.forEach(user => {
            if(credentials.email == user.email && credentials.password == user.password){
                userFound = true;
                token = jwt.sign({ email: user.email, userId: user.userId }, user.password, { expiresIn: constants.TOKEN_VALIDITY });
            }   
        });
        if(userFound){
            response.status(200).send({ token: token });
        } else {
            response.status(401).send({ error: "There is no account with these credentials" }); 
        }
    }
}