const constants = require('./constants');
const fs = require('fs');
const jwt = require('jsonwebtoken');

module.exports = {
    authenticate: (request, response, next) => {
        let token = request.headers.token;
        if(!token) {
            response.status(401).send({ message: "Unauthorised access" });
        } else {
            let currentUser = jwt.decode(token);
            let isUserValid;
            let currentUserPassword;
            let users = JSON.parse(fs.readFileSync(constants.USER_LIST_DATABASE_ADDRESS).toString());
            users.forEach(user => {
                if(user.email == currentUser.email) {
                    currentUserPassword = user.password;
                }
            });
            jwt.verify(token, currentUserPassword, (error, payload) => {
                if(error)
                isUserValid = false;
                else
                isUserValid = true;    
            });
            if(isUserValid){
                request['currentUser'] = currentUser;
                next();
            }    
            else {
                response.status(401).send({ message: "Login Again" });
            }
        }  
    }
}