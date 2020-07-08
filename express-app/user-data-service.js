const fs = require('fs');
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
        let user = request.body;
        if(checkProperty(user, 'name') 
            && checkProperty(user, 'contact') 
            && checkProperty(user, 'password') 
            && checkProperty(user, 'email')) {
            let users = JSON.parse(fs.readFileSync(constants.USER_LIST_DATABASE_ADDRESS).toString());
            user['userId'] = uuid.v4();   // adding new property userId to user
            users.push(user);
            fs.writeFileSync(constants.USER_LIST_DATABASE_ADDRESS, JSON.stringify(users, null, 2));
            response.status(200).send({ message: 'REGISTERED SUCCESSFULLY', status: true });
        } else {
                response.status(200).send({ message: "REGISTRATION FAILED", status: false })
        }
    },
    
    changeUserDetail: (request, response) => {
        let changedUserDetails = request.body;
        let userFound = false;
        let users = JSON.parse(fs.readFileSync(constants.USER_LIST_DATABASE_ADDRESS).toString());
        users = users.map(user => {
            if(user.email == changedUserDetails.email){
                userFound = true;
                return changedUserDetails;
            } else {
                return user;
            }
        });
        if(userFound){
            fs.writeFileSync(constants.USER_LIST_DATABASE_ADDRESS, JSON.stringify(users, null, 2));
            response.status(200).send({ message: "Password changed successfully", status: true });
        } else {
            response.status(404).send({ message: "Some error occured.. Try again later", status: false });
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
    },

    sendChangePasswordMail: (request, response) => {
        let email = request.body.email;
        let users = JSON.parse(fs.readFileSync(constants.USER_LIST_DATABASE_ADDRESS).toString());
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
                html: `<p>You're receiving this e-mail because you or someone else has requested a password reset for your user account</p><br><br>
                       <p>Click the link below to reset your password:</p>
                       <a href="http://notes--app-ui.herokuapp.com/changepassword?token=${token}">http://notes--app-ui.herokuapp.com/changepassword?token=${token}</a>`
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

    getUser: (request, response) => {
        let userId = request.currentUser.userId;
        let users = JSON.parse(fs.readFileSync(constants.USER_LIST_DATABASE_ADDRESS).toString());
        let fullUserDetail = users.filter(user => user.userId == userId)[0];
        delete fullUserDetail["password"];
        response.status(200).send(fullUserDetail);
    }
}