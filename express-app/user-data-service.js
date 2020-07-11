const userDAL = require('./data-access-layer/userDAL');
const uuid = require('uuid');
const jwt = require('jsonwebtoken');
const constants = require('./constants');
const nodemailer = require('nodemailer');


function checkProperty(object, key){
    if(object.hasOwnProperty(key) && (object[key] != "") && object[key])
        return true;
    return false;    
}


module.exports = {
    addUser: (request, response) => {
        let newUser = request.body;
        if(checkProperty(newUser, 'name') 
            && checkProperty(newUser, 'contact') 
            && checkProperty(newUser, 'password') 
            && checkProperty(newUser, 'email')){
            let users = userDAL.getAllUsers();
            if(!users.find(user => user.email == newUser.email)){
                newUser['userId'] = uuid.v4();
                newUser['createdDate'] = +(new Date());
                newUser['lastLogin'] = null;
                userDAL.addUser(newUser);
                response.status(200).send({ message: 'REGISTERED SUCCESSFULLY', status: true });
            } else {
                response.status(400).send({ message: "EMAIL IS ALREADY IN USE", status: false});
            }
        } else {
                response.status(400).send({ message: "REGISTRATION FAILED", status: false })
        }
    },
    
    changeUserDetail: (request, response) => {
        let changedUserDetails = request.body;
        if(userDAL.updateUser(changedUserDetails))
            response.status(200).send({ message: "Password changed successfully", status: true });
        else 
            response.status(404).send({ message: "Some error occured.. Try again later", status: false });
    },

    authenticateUser: (request, response) => {
        let credentials = request.body;
        let token;     
        let userFound = false;
        let users = userDAL.getAllUsers();
        users.forEach(user => {
            if(credentials.email == user.email && credentials.password == user.password){
                userFound = true;
                user['lastLogin'] = +(new Date());
                token = jwt.sign({ email: user.email, userId: user.userId }, user.password, { expiresIn: constants.TOKEN_VALIDITY });
                userDAL.writeAllUsers(users);
            }   
        });
        if(userFound)
            response.status(200).send({ token: token });
        else
            response.status(401).send({ error: "There is no account with these credentials" });
    },

    sendChangePasswordMail: (request, response) => {
        let email = request.body.email;
        let users = userDAL.getAllUsers();
        let matchedUserArray = users.filter(user => user.email == email);
        if(matchedUserArray.length == 1){
            let currentUser = matchedUserArray[0];
            let token = jwt.sign({ email: currentUser.email, userId: currentUser.userId}, currentUser.password, { expiresIn: 60*60 });
            let transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'savenotes.help@gmail.com',
                    pass: 'nwpa718b01'
                }
            });
            let mailOptions = {
                from: 'savenotes.help@gmail.com',
                to: currentUser.email,
                subject: '[SAVENOTES]-verification mail to change password',
                html: `<p>You're receiving this e-mail because you or someone else has requested a password reset for your user account</p><br>
                       <p>Click the link below to reset your password:</p>
                       <a href="http://notes--app-ui.herokuapp.com/changepassword?token=${token}">http://notes--app-ui.herokuapp.com/changepassword?token=${token}</a>
                       <br><br>
                       <p>If you don't use this link within 1 hour, it will expire. To get a new passowrd reset link, visit</p><br>
                       <a href="http://notes--app-ui.herokuapp.com/forgotpassword">http://notes--app-ui.herokuapp.com/forgotpassword</a>
                       <br><br>
                       <p>Thanks</p>`
            };
            transporter.sendMail(mailOptions, (error, info) => {
                if(error)
                    response.status(404).send({ message: "request failed", status: false });
                else
                    response.status(200).send({ message: "Mail sent successfully", status: true });
            });
            
        } else {
            response.status(404).send({ message: "user not found", status: false });
        }
    },

    checkChangePasswordToken: (request, response) => {
        response.status(200).send({ message: "token is valid", status: true});
    },

    getCurrentUser: (request, response) => {
        let userId = request.currentUser.userId;
        let fullUserDetail = userDAL.getUser(userId);
        delete fullUserDetail["password"];
        response.status(200).send(fullUserDetail);
    },

    getAllUsers: (request, response) => {
        let currentUser = request.currentUser;
        let users = userDAL.getAllUsers();
        let fullCurrentUserDetails = users.find(user => currentUser.userId == user.userId);
        if(fullCurrentUserDetails.admin){
            users = users.filter(user => user.admin != true)
            response.status(200).send(users);
        }
        else
            response.status(401).send({ message : 'Unauthorised access', status : false });
    }
}