const notesDAL = require('./data-access-layer/notesDAL');


checkProperty = (object, key) => {
    if(object.hasOwnProperty(key) && (object[key] != "") && object[key])
        return true;
    return false;    
}


module.exports = {

  getNotes: async (request, response) => {
    response.status(200).send(await notesDAL.getNotes(request.currentUser.userId))
  },

  addNotes: async (request, response) => {
    let currentUser = request.currentUser;
    let body = request.body;
    if(!body.hasOwnProperty('value') || body.value == ""){
        response.status(500).send({error : "value dosen't exist on this object"});
    } else {
        let note = {
            userId : currentUser.userId,
            value : body.value,
            isPinned : false,
            color: "#202124"
        };
        if(await notesDAL.addNote(note))
            response.status(200).send(await notesDAL.getNotes(request.currentUser.userId));
        else
            response.status(500).send({message: 'FAILED', status: false});    
      }    
  },

  updateNote: async (request, response) => {
    let newObject = request.body;
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
        if(await notesDAL.updateNote(newObject))
            response.status(200).send(await notesDAL.getNotes(request.currentUser.userId));
        else
            response.status(404).send({error : "object with this id is not found.."});
    }
  },

  deleteNote: async (request, response) => {
    if(await notesDAL.deleteNote(request.params.id))
        response.status(200).send(await notesDAL.getNotes(request.currentUser.userId));
    else
        response.status(404).send({error : "object with this id is not found"});
  }
}