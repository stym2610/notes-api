module.exports = {
    transformNoteProperties: (array) => {
        return array.map(note => ({
                value: note.value,
                id: note.id,
                color: note.color,
                isPinned: note.is_pinned,
                userId: note.user_id
            }));
    },

    transformUserProperties: (array) => {
        return array.map(user => ({
            userId: user.user_id,
            name: user.name,
            email: user.email,
            contact: user.contact,
            admin: user.admin,
            registrationDate: user.registration_date,
            lastLogin: user.last_login,
            password: user.password
        }));
    }
}