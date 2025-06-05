const sounds = {
    'a': document.querySelector('#s1'),
    's': document.querySelector('#s2'),
    'd': document.querySelector('#s3'),
    'f': document.querySelector('#s4'),
    'g': document.querySelector('#s5'),
    'h': document.querySelector('#s6'),
    'j': document.querySelector('#s7'),
    'k': document.querySelector('#s8'),
    'l': document.querySelector('#s9'),
}

const channels = [[],[],[],[]]
let isRecording = [false,false,false,false]
let startTime = 0

const drumPads = document.querySelectorAll('.drum-pad')

function activatePad(key) {
    const pad = document.querySelector(`[data-key="${key}"]`)
    if (pad) {
        pad.classList.add('active')
        setTimeout(() => {
            pad.classList.remove('active')
        }, 150)
    }
}

function playSound(key) {
    const audio = sounds[key]
    if (audio) {
        audio.currentTime = 0
        audio.play()
        activatePad(key)
        recordSound(key)
    }
}
function recordSound(key) {
    const time = Date.now() - startTime
    isRecording.forEach((recording, index) => {
        if (recording) {
            channels[index].push({ key, time })
        }
    })
}
function updateRecordingIndicator(channel, isRec) {
    const indicator = document.querySelector(`#indicator${channel + 1}`)
    const recordBtn = document.querySelector(`#record${channel + 1}`)
    
    if (isRec) {
        indicator.classList.add('recording')
        recordBtn.classList.add('recording')
        recordBtn.querySelector('.btn-text').textContent = 'Nagrywanie...'
    } else {
        indicator.classList.remove('recording')
        recordBtn.classList.remove('recording')
        recordBtn.querySelector('.btn-text').textContent = 'Nagrywaj'
    }
}
function startRecording(channel) {
    isRecording.forEach((_, index) => {
        if (isRecording[index]) {
            stopRecording(index)
        }
    })
    
    channels[channel] = []
    isRecording[channel] = true
    startTime = Date.now()
    updateRecordingIndicator(channel, true)
    
    console.log(`Rozpoczęto nagrywanie kanału ${channel + 1}`)
}
function stopRecording(channel) {
    isRecording[channel] = false
    updateRecordingIndicator(channel, false)
    
    console.log(`Zatrzymano nagrywanie kanału ${channel + 1} - zapisano ${channels[channel].length} dźwięków`)
}
function playChannel(channel) {
    if (channels[channel].length === 0) {
        console.log(`Kanał ${channel + 1} jest pusty`)
        return
    }
    
    console.log(`Odtwarzanie kanału ${channel + 1}`)
    channels[channel].forEach((note) => {
        setTimeout(() => {
            playSound(note.key)
        }, note.time)
    })
}
function playAllChannels() {
    console.log('Odtwarzanie wszystkich kanałów')
    channels.forEach((channel) => {
        channel.forEach((note) => {
            setTimeout(() => playSound(note.key), note.time)
        })
    })
}
function clearAllChannels() {
    channels.forEach((_, index) => {
        channels[index] = []
        stopRecording(index)
    })
    console.log('Wyczyszczono wszystkie kanały')
}
document.addEventListener('keydown', (event) => {
    const key = event.key.toLowerCase()
    
    if (sounds[key]) {
        event.preventDefault()
        playSound(key)
    }
})
document.addEventListener('keyup', (event) => {
    const key = event.key.toLowerCase()
    if (sounds[key]) {
        event.preventDefault()
    }
})
drumPads.forEach(pad => {
    pad.addEventListener('click', () => {
        const key = pad.dataset.key
        playSound(key)
    })

    pad.addEventListener('mousedown', () => {
        pad.classList.add('active')
    })
    
    pad.addEventListener('mouseup', () => {
        setTimeout(() => {
            pad.classList.remove('active')
        }, 100)
    })
    
    pad.addEventListener('mouseleave', () => {
        pad.classList.remove('active')
    })
})

document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('#record1').addEventListener('click', () => startRecording(0))
    document.querySelector('#stop1').addEventListener('click', () => stopRecording(0))
    document.querySelector('#play1').addEventListener('click', () => playChannel(0))

    
    document.querySelector('#record2').addEventListener('click', () => startRecording(1))
    document.querySelector('#stop2').addEventListener('click', () => stopRecording(1))
    document.querySelector('#play2').addEventListener('click', () => playChannel(1))

    
    document.querySelector('#record3').addEventListener('click', () => startRecording(2))
    document.querySelector('#stop3').addEventListener('click', () => stopRecording(2))
    document.querySelector('#play3').addEventListener('click', () => playChannel(2))

    
    document.querySelector('#record4').addEventListener('click', () => startRecording(3))
    document.querySelector('#stop4').addEventListener('click', () => stopRecording(3))
    document.querySelector('#play4').addEventListener('click', () => playChannel(3))

    
    document.querySelector('#playAll').addEventListener('click', playAllChannels)
    document.querySelector('#clearAll').addEventListener('click', clearAllChannels)
})

