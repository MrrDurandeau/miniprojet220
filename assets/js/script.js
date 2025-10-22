document.addEventListener("DOMContentLoaded", () => {
    const slides = document.querySelectorAll('.slide');
    var index = 0;

    document.querySelector('.next').addEventListener('click', function(){
        slides[index].classList.remove('active');
        index++;
        if (index >= slides.length) {
            index = 0;
        }
        slides[index].classList.add('active')
    })

     document.querySelector('.prev').addEventListener('click', function(){
        slides[index].classList.remove('active');
        index--;
        if (index == -1) {
            index = 0;
        }
        slides[index].classList.add('active')
    })
})
