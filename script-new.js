/**
 * script-new.js — GreenNest Realty | Logique globale UI
 * Auteur : HOUETO Fabrice | 2026
 * 
 * Modules :
 * 1. Page Loader
 * 2. Curseur personnalisé
 * 3. Header scroll & transparent
 * 4. Menu mobile hamburger
 * 5. Animations au scroll (IntersectionObserver)
 * 6. Compteurs animés
 * 7. Theme toggle (mode sombre / clair)
 * 8. FAQ accordéon
 * 9. Parallaxe hero léger
 * 10. Barre recherche rapide home
 */

/* =====================================================
   1. ATTENDRE LE DOM
===================================================== */
document.addEventListener('DOMContentLoaded', () => {

  /* =====================================================
     2. PAGE LOADER
     Affiche un loader élégant à l'ouverture de la page
  ===================================================== */
  const loader = document.getElementById('pageLoader');
  if (loader) {
    // Masquer le loader après 2 secondes (animation de la barre)
    setTimeout(() => {
      loader.classList.add('hidden');
      // Déclencher les animations hero une fois le loader parti
      triggerHeroReveal();
    }, 2000);
  } else {
    // Si pas de loader, déclencher les animations immédiatement
    triggerHeroReveal();
  }

  /* =====================================================
     3. CURSEUR PERSONNALISÉ (desktop uniquement)
  ===================================================== */
  const cursor = document.getElementById('cursor');
  const follower = document.getElementById('cursorFollower');

  if (cursor && follower) {
    let mouseX = 0, mouseY = 0;
    let followerX = 0, followerY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      // Curseur principal : suit instantanément
      cursor.style.left = mouseX + 'px';
      cursor.style.top = mouseY + 'px';
    });

    // Le follower suit avec du lag (animation fluide)
    function animateFollower() {
      followerX += (mouseX - followerX) * 0.12;
      followerY += (mouseY - followerY) * 0.12;
      follower.style.left = followerX + 'px';
      follower.style.top = followerY + 'px';
      requestAnimationFrame(animateFollower);
    }
    animateFollower();

    // Agrandir le follower sur les éléments interactifs
    const interactives = document.querySelectorAll('a, button, input, select, .feat-card, .service-card');
    interactives.forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.style.transform = 'translate(-50%, -50%) scale(2.5)';
        follower.style.transform = 'translate(-50%, -50%) scale(1.5)';
        follower.style.opacity = '0.2';
      });
      el.addEventListener('mouseleave', () => {
        cursor.style.transform = 'translate(-50%, -50%) scale(1)';
        follower.style.transform = 'translate(-50%, -50%) scale(1)';
        follower.style.opacity = '0.5';
      });
    });
  }

  /* =====================================================
     4. HEADER : TRANSPARENT → OPAQUE AU SCROLL
  ===================================================== */
  const header = document.getElementById('mainHeader');
  if (header) {
    // Sur la page d'accueil, le header commence transparent
    const isHome = window.location.pathname.includes('index.html') || window.location.pathname === '/' || window.location.pathname.endsWith('/');

    function updateHeader() {
      if (isHome) {
        if (window.scrollY > 80) {
          header.classList.add('scrolled');
          header.classList.remove('transparent');
        } else {
          header.classList.remove('scrolled');
          header.classList.add('transparent');
        }
      } else {
        // Sur les autres pages : toujours avec fond
        header.classList.add('scrolled');
      }
    }

    if (isHome) header.classList.add('transparent');
    window.addEventListener('scroll', updateHeader, { passive: true });
    updateHeader(); // Appel initial
  }

  /* =====================================================
     5. MENU MOBILE HAMBURGER
  ===================================================== */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  // Créer l'overlay dynamiquement
  let overlay = document.querySelector('.mobile-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'mobile-overlay';
    document.body.appendChild(overlay);
  }

  function openMenu() {
    mobileMenu?.classList.add('open');
    overlay.classList.add('active');
    hamburger?.classList.add('active');
    document.body.style.overflow = 'hidden'; // bloquer scroll
  }

  function closeMenu() {
    mobileMenu?.classList.remove('open');
    overlay.classList.remove('active');
    hamburger?.classList.remove('active');
    document.body.style.overflow = '';
  }

  hamburger?.addEventListener('click', (e) => {
    e.stopPropagation();
    if (mobileMenu?.classList.contains('open')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  overlay.addEventListener('click', closeMenu);

  // Fermer le menu si on clique sur un lien
  document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  /* =====================================================
     6. ANIMATIONS AU SCROLL (IntersectionObserver)
     Déclenche les classes reveal-up, reveal-left, reveal-right
  ===================================================== */
  const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

  if (revealEls.length > 0) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target); // N'observer qu'une fois
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    revealEls.forEach(el => revealObserver.observe(el));
  }

  /* =====================================================
     7. COMPTEURS ANIMÉS
     Anime les chiffres de 0 jusqu'à la valeur cible
  ===================================================== */
  const counters = document.querySelectorAll('.counter');

  if (counters.length > 0) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(counter => counterObserver.observe(counter));
  }

  /**
   * Anime un compteur de 0 à sa valeur data-target
   * @param {HTMLElement} counter
   */
  function animateCounter(counter) {
    const target = parseInt(counter.getAttribute('data-target'), 10);
    const duration = 1800; // ms
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Fonction easing ease-out
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(eased * target);

      counter.textContent = current.toLocaleString('fr-FR');

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        counter.textContent = target.toLocaleString('fr-FR');
      }
    }

    requestAnimationFrame(update);
  }

  /* =====================================================
     8. THEME TOGGLE (mode sombre / clair)
  ===================================================== */
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = document.getElementById('themeIcon');
  const THEME_KEY = 'gnr-theme'; // clé localStorage

  // Restaurer le thème sauvegardé
  const savedTheme = localStorage.getItem(THEME_KEY);
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
    document.body.classList.remove('light-mode');
    if (themeIcon) {
      themeIcon.className = 'fas fa-sun';
    }
  }

  themeToggle?.addEventListener('click', () => {
    const isDark = document.body.classList.contains('dark-mode');

    if (isDark) {
      // Passer en mode clair
      document.body.classList.remove('dark-mode');
      document.body.classList.add('light-mode');
      if (themeIcon) themeIcon.className = 'fas fa-moon';
      localStorage.setItem(THEME_KEY, 'light');
    } else {
      // Passer en mode sombre
      document.body.classList.add('dark-mode');
      document.body.classList.remove('light-mode');
      if (themeIcon) themeIcon.className = 'fas fa-sun';
      localStorage.setItem(THEME_KEY, 'dark');
    }
  });

  /* =====================================================
     9. FAQ ACCORDÉON
     Géré en CSS mais on peut aussi le contrôler ici
  ===================================================== */
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    item.addEventListener('click', () => {
      // Fermer les autres
      faqItems.forEach(other => {
        if (other !== item) other.classList.remove('open');
      });
      item.classList.toggle('open');
    });
  });

  /* =====================================================
     10. PARALLAXE HERO LÉGER
     Le fond se déplace doucement pendant le scroll
  ===================================================== */
  const heroBg = document.getElementById('heroBg');
  if (heroBg) {
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      // Effet subtil : se déplace à 40% de la vitesse du scroll
      heroBg.style.transform = `translateY(${scrolled * 0.4}px)`;
    }, { passive: true });
  }

  /* =====================================================
     11. BARRE RECHERCHE RAPIDE (page accueil)
     Gère les onglets Tous / Acheter / Louer
  ===================================================== */
  const searchTabs = document.querySelectorAll('.search-tab');
  const quickSearchBtn = document.getElementById('quickSearchBtn');
  const quickSearchInput = document.getElementById('quickSearch');
  const quickTypeSelect = document.getElementById('quickType');

  let activeStatus = 'all'; // statut sélectionné

  searchTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Mettre à jour l'onglet actif
      searchTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      activeStatus = tab.getAttribute('data-status');
    });
  });

  // Bouton de recherche : redirige vers property.html avec les paramètres
  quickSearchBtn?.addEventListener('click', (e) => {
    const search = quickSearchInput?.value.trim();
    const type = quickTypeSelect?.value;

    let url = 'property.html?';
    if (activeStatus !== 'all') url += `status=${activeStatus}&`;
    if (type && type !== 'all') url += `type=${type}&`;
    if (search) url += `city=${encodeURIComponent(search)}`;

    window.location.href = url;
  });

  /* =====================================================
     12. FONCTION : RÉVÉLER LE CONTENU HERO
     Déclenché après le loader ou immédiatement
  ===================================================== */
  function triggerHeroReveal() {
    // Animer les éléments .reveal-up dans le hero
    const heroRevealEls = document.querySelectorAll('.hero .reveal-up');
    heroRevealEls.forEach((el) => {
      el.classList.add('visible');
    });
  }

  /* =====================================================
     13. SMOOTH SCROLL POUR LES ANCRES
  ===================================================== */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* =====================================================
     14. TOAST NOTIFICATION UTILITAIRE
     Usage global : showToast("Votre message", "success")
  ===================================================== */
  window.showToast = function(message, type = 'success') {
    const toast = document.getElementById('toast');
    if (!toast) return;

    const colors = {
      success: '#1a6b35',
      error: '#dc2626',
      info: '#2563eb',
      warning: '#d97706'
    };

    toast.textContent = message;
    toast.style.background = colors[type] || colors.success;
    toast.classList.add('show');

    setTimeout(() => toast.classList.remove('show'), 3500);
  };

  /* =====================================================
     15. ANIMATION DES CARTES FEAT-HEART (favoris home)
  ===================================================== */
  document.querySelectorAll('.feat-heart').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      btn.classList.toggle('active');
      const icon = btn.querySelector('i');
      if (btn.classList.contains('active')) {
        icon.className = 'fas fa-heart';
        icon.style.color = '#ef4444';
        // Petite animation
        btn.animate([
          { transform: 'scale(1)' },
          { transform: 'scale(1.3)' },
          { transform: 'scale(1)' }
        ], { duration: 300, easing: 'ease-out' });
      } else {
        icon.className = 'far fa-heart';
        icon.style.color = '';
      }
    });
  });

}); // Fin DOMContentLoaded
