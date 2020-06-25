const fs = require('fs');
const constants = require('./constants');

module.exports = {

  getNotes: (request, response) => {
    response.send(JSON.parse(fs.readFileSync(constants.NOTES_LIST_DATABASE_ADDRESS).toString()));
  },

  addNotes: (request, response) => {
    let body = request.body;
    if(!body.hasOwnProperty('value') || body.value == ""){
        response.status(500).send({error : "value dosen't exist on this object"});
    } else {
        let notes = JSON.parse(fs.readFileSync(constants.NOTES_LIST_DATABASE_ADDRESS).toString());
        let note = {
            id : (notes.length + 1),
            value : body.value,
            isPinned : false
        };
        notes.push(note);
        fs.writeFileSync(constants.NOTES_LIST_DATABASE_ADDRESS, JSON.stringify(notes, null, 2));
        response.status(200).send(JSON.parse(fs.readFileSync(constants.NOTES_LIST_DATABASE_ADDRESS).toString()));
      }    
  },

  updateNote: (request, response) => {
    let newObject = request.body;
    let isObjectValid = false;
    let objectFound = false;
    if(newObject.hasOwnProperty("value") && newObject.hasOwnProperty("id") && newObject.hasOwnProperty("isPinned")){isObjectValid = true}     
    if(!isObjectValid){
        response.status(500).send({error : "wrong value OR value field is empty..!"});
    } else {
        let notes = JSON.parse(fs.readFileSync(constants.NOTES_LIST_DATABASE_ADDRESS).toString());
        for(var i = 0; i < notes.length; i++){
            if(notes[i].id == request.params.id){
                notes[i] = newObject;
                objectFound = true;
                fs.writeFileSync(constants.NOTES_LIST_DATABASE_ADDRESS, JSON.stringify(notes, null, 2));
                break;
            }
        }
        if(!objectFound){
            response.status(500).send({error : "object with this id is not found.."});
        } else {
            response.status(200).send(JSON.parse(fs.readFileSync(constants.NOTES_LIST_DATABASE_ADDRESS).toString()));
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
        response.status(200).send(JSON.parse(fs.readFileSync(constants.NOTES_LIST_DATABASE_ADDRESS).toString()));
    }
  }
}