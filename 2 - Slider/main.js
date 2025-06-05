let slideIndex = 1
let autoSlideTimer = null
let isAutoPlaying = true
let isTransitioning = false

showSlides(slideIndex)
startAutoSlide()

function plusSlides(n) {
  if (isTransitioning) return // Zapobiegaj nakładaniu się animacji
  
  stopAutoSlide()
  showSlides(slideIndex += n, n > 0 ? 'next' : 'prev')
  setTimeout(startAutoSlide, 3000)
}

function currentSlide(n) {
  if (isTransitioning) return
  
  stopAutoSlide()
  const direction = n > slideIndex ? 'next' : 'prev'
  showSlides(slideIndex = n, direction)
  setTimeout(startAutoSlide, 3000)
}

function showSlides(n, direction = 'next') {
  isTransitioning = true
  
  let i
  let slides = document.getElementsByClassName("slide")
  let dots = document.getElementsByClassName("dot")
  
  if (n > slides.length) {slideIndex = 1}
  if (n < 1) {slideIndex = slides.length}
  
  // Usuń wszystkie klasy aktywne
  for (i = 0; i < slides.length; i++) {
    slides[i].classList.remove('active', 'prev', 'slide-in-left', 'slide-in-right', 'fade-in')
  }
  for (i = 0; i < dots.length; i++) {
    dots[i].classList.remove('active-dot')
  }
  
  // Dodaj klasy animacji w zależności od kierunku
  const currentSlide = slides[slideIndex-1]
  
  // Płynne przejście z kierunkiem
  if (direction === 'next') {
    currentSlide.classList.add('active', 'slide-in-right')
  } else {
    currentSlide.classList.add('active', 'slide-in-left')
  }
  
  // Dodatkowo fade-in dla lepszego efektu
  currentSlide.classList.add('fade-in')
  
  // Aktywuj odpowiednią kropkę
  dots[slideIndex-1].classList.add('active-dot')
  
  // Pozwól na następną animację po zakończeniu
  setTimeout(() => {
    isTransitioning = false
  }, 800) // Czas trwania animacji CSS
}

function autoSlide() {
  if (isTransitioning) return
  
  slideIndex++
  if (slideIndex > document.getElementsByClassName("slide").length) {
    slideIndex = 1
  }
  showSlides(slideIndex, 'next')
}

function startAutoSlide() {
  stopAutoSlide()
  
  if (isAutoPlaying) {
    autoSlideTimer = setInterval(autoSlide, 4000)
  }
}

function stopAutoSlide() {
  if (autoSlideTimer) {
    clearInterval(autoSlideTimer)
    autoSlideTimer = null
  }
}



document.querySelector('.slider').addEventListener('mouseenter', () => {
  stopAutoSlide()
})

document.querySelector('.slider').addEventListener('mouseleave', () => {
  if (isAutoPlaying) {
    startAutoSlide()
  }
})

// Keyboard controls
document.addEventListener('keydown', (e) => {
  switch(e.key) {
    case 'ArrowLeft':
      plusSlides(-1)
      break
    case 'ArrowRight':
      plusSlides(1)
      break
    case ' ':
      e.preventDefault()
      togglePlayPause()
      break
  }
})