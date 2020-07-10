const fs = require('fs');
const constants = require('./constants');
const notesDAL = require('./data-access-layer/notesDAL');

getNextNoteId = (notes) => {
    return notes.map(note => note.id).reduce((maxId, id) =>  maxId <= id ? (id + 1) : maxId, 1);
}


checkProperty = (object, key) => {
    if(object.hasOwnProperty(key) && (object[key] != "") && object[key])
        return true;
    return false;    
}

filterCurrentUserNotes  = (request, response) => {
    let currentUserId = request.currentUser.userId;
    return notesDAL.getNotes(currentUserId);
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
        let notes = notesDAL.getAllNotes();
        let note = {
            userId : currentUser.userId,
            id : getNextNoteId(notes),
            value : body.value,
            isPinned : false,
            color: "#202124"
        };
        notesDAL.addNote(note);
        response.status(200).send(filterCurrentUserNotes(request, response));
      }    
  },

  updateNote: (request, response) => {
    let newObject = request.body;
    let currentUser = request.currentUser;
    let isObjectValid = false;
    if(checkProperty(newObject, 'value')
       && checkProperty(newObject, 'id')
       && checkProperty(newObject,'color')
       && newObject.hasOwnProperty('isPinned')){
           isObjectValid = true
    }
    if(!isObjectValid){
        response.status(400).send({error : "wrong object to update..!"});
    } else {
        newObject['userId'] = currentUser.userId;
        if(notesDAL.updateNote(newObject))
            response.status(200).send(filterCurrentUserNotes(request, response));
        else
            response.status(500).send({error : "object with this id is not found.."});
    }
  },

  deleteNote: (request, response) => {
    if(notesDAL.deleteNote(request.params.id))
        response.status(200).send(filterCurrentUserNotes(request, response));
    else
        response.status(500).send({error : "object with this id is not found"});
  }
}