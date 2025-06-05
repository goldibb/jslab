const state = document.querySelector('.state')
const scoreCounter = document.querySelector('.score')
let score = 0 

let gameTime = 60 
let gameTimer = null
let gameActive = false


const timerElement = document.createElement('div')
timerElement.style.fontSize = '24px'
timerElement.style.fontWeight = 'bold'
timerElement.style.color = 'blue'
timerElement.style.marginBottom = '10px'
timerElement.innerHTML = `Czas: ${gameTime}s`
document.body.insertBefore(timerElement, document.querySelector('.game-container'))

let x = Math.round(0)
let y = Math.round(0)

const gameContainer = document.querySelector('.game-container')

const ball = document.createElement('div')
const b = {
    x:130, 
    y:230, 
    w:40, 
    h:40, 
    dx:1, 
    dy:1, 
    speed: 0.0, 
    ani: {}, 
    move: false 
}
ball.style.background = 'red'
ball.style.borderRadius = '50%'
ball.style.width = `${b.w}px`
ball.style.height = `${b.h}px`
ball.style.position = 'absolute'
ball.style.left = `${b.x}px`
ball.style.top = `${b.y}px`

const hole = document.createElement('div')
const h = {
    x : 0, 
    y: 0, 
    w: 40, 
    h: 40, 
    dx: 1, 
    dy: 1, 
    speed: 1, 
    ani: {}, 
    move: false 
}
hole.style.background = 'black'
hole.style.borderRadius = '50%'
hole.style.width = `${h.w}px`
hole.style.height = `${h.h}px`
hole.style.position = 'absolute'
hole.style.left = `${h.x}px`
hole.style.top = `${h.y}px`

gameContainer.appendChild(ball)
gameContainer.appendChild(hole)


function holeMovement(){
    if(h.x > 300 - h.w || h.x < 0){
        h.dx *= -1
    }

    if(h.y > 500 - h.h || h.y < 0){
        h.dy *= -1
    }

    h.x += h.dx
    h.y += h.dy

    hole.style.left = `${h.x}px`
    hole.style.top = `${h.y}px`
    if(h.move){
        h.ani = requestAnimationFrame(holeMovement)
    }
    
}

function updateTimer() {
    gameTime--
    timerElement.innerHTML = `Czas: ${gameTime}s`
    
    if (gameTime <= 0) {
        
        endGame()
    }
}

function endGame() {
    gameActive = false
    clearInterval(gameTimer)
    cancelAnimationFrame(b.ani)
    cancelAnimationFrame(h.ani)
    h.move = false
    b.move = false
    
    document.querySelector('.start-button').innerHTML = 'Start'
    alert(`Koniec gry! Twój wynik: ${score} punktów`)
}

function resetBallPosition() {
    b.x = 130
    b.y = 230
    b.dx = 1
    b.dy = 1
    ball.style.left = `${b.x}px`
    ball.style.top = `${b.y}px`
}

function ballMovement(){

    if(Math.abs(x) < 0.5) b.dx = 0
    else if(x > 0) b.dx = 1
    else b.dx = -1

    if(Math.abs(y) < 0.5) b.dy = 0
    else if(y > 0) b.dy = 1
    else b.dy = -1


    if(b.y + b.dy > 500 - b.h || b.y +  b.dy < 0){
        if(b.y < 0){
            b.y = 0
        }else if(b.y > 500 - b.h){
            b.y = 500 - b.h
        }
        b.dy = 0
    }


    if(b.x + b.dx > 300 - b.w || b.x + b.dx < 0){
        if(b.x < 0){
            b.x = 0
        }else if(b.x > 300 - b.w){
            b.x = 300 - b.w
        }
        b.dx = 0
    }

    b.x += b.dx * b.speed
    b.y += b.dy * b.speed

    ball.style.left = `${b.x}px`
    ball.style.top = `${b.y}px`

    
    if((Math.abs(b.y - h.y) < 8) && (Math.abs(b.x - h.x) < 8)){
        score += 1
        scoreCounter.innerHTML = `Score: ${score}`
        
        
        resetBallPosition()
        
        
        if(gameActive && b.move){
            b.ani = requestAnimationFrame(ballMovement)
        }
        return
    }

    if(b.move && gameActive){
        b.ani = requestAnimationFrame(ballMovement)
    }
}



document.querySelector('.start-button').addEventListener('click', () => {
    if(!gameActive) {
        
        gameTime = 60
        score = 0
        gameActive = true
        
        scoreCounter.innerHTML = `Score: ${score}`
        timerElement.innerHTML = `Czas: ${gameTime}s`
        
        
        h.y = 0
        h.x = 0
        resetBallPosition()

        
        gameTimer = setInterval(updateTimer, 1000)
        
        
        b.ani = requestAnimationFrame(ballMovement)
        h.ani = requestAnimationFrame(holeMovement)

        h.move = true
        b.move = true
        
        document.querySelector('.start-button').innerHTML = 'Stop'
    } else {
        
        endGame()
        document.querySelector('.start-button').innerHTML = 'Start'
    }
})



window.addEventListener('deviceorientation', e => {
    console.log('🎯 Sensor zadziałał!', e)
    
    const beta = e.beta
    const gamma = e.gamma
    
    console.log(`📱 Beta: ${beta}, Gamma: ${gamma}`)

    x = gamma / 5
    y = -beta / 5
    
    console.log(`🎮 X: ${x}, Y: ${y}`)

    b.speed = Math.min((Math.abs(x) + Math.abs(y))/3, 8)
    console.log(`⚡ Speed: ${b.speed}`)
    
    
    state.innerHTML = `Beta: ${beta?.toFixed(1)}, Gamma: ${gamma?.toFixed(1)} | X: ${x.toFixed(1)}, Y: ${y.toFixed(1)} | Speed: ${b.speed.toFixed(2)}`
})