var fs = require('fs');
const constants = require('../constants');

function getAllNotes(){
    return JSON.parse(fs.readFileSync(constants.NOTES_LIST_DATABASE_ADDRESS).toString());
}

function writeAllNotes(data){
    fs.writeFileSync(constants.NOTES_LIST_DATABASE_ADDRESS, JSON.stringify(data, null, 2));
}

module.exports = {

    getAllNotes(){
        return JSON.parse(fs.readFileSync(constants.NOTES_LIST_DATABASE_ADDRESS).toString());
    },

    getNotes: (userId) => {
        return getAllNotes().filter(note => note.userId == userId).map(note => {
                delete note['userId'];
                return note;
            });
    },

    writeNotes: (data) => {
        writeAllNotes(data);
    },

    addNote: (data) => {
        let notes = getAllNotes();
        notes.push(data);
        writeAllNotes(notes);
    },

    updateNote(newNote){
        let noteFound = false;
        let notes = getAllNotes().map(note => {
            if(note.id == newNote.id){
                noteFound = true;
                return newNote;
            }
            return note;
        });
        if(noteFound)
            writeAllNotes(notes);
        return noteFound;
    },

    deleteNote(noteId){
        let noteFound = false;
        let notes = getAllNotes().filter(note => {
            if(note.id == noteId)
                noteFound = true;
            return note.id != noteId;    
        });
        if(noteFound)
            writeAllNotes(notes);
        return noteFound;
    }
}