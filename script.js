window.addEventListener("scroll", function(){

  const header = document.querySelector("header");

  if(window.scrollY > 50){
    header.classList.add("scrolled");
  }else{
    header.classList.remove("scrolled");
  }

});

const counters = document.querySelectorAll(".counter");

const startCounter = (counter) => {

  const target = +counter.getAttribute("data-target");
  let count = 0;

  const increment = target / 200;

  const updateCounter = () => {

    count += increment;

    if(count < target){
      counter.innerText = Math.ceil(count);
      requestAnimationFrame(updateCounter);
    }else{
      counter.innerText = target + "+";
    }

  };

  updateCounter();

};


/* Observer pour déclencher l'animation */

const observer = new IntersectionObserver(entries => {

  entries.forEach(entry => {

    if(entry.isIntersecting){

      startCounter(entry.target);
      observer.unobserve(entry.target);

    }

  });

});

counters.forEach(counter => {
  observer.observe(counter);
});

/* ======================================
   MENU HAMBURGER
====================================== */

const hamburger = document.getElementById("hamburger");
const navMenu = document.getElementById("nav-menu");

hamburger.addEventListener("click", (e) => {

navMenu.classList.toggle("active");

if(navMenu.classList.contains("active")){
hamburger.innerHTML = '<i class="fas fa-times"></i>';
}
else{
hamburger.innerHTML = '<i class="fas fa-bars"></i>';
}

e.stopPropagation();

});

// fermer quand on clique ailleurs

document.addEventListener("click", function(e){

if(!navMenu.contains(e.target) && !hamburger.contains(e.target)){

navMenu.classList.remove("active");
hamburger.innerHTML = '<i class="fas fa-bars"></i>';

}

});
const overlay = document.getElementById("overlay");

hamburger.addEventListener("click", () => {
overlay.classList.toggle("active");
});

overlay.addEventListener("click", () => {
navMenu.classList.remove("active");
overlay.classList.remove("active");
hamburger.innerHTML = '<i class="fas fa-bars"></i>';
});


