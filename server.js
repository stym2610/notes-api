const express = require('express');
const app = express();
const cors = require('cors');
const fs = require('fs');
const bodyparser = require('body-parser');
const notesDataService = require('./express-app/notes-data-service');
const userDataService = require('./express-app/user-data-service');
const authenticate = require('./express-app/auth.service').authenticate;


app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended : false}));
app.use(cors());

if(!fs.existsSync('./database'))
    fs.mkdirSync('./database', { recursive: true});

if(!fs.existsSync('./database/saved-notes.json'))
    fs.writeFileSync('./database/saved-notes.json', '[]');

if(!fs.existsSync('./database/userlist.json'))
    fs.writeFileSync('./database/userlist.json', '[]');


app.get('/testapi', (request, response) => {
    response.status(200).send('API is working');
});

app.get('/notes',  authenticate, notesDataService.getNotes);

app.post('/notes', authenticate, notesDataService.addNotes);

app.put('/notes/:id', authenticate, notesDataService.updateNote);

app.delete('/notes/:id', authenticate, notesDataService.deleteNote);

app.post('/signup', userDataService.addUser);

app.post('/authenticate', userDataService.authenticateUser);

app.get('/get-current-user', authenticate, userDataService.getCurrentUser);

app.post('/forget-password', userDataService.sendChangePasswordMail);

app.get('/change-password', authenticate, userDataService.checkChangePasswordToken);

app.post('/change-user-detail', userDataService.changeUserDetail);

app.get('/get-all-users', authenticate, userDataService.getAllUsers);

app.listen(process.env.PORT || 3001, () => {
    console.log(`api is running at PORT 3001`);
});



