const express = require('express');
const app = express();
const cors = require('cors');
const bodyparser = require('body-parser');
const notesDataService = require('./express-app/notes-data-service');
const userDataService = require('./express-app/user-data-service');
const authenticate = require('./express-app/auth.service').authenticate;

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended : false}));
app.use(cors());


app.get('/testapi', (request, response) => {
    response.status(200).send('API is working');
});


app.get('/notes',  authenticate, notesDataService.getNotes);

app.post('/notes', authenticate, notesDataService.addNotes);

app.put('/notes/:id', authenticate, notesDataService.updateNote);

app.delete('/notes/:id', authenticate, notesDataService.deleteNote);

app.post('/signup', userDataService.addUser);

app.post('/authenticate', userDataService.authenticateUser);

app.listen(process.env.PORT || 3000, () => {
    console.log(`api is running at PORT 3000`);
});



