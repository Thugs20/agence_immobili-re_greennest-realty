document.addEventListener("DOMContentLoaded", () => {

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
  const myProperties = [];
  let id = 1;

  Object.keys(propertyTypes).forEach(type => {
    for(let i=0;i<11;i++){
      const city = cities[Math.floor(Math.random()*cities.length)];
      const titles = propertyTypes[type];
      const title = titles[Math.floor(Math.random()*titles.length)];
      const status = Math.random() > 0.5 ? "acheter":"louer";
      let price;
      if(status==="louer"){ price = Math.floor(Math.random()*900+100); }
      else {
        if(type==="terrain"){ price = Math.floor(Math.random()*70000+10000);}
        else if(type==="villa"){ price = Math.floor(Math.random()*800000+200000);}
        else{ price = Math.floor(Math.random()*300000+50000);}
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

  // --- Favoris ---
  let favorites = JSON.parse(localStorage.getItem('favs')) || [];
  function toggleFavorite(id){
    if(favorites.includes(id)){
      favorites = favorites.filter(favId=>favId!==id);
    }else{ favorites.push(id);}
    localStorage.setItem('favs',JSON.stringify(favorites));
    filterNow();
  }

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

  // --- Filtrage ---
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

  // --- Écouteurs barre recherche ---
  document.getElementById('searchInput')?.addEventListener('input',filterNow);
  document.getElementById('typeFilter')?.addEventListener('change',filterNow);
  document.getElementById('statusFilter')?.addEventListener('change',filterNow);
  document.getElementById('minPrice')?.addEventListener('input',filterNow);
  document.getElementById('maxPrice')?.addEventListener('input',filterNow);

  // --- Initialisation Propriétés ---
  applyUrlFilters();
  filterNow();

  // --- Page détails ---
  function initDetailsPage(){
    const wrapper = document.getElementById('detailsWrapper');
    if(!wrapper) return;
    const params = new URLSearchParams(window.location.search);
    const propId = parseInt(params.get('id'));
    const property = myProperties.find(p=>p.id===propId);
    if(property){
      const isFav = favorites.includes(property.id);
      wrapper.innerHTML=`
        <div class="property-header">
          <div><h1>${property.title}</h1><p><i class="fas fa-map-marker-alt"></i> ${property.city}</p></div>
          <div style="text-align:right"><h2 class="card-price" style="font-size:2rem">${property.price.toLocaleString()} €</h2>
          <span class="badge ${property.status==='acheter'?'badge-buy':'badge-rent'}">${property.status}</span></div>
        </div>
        <div class="gallery-container"><img src="${property.image}" alt="Photo principale"></div>
        <div class="details-grid-layout">
          <div class="main-info">
            <div class="info-card">
              <h3>Description</h3>
              <p style="margin-top:15px; line-height:1.8; color:#555;">
                Bienvenue dans cette magnifique propriété de type ${property.type}. Située à ${property.city}, elle offre une surface de ${property.surface}m² optimisée pour le confort et l'efficacité énergétique.
              </p>
              <div class="features-list">
                <div class="feature-box"><i class="fas fa-bed"></i>${property.rooms} Chambres</div>
                <div class="feature-box"><i class="fas fa-bath"></i> 2 Sdb</div>
                <div class="feature-box"><i class="fas fa-expand-arrows-alt"></i> ${property.surface} m²</div>
                <div class="feature-box"><i class="fas fa-leaf"></i> Éco A+</div>
              </div>
            </div>
          </div>
          <div class="sidebar">
            <div class="sidebar-contact">
              <h3>Cette offre vous intéresse ?</h3>
              <p style="margin:15px 0; opacity:0.8">Nos agents sont disponibles pour une visite virtuelle ou réelle.</p>
              <button class="btn-action-detail btn-visit-main" onclick="alert('Demande envoyée ! Notre agent vous rappellera.')">Demander une visite</button>
              <button class="btn-action-detail btn-fav-detail" onclick="toggleFavorite(${property.id})">
                <i class="${isFav?'fas':'far'} fa-heart"></i> ${isFav?'Dans vos favoris':'Ajouter aux favoris'}
              </button>
            </div>
          </div>
        </div>
      `;
    } else { wrapper.innerHTML="<h1>Oups ! Propriété introuvable.</h1>"; }
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

  // Page Contact //
  // Gestion du formulaire de contact
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert("Merci ! Votre message a bien été envoyé. Notre équipe vous recontactera sous 24h.");
        contactForm.reset();
    });
}



 // animation faqs avant footer page index
  const faqItems = document.querySelectorAll('.faq-item');
faqItems.forEach(item => {
  item.addEventListener('click', () => {
    item.classList.toggle('active');
  });
});



});

