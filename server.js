const express = require('express');
const app = express();
const bodyparser = require('body-parser');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const notesDataService = require('./express-app/notes-data-service');
const userDataService = require('./express-app/user-data-service');
const authenticate = require('./express-app/auth.service').authenticate;

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended : false}));




app.get('/notes',  authenticate, notesDataService.getNotes);

app.post('/notes', authenticate, notesDataService.addNotes);

app.put('/notes/:id', authenticate, notesDataService.updateNote);

app.delete('/notes/:id', authenticate, notesDataService.deleteNote);

app.post('/signup', userDataService.addUser);

app.post('/authenticate', userDataService.authenticateUser);

app.listen(3000, () => {
    console.log("API is running at localhost:3000/notes")
});



