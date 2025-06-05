setTimeout(
    () => {
        console.log('Ouc!')
        const box = document.querySelector('#slider-inner')
        box.style.transform = 'translate(200px,0px)'
        setTimeout()
    }, 2_000)

let positionX = 0
const anim = setInterval(
    () => {
        const box = document.querySelector('#slider-inner')
        box.style.transform = `translate(${positionX}px,0px)`
        positionX++
    }, 16)

setTimeout(() => {
    clearInterval(anim)
}, 6_000)

// dla stricte animacji zamiast setInterval stosujemy requestAnimationFrame
requestAnimationFrame(
    () => {
        const box = document.querySelector('#slider-inner')
        box.style.transform = `translate(${positionX}px,0px)`
        positionX++
        requestAnimationFrame(anim)
    })