// daty
const terazTimestamp = Date.now()
const teraz = new Date(terazTimestamp)
console.log(teraz.toLocaleString())

// localStorage
// zapisywanie
// localStorage.setItem(key, value)
// pobieranie
// localStorage.getItem(key)'

const notes = [
    {
        title: 'note 1',
        content: 'content',
        color: dadada,
        isPinned: false,
        createdDate: new Date(),
    },

];

const jsonNotes = JSON.stringify(notes);
