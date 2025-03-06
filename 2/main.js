let position = 0;
const img = document.querySelector('#slider-inner');
function animateSlider(){
    img.style.transform = `translateX(${position}px)`;
    position += 1;
    if(position > 1400){
        position = 0;
    }
    requestAnimationFrame(animateSlider);
}
animateSlider(); 