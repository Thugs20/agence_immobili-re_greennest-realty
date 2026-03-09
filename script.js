document.addEventListener("DOMContentLoaded", () => {

  // =========================
  // TON CODE EXISTANT
  // =========================

  // --- Page Property & Génération ---
  const cities = ["Cotonou","Abidjan","Dakar","Lomé","Accra","Lagos","Ouagadougou","Casablanca","Rabat","Douala"];
  const propertyTypes = {
    villa:["Villa Moderne","Villa Luxe","Villa avec Piscine","Villa Jardin"],
    maison:["Maison Familiale","Maison Moderne","Maison de Ville"],
    appartement:["Appartement Moderne","Appartement Vue Ville","Appartement Terrasse"],
    studio:["Studio Étudiant","Studio Urbain","Studio Moderne"],
    duplex:["Duplex Élégant","Duplex Terrasse","Duplex Moderne"],
    loft:["Loft Industriel","Loft Design","Loft Artistique"],
    terrain:["Terrain Constructible","Terrain Résidentiel","Terrain Commercial"],
    bureau:["Bureau Professionnel","Espace de Coworking","Bureau Moderne"],
    boutique:["Boutique Commerciale","Local Commercial","Magasin Centre Ville"]
  };
  let myProperties = JSON.parse(localStorage.getItem("properties"));

if(!myProperties){

  const cities = ["Cotonou","Abidjan","Dakar","Lomé","Accra","Lagos","Ouagadougou","Casablanca","Rabat","Douala"];

  const propertyTypes = {
    villa:["Villa Moderne","Villa Luxe","Villa avec Piscine","Villa Jardin"],
    maison:["Maison Familiale","Maison Moderne","Maison de Ville"],
    appartement:["Appartement Moderne","Appartement Vue Ville","Appartement Terrasse"],
    studio:["Studio Étudiant","Studio Urbain","Studio Moderne"],
    duplex:["Duplex Élégant","Duplex Terrasse","Duplex Moderne"],
    loft:["Loft Industriel","Loft Design","Loft Artistique"],
    terrain:["Terrain Constructible","Terrain Résidentiel","Terrain Commercial"],
    bureau:["Bureau Professionnel","Espace de Coworking","Bureau Moderne"],
    boutique:["Boutique Commerciale","Local Commercial","Magasin Centre Ville"]
  };

  myProperties = [];
  let id = 1;

  Object.keys(propertyTypes).forEach(type => {

    for(let i=0;i<11;i++){

      const city = cities[Math.floor(Math.random()*cities.length)];
      const titles = propertyTypes[type];
      const title = titles[Math.floor(Math.random()*titles.length)];

      const status = Math.random() > 0.5 ? "acheter" : "louer";

      let price;

      if(status==="louer"){
        price = Math.floor(Math.random()*900+100);
      } else {

        if(type==="terrain"){
          price = Math.floor(Math.random()*70000+10000);
        }
        else if(type==="villa"){
          price = Math.floor(Math.random()*800000+200000);
        }
        else{
          price = Math.floor(Math.random()*300000+50000);
        }

      }

      myProperties.push({
        id:id++,
        title:title,
        city:city,
        price:price,
        type:type,
        status:status,
        image:`images/appartement${(id%29)+1}.webp`,
        rooms: Math.floor(Math.random()*5)+1,
        surface: Math.floor(Math.random()*220)+30
      });

    }

  });

  localStorage.setItem("properties", JSON.stringify(myProperties));

}

  // --- Favoris ---
  let favorites = JSON.parse(localStorage.getItem('favs')) || [];
  function toggleFavorite(id){
    if(favorites.includes(id)){
      favorites = favorites.filter(favId=>favId!==id);
    }else{ favorites.push(id);}
    localStorage.setItem('favs',JSON.stringify(favorites));
    filterNow();
  }

  window.toggleFavorite = toggleFavorite;

  // --- Affichage Propriétés ---
  const grid = document.getElementById('propertiesGrid');
  function renderProperties(data){
    if(!grid) return;
    grid.style.opacity = 0;
    setTimeout(()=>{
      grid.innerHTML = '';
      data.forEach(item=>{
        const isFav = favorites.includes(item.id);
        grid.innerHTML += `
          <div class="property-card">
            <div class="card-image-container">
              <img src="${item.image}" alt="${item.title}" loading="lazy">
              <button class="favorite-heart ${isFav?'active':''}" onclick="toggleFavorite(${item.id})">
                <i class="${isFav?'fas':'far'} fa-heart"></i>
              </button>
            </div>
            <div class="card-info">
              <p class="card-price">${item.price.toLocaleString()} €${item.status==='louer'?'/mois':''}</p>
              <h3>${item.title}</h3>
              <p><i class="fas fa-map-marker-alt"></i> ${item.city}</p>
              <button onclick="window.location.href='property-details.html?id=${item.id}'" class="btn-view" style="width:100%; margin-top:15px; border:none; padding:10px; border-radius:5px; cursor:pointer; background:var(--beige); color:var(--dark-green); font-weight:bold;">
                Voir Détails
              </button>
            </div>
          </div>
        `;
      });
      grid.style.opacity = 1;
    },150);
  }

  // --- URL Filters ---
  function applyUrlFilters(){
    const hash = window.location.hash.replace('#','');
    const params = new URLSearchParams(window.location.search);

    if(hash==="buy"){ document.getElementById("statusFilter").value="acheter"; }
    if(hash==="louer"){ document.getElementById("statusFilter").value="louer"; }

    const status = params.get("status");
    const type = params.get("type");
    const city = params.get("city");
    const minPrice = params.get("minPrice");
    const maxPrice = params.get("maxPrice");

    if(status && document.getElementById("statusFilter")) document.getElementById("statusFilter").value=status;
    if(type && document.getElementById("typeFilter")) document.getElementById("typeFilter").value=type;
    if(city && document.getElementById("searchInput")) document.getElementById("searchInput").value=city;
    if(minPrice && document.getElementById("minPrice")) document.getElementById("minPrice").value=minPrice;
    if(maxPrice && document.getElementById("maxPrice")) document.getElementById("maxPrice").value=maxPrice;
  }

  function filterNow(){
    const searchTerm = document.getElementById('searchInput')?.value.toLowerCase() || '';
    const typeTerm = document.getElementById('typeFilter')?.value || 'all';
    const statusTerm = document.getElementById('statusFilter')?.value || 'all';
    const minPrice = document.getElementById('minPrice')?.value || '';
    const maxPrice = document.getElementById('maxPrice')?.value || '';

    const filtered = myProperties.filter(p=>{
      const matchesSearch = p.title.toLowerCase().includes(searchTerm) || p.city.toLowerCase().includes(searchTerm);
      const matchesType = typeTerm==='all'||p.type===typeTerm;
      const matchesStatus = statusTerm==='all'||p.status===statusTerm;
      const matchesMin = !minPrice || p.price>=minPrice;
      const matchesMax = !maxPrice || p.price<=maxPrice;
      return matchesSearch && matchesType && matchesStatus && matchesMin && matchesMax;
    });

    renderProperties(filtered);
  }

  document.getElementById('searchInput')?.addEventListener('input',filterNow);
  document.getElementById('typeFilter')?.addEventListener('change',filterNow);
  document.getElementById('statusFilter')?.addEventListener('change',filterNow);
  document.getElementById('minPrice')?.addEventListener('input',filterNow);
  document.getElementById('maxPrice')?.addEventListener('input',filterNow);

  applyUrlFilters();
  filterNow();

  // --- Page détails ---
  function initDetailsPage(){

  const wrapper = document.getElementById("detailsWrapper");

  if(!wrapper) return;

  const params = new URLSearchParams(window.location.search);
  const propId = parseInt(params.get("id"));

  const property = myProperties.find(p => p.id === propId);

  if(!property){
    wrapper.innerHTML="<h2>Propriété introuvable</h2>";
    return;
  }

  const isFav = favorites.includes(property.id);

  wrapper.innerHTML = `
<div class="details-container">

  <!-- IMAGE PRINCIPALE AVEC BADGE -->
  <div class="main-image-container">
    <img src="${property.image}" alt="${property.title}" class="main-image" id="mainImage">
    <span class="badge-status">${property.status === "louer" ? "À Louer" : "À Vendre"}</span>
  </div>

  <!-- INFO EN DESSOUS -->
  <div class="info-card">
    <h1>${property.title}</h1>
    <p class="details-price">
      ${property.price.toLocaleString()} €
      ${property.status === "louer" ? "/mois" : ""}
    </p>
    <p><i class="fas fa-map-marker-alt"></i> ${property.city}</p>

    <div class="features-list">
      <div class="feature-box"><i class="fas fa-bed"></i><span>${property.rooms} Pièces</span></div>
      <div class="feature-box"><i class="fas fa-ruler-combined"></i><span>${property.surface} m²</span></div>
      <div class="feature-box"><i class="fas fa-home"></i><span>${property.type}</span></div>
      <div class="feature-box"><i class="fas fa-dollar-sign"></i><span>${property.status}</span></div>
    </div>

    <div class="btn-group">
      <button id="btnFav" class="btn-fav-detail ${isFav ? "active" : ""}">
        <i class="fas fa-heart"></i> Favoris
      </button>
      <button class="btn-action-detail btn-visit-main">
        Contacter l'agent
      </button>
    </div>
  </div>

</div>
`;
// Favoris pop
const btnFav = document.getElementById("btnFav");
btnFav?.addEventListener("click", () => {
    if(favorites.includes(property.id)){
        favorites = favorites.filter(id => id !== property.id);
        btnFav.classList.remove("active");
    } else {
        favorites.push(property.id);
        btnFav.classList.add("active");
        btnFav.animate([
            { transform: 'scale(1)' },
            { transform: 'scale(1.3)' },
            { transform: 'scale(1.1)' }
        ], { duration: 300 });
    }
    localStorage.setItem("favs", JSON.stringify(favorites));
});

}

  if(window.location.pathname.includes('property-details.html')){
    initDetailsPage();
  }

  // --- Scroll header ---
  const header = document.querySelector("header");
  if(header){
    window.addEventListener("scroll",()=>{
      if(window.scrollY>50) header.classList.add("scrolled");
      else header.classList.remove("scrolled");
    });
  }

  // --- Counters ---
  const counters = document.querySelectorAll(".counter");
  if(counters.length){
    const startCounter = (counter)=>{
      const target = +counter.getAttribute("data-target");
      let count = 0;
      const increment = target/200;
      const update = ()=>{
        count+=increment;
        if(count<target){ counter.innerText=Math.ceil(count); requestAnimationFrame(update);}
        else{ counter.innerText=target+"+"; }
      };
      update();
    };
    const observer = new IntersectionObserver(entries=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){
          startCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    });
    counters.forEach(c=>observer.observe(c));
  }

  // --- Menu Hamburger ---
  const hamburger = document.getElementById("hamburger");
  const navMenu = document.getElementById("nav-menu");
  const overlay = document.getElementById("overlay");
  if(hamburger && navMenu){
    hamburger.addEventListener("click",(e)=>{
      navMenu.classList.toggle("active");
      hamburger.innerHTML = navMenu.classList.contains("active") ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
      if(overlay) overlay.classList.toggle("active");
      e.stopPropagation();
    });
    document.addEventListener("click",(e)=>{
      if(!navMenu.contains(e.target) && !hamburger.contains(e.target)){
        navMenu.classList.remove("active");
        hamburger.innerHTML = '<i class="fas fa-bars"></i>';
        if(overlay) overlay.classList.remove("active");
      }
    });
    overlay?.addEventListener("click",()=>{
      navMenu.classList.remove("active");
      overlay.classList.remove("active");
      hamburger.innerHTML = '<i class="fas fa-bars"></i>';
    });
  }

  // --- Scroll fluide ---
  document.querySelectorAll("nav a").forEach(link=>{
    link.addEventListener("click",(e)=>{
      const href = link.getAttribute("href");
      if(href.startsWith("#")){
        e.preventDefault();
        const target = document.querySelector(href);
        if(target) target.scrollIntoView({behavior:"smooth"});
        navMenu?.classList.remove("active");
      }
    });
  });

  // --- Page Contact ---
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
      contactForm.addEventListener('submit', (e) => {
          e.preventDefault();
          alert("Merci ! Votre message a bien été envoyé. Notre équipe vous recontactera sous 24h.");
          contactForm.reset();
      });
  }

  // --- Animation FAQ ---
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    item.addEventListener('click', () => {
      item.classList.toggle('active');
    });
  });

  const favBtn = document.querySelector(".btn-fav-detail");
  const propertyId = favBtn?.dataset.id;

  let favoris = JSON.parse(localStorage.getItem("favoris")) || [];
  if (propertyId && favoris.includes(propertyId)) favBtn.classList.add("active");

  favBtn?.addEventListener("click", () => {
      if (propertyId) {
        if (favoris.includes(propertyId)) {
            favoris = favoris.filter(id => id !== propertyId);
            favBtn.classList.remove("active");
        } else {
            favoris.push(propertyId);
            favBtn.classList.add("active");
        }
        localStorage.setItem("favoris", JSON.stringify(favoris));
      }
  });

  

}); // Fin DOMContentLoaded