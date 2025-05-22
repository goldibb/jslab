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

document.addEventListener('keypress',(ev)=>{
    const key = ev.key
    switch(key) {
        case 'a':
            sounds[key].currentTime = 0
            sounds[key].play()
            recordSound(key)
            break;
        case 's':
            sounds[key].currentTime = 0
            sounds[key].play()
            recordSound(key)
            break;
        case 'd':
            sounds[key].currentTime = 0
            sounds[key].play()
            recordSound(key)
            break;
        case 'f':
            sounds[key].currentTime = 0
            sounds[key].play()
            recordSound(key)
            break;
        case 'g':
            sounds[key].currentTime = 0
            sounds[key].play()
            recordSound(key)
            break;
        case 'h':
            sounds[key].currentTime = 0
            sounds[key].play()
            recordSound(key)
            break;
        case 'j':
            sounds[key].currentTime = 0
            sounds[key].play()
            recordSound(key)
            break;
        case 'k':
            sounds[key].currentTime = 0
            sounds[key].play()
            recordSound(key)
            break;
        case 'l':
            sounds[key].currentTime = 0
            sounds[key].play()
            recordSound(key)
            break;
    }

    function recordSound(key) {
        const time = Date.now() - startTime;
        isRecording.forEach((recording, index) => {
            if (recording) {
                channels[index].push({ key, time })
            }
        })
    }

    function playSound(sound) {
        sound.currentTime = 0;
        sound.play();
    }

    function startRecording(channel) {
        channels[channel] = []
        isRecording[channel] = true
        startTime = Date.now()
    }
    
    function stopRecording(channel) {
        isRecording[channel] = false
    }

    function playChannel(channel) {
        channels[channel].forEach((note) => {
            setTimeout(() => {
                playSound(sounds[note.key])
            }, note.time)
        })
    }
    
    function playAllChannels() {
        channels.forEach((channel) => {
            channel.forEach((note) => {
                setTimeout(() => playSound(sounds[note.key]), note.time)
            })
        })
    }

    document.querySelector('#record1').addEventListener('click', () => startRecording(0))
    document.querySelector('#stop1').addEventListener('click', () =>  stopRecording(0))
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
    document.querySelector('#playAll').addEventListener('click', () => playAllChannels())
})