const canvas = document.getElementById('draw')
const numDistance = document.querySelector(".numDistance")
const noOfCircles = document.querySelector(".noOfCircles")
const FPSInfo = document.querySelector(".FPSInfo")
const ctx = canvas.getContext("2d")

let myReqAnimation
let mousePosition = {x:null, y:null}
let attractionStrengh = 0.3
let fps
let numCircles = 50 
canvas.width = window.innerWidth
canvas.height = window.innerHeight

let maxBallDistance = window.innerWidth * 0.2
const circles = []
const times = []



canvas.addEventListener("mousemove", (e) => {
    mousePosition.x = e.clientX
    mousePosition.y = e.clientY
})

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

canvas.addEventListener("mouseleave", () => {
    mousePosition.x = null
    mousePosition.y = null
})




function generateRandomCircles(){
    circles.length = 0; 
    for(let i = 0; i < numCircles; i++){
        const circle = {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 1.5,
            vy: (Math.random() - 0.5) * 1.5,
            radius: Math.random() * 10 + 10,
            color: `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`
        }
        circles.push(circle)
    }
}

function drawLinesBetweenCircles(c1, c2){
    const dx = c1.x - c2.x
    const dy = c1.y - c2.y

    const distance = Math.sqrt(dx * dx + dy * dy)

    if(distance < maxBallDistance){
        ctx.beginPath()
        ctx.strokeStyle = c1.color
        ctx.lineWidth = 2
        ctx.moveTo(c1.x, c1.y)
        ctx.lineTo(c2.x, c2.y)
        ctx.stroke()
    }
}

function CircleAnimation(){
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    for(let i =0; i < numCircles; i++){
        const circle = circles[i]

        circle.x += circle.vx
        circle.y += circle.vy

        if(circle.x <= 0 || circle.x >= canvas.width){
            circle.vx = -circle.vx
        }

        if(circle.y <= 0 || circle.y >= canvas.height){
            circle.vy = -circle.vy
        }

        if(mousePosition.x !== null && mousePosition.y !== null){
            const dx = mousePosition.x - circle.x
            const dy = mousePosition.y - circle.y
            const distance = Math.sqrt(dx * dx + dy * dy)
            if(distance < 120 && distance > 0){
                const force = attractionStrengh * (distance/120)
                const fx = force * (dx / distance)
                const fy = force * (dy / distance)

                circle.vx += fx
                circle.vy += fy
            }
        }

        ctx.beginPath()
        ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2)
        ctx.fillStyle = circle.color
        ctx.strokeStyle = "black"
        ctx.lineWidth = 2
        ctx.fill()
        ctx.stroke()

        for(let j = i + 1; j < numCircles; j++){
            drawLinesBetweenCircles(circle, circles[j])
        }
    }

    myReqAnimation = requestAnimationFrame(CircleAnimation)
}
document.querySelector(".startButton").addEventListener("click", () => {
    if (myReqAnimation) {
        cancelAnimationFrame(myReqAnimation);
        myReqAnimation = null;
    } else {
        CircleAnimation();
    }
})

document.querySelector(".resetButton").addEventListener("click", () => {
    if (myReqAnimation) {
        cancelAnimationFrame(myReqAnimation);
        myReqAnimation = null;
    }
    circles.length = 0;
    generateRandomCircles();
    ctx.clearRect(0, 0, canvas.width, canvas.height)
})


generateRandomCircles()


numDistance.addEventListener("input", () => {
    maxBallDistance = numDistance.value
})

noOfCircles.addEventListener("input", () => {
    numCircles = noOfCircles.value
    generateRandomCircles()

    if (myReqAnimation){
        cancelAnimationFrame(myReqAnimation)
        myReqAnimation = null
    }
})

function refreshLoop() {
  window.requestAnimationFrame(() => {
    const now = performance.now()
    while (times.length > 0 && times[0] <= now - 1000) {
      times.shift()
    }
    times.push(now)
    fps = times.length
    FPSInfo.innerHTML = `FPS: ${fps}`
    refreshLoop()
  })
}
refreshLoop()