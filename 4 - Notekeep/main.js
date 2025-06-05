document.addEventListener('DOMContentLoaded', () => {
    const notesList = document.getElementById('notesList')
    const addNoteBtn = document.getElementById('addNoteBtn')
    const emptyState = document.getElementById('emptyState')
    const searchInput = document.getElementById('searchInput')
    const noteTags = document.getElementById('NoteTags')

    function getNotesFromStorage(){
        return JSON.parse(localStorage.getItem('notes')) || []
    }
    function saveNotesToStorage(notes){
        localStorage.setItem('notes', JSON.stringify(notes))
        renderNotes()
    }

    function renderNotes(searchTerm = '') {
        notesList.innerHTML = ""
        const notes = getNotesFromStorage()
        

        const filteredNotes = notes.filter(note => {
            if (!searchTerm) return true
            return note.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                   note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                   note.tags.toLowerCase().includes(searchTerm.toLowerCase())
        })
        
        if (filteredNotes.length === 0) {
            if (searchTerm) {
                notesList.innerHTML = '<p style="text-align: center color: #666 padding: 40px">Nie znaleziono notatek zawierających: "' + searchTerm + '"</p>'
            } else {
                emptyState.style.display = 'block'
            }
            return
        }

        emptyState.style.display = 'none'
        
        const sortedNotes = filteredNotes.sort((a, b) => {
            if (a.isPinned && !b.isPinned) return -1
            if (!a.isPinned && b.isPinned) return 1
            return 0 
        })
        
        sortedNotes.forEach((note) => {
            const originalIndex = notes.indexOf(note)
            const noteElement = document.createElement('div')
            noteElement.classList.add('note')
            noteElement.style.backgroundColor = note.color
            if (isColorTooDark(note.color)) {
                noteElement.style.color = 'white'
            }
            noteElement.innerHTML = `
                <h2>${note.title}</h2>
                <p>${note.content}</p>
                <span>${new Date(note.createdDate).toLocaleString()}</span>
                <span>${note.tags}</span>
                <div class="note-actions">    
                    <button class="btn btn-edit" onclick="editNote(${originalIndex})">✏️ Edytuj</button>
                    <button class="btn btn-delete" onclick="deleteNote(${originalIndex})">🗑️ Usuń</button>
                    <button class="btn btn-pin" onclick="togglePin(${originalIndex})">
                        ${note.isPinned ? '📌 Odepnij' : '📍 Przypnij'}
                    </button>
                </div>
            `
            
            notesList.appendChild(noteElement)
        })
    }

    addNoteBtn.addEventListener('click', (event) => {
        event.preventDefault()
        const title = document.getElementById('noteTitle').value
        const content = document.getElementById('noteContent').value
        const color = document.getElementById('noteColor').value
        const isPinned = document.getElementById('noteChecked').checked

        if (!title || !content) {
            alert('Proszę wypełnić wszystkie pola!')
            return
        }

        const NoteTemplate = {
            title,
            content,
            color,
            isPinned,
            createdDate: new Date().toISOString(),
            tags: noteTags.value.trim()
        }
        const notes = getNotesFromStorage()
        notes.push(NoteTemplate)
        saveNotesToStorage(notes)

        document.getElementById('noteTitle').value = ''
        document.getElementById('noteContent').value = ''
        document.getElementById('NoteTags').value = ''
    })

    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.trim()
        renderNotes(searchTerm)
    })

    window.editNote = function(index) {
        const notes = getNotesFromStorage()
        const note = notes[index]
        
        const newTitle = prompt('Edytuj tytuł:', note.title)
        if (newTitle === null) return
        
        const newContent = prompt('Edytuj treść:', note.content)
        if (newContent === null) return
        const newTags = prompt('Edytuj tagi:', note.tags)
        if (newTags === null) return
        
        if (newTitle.trim() && newContent.trim()) {
            notes[index].title = newTitle.trim()
            notes[index].content = newContent.trim()
            notes[index].tags = newTags.trim()
            saveNotesToStorage(notes)
        }
    }

    window.deleteNote = function(index) {
        if (confirm('Czy na pewno chcesz usunąć tę notatkę?')) {
            const notes = getNotesFromStorage()
            notes.splice(index, 1)
            saveNotesToStorage(notes)
        }
    }
    window.togglePin = function(index) {
        const notes = getNotesFromStorage()
        notes[index].isPinned = !notes[index].isPinned
        saveNotesToStorage(notes)
    }
    renderNotes()
    
})
function isColorTooDark(hexColor) {
    
    const r = parseInt(hexColor.slice(1, 3), 16)
    const g = parseInt(hexColor.slice(3, 5), 16)
    const b = parseInt(hexColor.slice(5, 7), 16)
  
    // Calculate luminance (perceived brightness)
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  
    const darknessThreshold = 0.5
  
    return luminance < darknessThreshold
  }

