document.addEventListener('DOMContentLoaded', () => {
    const notesForm = document.getElementById('notesForm')
    const notesList = document.getElementById('notesList')

    function getNotesFromStorage(){
        return JSON.parse(localStorage.getItem('notes')) || []
    }
    function saveNotesToStorage(notes){
        localStorage.setItem('notes', JSON.stringify(notes))
        renderNotes()
    }

    function renderNotes() {
        notesContainer.innerHTML = "";
        let notes = getNotesFromStorage()
        
        notes.forEach(note => {
            const noteElement = document.createElement('div')
            noteElement.classList.add('note')
            noteElement.style.backgroundColor = note.color
            noteElement.innerHTML = `
                <h2>${note.title}</h2>
                <p>${note.content}</p>
                <span>${new Date(note.createdDate).toLocaleString()}</span>
            `
            notesList.appendChild(noteElement)
        })
    }

    notesForm.addEventListener('submit', () => {
        const title = document.getElementById('name').value
        const content = document.getElementById('content').value
        const color = document.getElementById('color').value
        const isPinned = document.getElementById('isPinned').checked


        const NoteTemplate = {
            title,
            content,
            color,
            isPinned,
            createdDate: new Date().toISOString(),
        }
        const notes = getNotesFromStorage()
        notes.push(NoteTemplate)
        saveNotesToStorage(notes)
        notesForm.reset()
    })
    renderNotes()
    
})
