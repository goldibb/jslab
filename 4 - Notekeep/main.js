document.addEventListener('DOMContentLoaded', () => {
    const notesList = document.getElementById('notesList')
    const addNoteBtn = document.getElementById('addNoteBtn')
    const emptyState = document.getElementById('emptyState');
    const searchInput = document.getElementById('searchInput');

    function getNotesFromStorage(){
        return JSON.parse(localStorage.getItem('notes')) || []
    }
    function saveNotesToStorage(notes){
        localStorage.setItem('notes', JSON.stringify(notes))
        renderNotes()
    }

    function renderNotes(searchTerm = '') {
        notesList.innerHTML = "";
        const notes = getNotesFromStorage()
        
        // Filtrowanie notatek na podstawie wyszukiwania
        const filteredNotes = notes.filter(note => {
            if (!searchTerm) return true;
            return note.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                   note.content.toLowerCase().includes(searchTerm.toLowerCase());
        });
        
        if (filteredNotes.length === 0) {
            if (searchTerm) {
                notesList.innerHTML = '<p style="text-align: center; color: #666; padding: 40px;">Nie znaleziono notatek zawierających: "' + searchTerm + '"</p>';
            } else {
                emptyState.style.display = 'block';
            }
            return;
        }

        emptyState.style.display = 'none';

        filteredNotes.forEach((note, index) => {
            const originalIndex = notes.indexOf(note);
            const noteElement = document.createElement('div')
            noteElement.classList.add('note')
            noteElement.style.backgroundColor = note.color
            if (isColorTooDark(note.color)) {
                noteElement.style.color = 'white';
            }
            noteElement.innerHTML = `
                <h2>${note.title}</h2>
                <p>${note.content}</p>
                <span>${new Date(note.createdDate).toLocaleString()}</span>
                <div class="note-actions">
                    <button class="btn btn-edit" onclick="editNote(${originalIndex})">✏️ Edytuj</button>
                    <button class="btn btn-delete" onclick="deleteNote(${originalIndex})">🗑️ Usuń</button>
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
            alert('Proszę wypełnić wszystkie pola!');
            return;
        }

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

        document.getElementById('noteTitle').value = '';
        document.getElementById('noteContent').value = '';
    })

    // Wyszukiwanie notatek
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.trim();
        renderNotes(searchTerm);
    })

    window.editNote = function(index) {
        const notes = getNotesFromStorage();
        const note = notes[index];
        
        const newTitle = prompt('Edytuj tytuł:', note.title);
        if (newTitle === null) return;
        
        const newContent = prompt('Edytuj treść:', note.content);
        if (newContent === null) return;
        
        if (newTitle.trim() && newContent.trim()) {
            notes[index].title = newTitle.trim();
            notes[index].content = newContent.trim();
            saveNotesToStorage(notes);
        }
    };

    window.deleteNote = function(index) {
        if (confirm('Czy na pewno chcesz usunąć tę notatkę?')) {
            const notes = getNotesFromStorage();
            notes.splice(index, 1);
            saveNotesToStorage(notes);
        }
    };
    renderNotes()
    
})
function isColorTooDark(hexColor) {
    // Convert hex to RGB
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);
  
    // Calculate luminance (perceived brightness)
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
    // Adjust the threshold as needed (0.5 is a good starting point)
    const darknessThreshold = 0.5;
  
    // Return true if the color is too dark
    return luminance < darknessThreshold;
  }

