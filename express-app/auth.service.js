const jwt = require('jsonwebtoken');
const userDAL = require('./data-access-layer/userDAL');


module.exports = {
    authenticate: async (request, response, next) => {
        let token = request.headers.token;
        if(!token) {
            response.status(401).send({ message: "Unauthorised access" });
        } else {
            let currentUser = jwt.decode(token);
            let isUserValid;
            let user = await userDAL.getUser(currentUser.userId);
            if(user){
                jwt.verify(token, user.password, (error, payload) => {
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
                    response.status(401).send({ message: "token not valid", status: false });
                }
            } else {
                response.status(404).send({ message: 'internal serve error or user does not exist' });
            }
        }  
    }
}