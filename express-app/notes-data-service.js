const fs = require('fs');
const constants = require('./constants');

getNextNoteId = (notes) => {
    return notes.map(note => note.id).reduce((maxId, id) =>  maxId <= id ? (id + 1) : maxId, 1);
}


checkProperty = (object, key) => {
    if(object.hasOwnProperty(key) && (object[key] != "") && object[key])
        return true;
    return false;    
}

filterCurrentUserNotes  = (request, response) => {
    let notes = JSON.parse(fs.readFileSync(constants.NOTES_LIST_DATABASE_ADDRESS).toString());
    let currentUser = request.currentUser;
    let currentUserNotes = notes.filter(note => note.userId == currentUser.userId)
                                .map(note => {
                                    delete note['userId'];
                                    return note;
                                });
    return currentUserNotes;
}

module.exports = {

  getNotes: (request, response) => {
    response.status(200).send(filterCurrentUserNotes(request, response));
  },

  addNotes: (request, response) => {
    let currentUser = request.currentUser;
    let body = request.body;
    if(!body.hasOwnProperty('value') || body.value == ""){
        response.status(500).send({error : "value dosen't exist on this object"});
    } else {
        let notes = JSON.parse(fs.readFileSync(constants.NOTES_LIST_DATABASE_ADDRESS).toString());
        let note = {
            userId : currentUser.userId,
            id : getNextNoteId(notes),
            value : body.value,
            isPinned : false,
            color: "#202124"
        };
        notes.push(note);
        fs.writeFileSync(constants.NOTES_LIST_DATABASE_ADDRESS, JSON.stringify(notes, null, 2));
        response.status(200).send(filterCurrentUserNotes(request, response));
      }    
  },

  updateNote: (request, response) => {
    let newObject = request.body;
    let currentUser = request.currentUser;
    let isObjectValid = false;
    let objectFound = false;
    if(checkProperty(newObject, 'value')
       && checkProperty(newObject, 'id')
       && checkProperty(newObject,'color')
       && newObject.hasOwnProperty('isPinned')){
           isObjectValid = true
    }
    if(!isObjectValid){
        response.status(400).send({error : "wrong object to update..!"});
    } else {
        let notes = JSON.parse(fs.readFileSync(constants.NOTES_LIST_DATABASE_ADDRESS).toString());
        for(var i = 0; i < notes.length; i++){
            if(notes[i].id == request.params.id){
                newObject['userId'] = currentUser.userId;
                notes[i] = newObject;
                objectFound = true;
                fs.writeFileSync(constants.NOTES_LIST_DATABASE_ADDRESS, JSON.stringify(notes, null, 2));
                break;
            }
        }
        if(!objectFound){
            response.status(500).send({error : "object with this id is not found.."});
        } else {
            response.status(200).send(filterCurrentUserNotes(request, response));
        }
    }
  },

  deleteNote: (request, response) => {
    let notes = JSON.parse(fs.readFileSync(constants.NOTES_LIST_DATABASE_ADDRESS).toString());
    let objectFound = false;
    for(var i = 0; i < notes.length; i++){
        if(notes[i].id == request.params.id){
            notes.splice(i, 1);
            fs.writeFileSync(constants.NOTES_LIST_DATABASE_ADDRESS, JSON.stringify(notes, null, 2));
            objectFound = true;
            break;
        }
    }
    if(!objectFound){
        response.status(500).send({error : "object with this id is not found"});
    } else  {
        response.status(200).send(filterCurrentUserNotes(request, response));
    }
  }
}