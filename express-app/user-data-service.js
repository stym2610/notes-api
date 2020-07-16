const userDAL = require('./data-access-layer/userDAL');
const jwt = require('jsonwebtoken');
const constants = require('./constants');
const nodemailer = require('nodemailer');


function checkProperty(object, key){
    if(object.hasOwnProperty(key) && (object[key] != "") && object[key])
        return true;
    return false;    
}


module.exports = {
    addUser: async (request, response) => {
        let newUser = request.body;
        if(checkProperty(newUser, 'name') 
            && checkProperty(newUser, 'contact') 
            && checkProperty(newUser, 'password') 
            && checkProperty(newUser, 'email')){
            if(!(await userDAL.checkUserExist(newUser.email))){
                newUser['registrationDate'] = ('' + (+new Date()));
                newUser['lastLogin'] = '-';
                newUser['admin'] = false;
                if(await userDAL.addUser(newUser))
                    response.status(200).send({ message: 'REGISTERED SUCCESSFULLY', status: true });
                else
                    response.status(500).send({ message: "ERROR IN ADDING TO DATABASE", status: false });
               
            } else {
                response.status(400).send({ message: "EMAIL IS ALREADY IN USE", status: false});
            }
        } else {
                response.status(400).send({ message: "REGISTRATION FAILED", status: false });
        }
    },
    
    changeUserDetail: async (request, response) => {
        let changedUserDetails = request.body;
        if(await userDAL.updatePassword(changedUserDetails))
            response.status(200).send({ message: "Password changed successfully", status: true });
        else 
            response.status(404).send({ message: "Some error occured.. Try again later", status: false });
    },

    authenticateUser: async (request, response) => {
        let credentials = request.body;
        let token;     
        let userFound = false;
        let userId = await userDAL.checkUserCredentials(credentials);
        if(userId){
            userFound = true;
            token = jwt.sign({ email: credentials.email, userId: userId }, credentials.password, { expiresIn: constants.TOKEN_VALIDITY });
            await userDAL.updateLastLogin(userId);
        }
        if(userFound)
            response.status(200).send({ token: token });
        else
            response.status(401).send({ error: "There is no account with these credentials" });
    },

    sendChangePasswordMail: async (request, response) => {
        let email = request.body.email;
        let user = await userDAL.checkUserExist(email);
        if(user){
            let token = jwt.sign({ email: user.email, userId: user.userId}, user.password, { expiresIn: 60*60 });
            let transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'savenotes.help@gmail.com',
                    pass: 'nwpa718b01'
                }
            });
            let mailOptions = {
                from: 'savenotes.help@gmail.com',
                to: user.email,
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

    getCurrentUser: async (request, response) => {
        let userId = request.currentUser.userId;
        let fullUserDetail = await userDAL.getUser(userId);
        if(fullUserDetail){
            delete fullUserDetail["password"];
            response.status(200).send(fullUserDetail);
        } else {
            response.status(404).send({ message: 'user not found', status: false});
        }
    },

    getAllUsers: async (request, response) => {
        let currentUser = request.currentUser;
        let users = await userDAL.getAllUsers();
        let fullCurrentUserDetails = users.find(user => currentUser.userId == user.userId);
        if(fullCurrentUserDetails.admin){
            users = users.filter(user => user.admin != true)
            response.status(200).send(users);
        }
        else
            response.status(401).send({ message : 'Unauthorised access', status : false });
    }
}