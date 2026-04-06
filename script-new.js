/**
 * script-new.js — GreenNest Realty | Logique UI globale
 * Auteur : HOUETO Fabrice | 2026 — Version corrigée
 *
 * Corrections appliquées :
 * 1. Curseur custom : utilise pointer-events:none sur le curseur lui-même
 *    → ne disparaît plus sur les éléments interactifs
 * 2. FAQ : gestion uniquement via JS (suppression du double onclick HTML)
 * 3. Hamburger : z-index et backdrop-filter corrigés, fonctionne sur toutes pages
 * 4. Header transparent : logique robuste multi-pages
 * 5. Dark mode : appliqué avant render (thème restauré)
 * 6. Compteurs : déclenchés après loader
 */

document.addEventListener('DOMContentLoaded', () => {

  /* =====================================================
     1. RESTAURER LE THÈME IMMÉDIATEMENT (évite le flash)
  ===================================================== */
  const savedTheme = localStorage.getItem('gnr-theme');
  const themeIcon  = document.getElementById('themeIcon');
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
    document.body.classList.remove('light-mode');
    if (themeIcon) themeIcon.className = 'fas fa-sun';
  }

  /* =====================================================
     2. THEME TOGGLE BUTTON
  ===================================================== */
  const themeToggle = document.getElementById('themeToggle');
  themeToggle?.addEventListener('click', () => {
    const isDark = document.body.classList.contains('dark-mode');
    if (isDark) {
      document.body.classList.remove('dark-mode');
      document.body.classList.add('light-mode');
      if (themeIcon) themeIcon.className = 'fas fa-moon';
      localStorage.setItem('gnr-theme', 'light');
    } else {
      document.body.classList.add('dark-mode');
      document.body.classList.remove('light-mode');
      if (themeIcon) themeIcon.className = 'fas fa-sun';
      localStorage.setItem('gnr-theme', 'dark');
    }
  });

  /* =====================================================
     3. PAGE LOADER
  ===================================================== */
  const loader = document.getElementById('pageLoader');
  if (loader) {
    setTimeout(() => {
      loader.classList.add('hidden');
      triggerHeroReveal();
      startCounters(); // Démarrer les compteurs après le loader
    }, 2000);
  } else {
    triggerHeroReveal();
  }

  /* =====================================================
     4. CURSEUR PERSONNALISÉ
     Fix : pointer-events:none sur les deux éléments
     → le curseur ne "mange" plus les clics ni ne disparaît
  ===================================================== */
  const cursor   = document.getElementById('cursor');
  const follower = document.getElementById('cursorFollower');

  if (cursor && follower && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    /* Désactiver pointer-events : le curseur ne bloque JAMAIS les clics */
    cursor.style.pointerEvents   = 'none';
    follower.style.pointerEvents = 'none';
    /* Couleur de fond solide — pas de mix-blend-mode qui fait disparaître le curseur */
    cursor.style.background = 'var(--jade, #22c55e)';
    cursor.style.opacity = '1';

    let mouseX = 0, mouseY = 0;
    let followerX = 0, followerY = 0;
    let isOverInteractive = false;

    document.addEventListener('mousemove', e => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      /* Position directe sans transition pour le point principal */
      cursor.style.left = mouseX + 'px';
      cursor.style.top  = mouseY + 'px';
    });

    /* Follower avec lag fluide */
    (function animateFollower() {
      followerX += (mouseX - followerX) * 0.12;
      followerY += (mouseY - followerY) * 0.12;
      follower.style.left = followerX + 'px';
      follower.style.top  = followerY + 'px';
      requestAnimationFrame(animateFollower);
    })();

    /* Scale au hover sur éléments interactifs — géré en JS car CSS ~ ne fonctionne pas */
    function addHoverEffect(el) {
      el.addEventListener('mouseenter', () => {
        cursor.style.transform   = 'translate(-50%,-50%) scale(2)';
        follower.style.transform = 'translate(-50%,-50%) scale(1.5)';
        follower.style.opacity   = '0.25';
      });
      el.addEventListener('mouseleave', () => {
        cursor.style.transform   = 'translate(-50%,-50%) scale(1)';
        follower.style.transform = 'translate(-50%,-50%) scale(1)';
        follower.style.opacity   = '0.5';
      });
    }

    /* Appliquer sur les éléments existants */
    document.querySelectorAll('a, button, input, select, textarea, [role="button"]').forEach(addHoverEffect);

    /* Observer les éléments ajoutés dynamiquement (cartes propriétés) */
    new MutationObserver(mutations => {
      mutations.forEach(m => m.addedNodes.forEach(node => {
        if (node.nodeType !== 1) return;
        node.querySelectorAll?.('a, button, [role="button"]').forEach(addHoverEffect);
        if (['A','BUTTON'].includes(node.tagName)) addHoverEffect(node);
      }));
    }).observe(document.body, { childList: true, subtree: true });

    /* Masquer le curseur quand la souris quitte la fenêtre */
    document.addEventListener('mouseleave', () => {
      cursor.style.opacity   = '0';
      follower.style.opacity = '0';
    });
    document.addEventListener('mouseenter', () => {
      cursor.style.opacity   = '1';
      follower.style.opacity = '0.5';
    });

  } else {
    /* Touch / mobile : masquer complètement les curseurs custom */
    if (cursor)   cursor.style.display = 'none';
    if (follower) follower.style.display = 'none';
  }

  /* =====================================================
     5. HEADER : TRANSPARENT → OPAQUE AU SCROLL
  ===================================================== */
  const header = document.getElementById('mainHeader');
  if (header) {
    const path   = window.location.pathname;
    const isHome = path.endsWith('index.html') || path === '/' || path.endsWith('/');

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
        header.classList.add('scrolled');
        header.classList.remove('transparent');
      }
    }

    if (isHome) header.classList.add('transparent');
    window.addEventListener('scroll', updateHeader, { passive: true });
    updateHeader();
  }

  /* =====================================================
     6. MENU MOBILE HAMBURGER
     Fix : z-index élevé, pas de backdrop-filter sur le bouton,
     fonctionne sur toutes les pages
  ===================================================== */
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  /* Créer l'overlay dynamiquement si absent */
  let overlay = document.querySelector('.mobile-overlay');
  if (!overlay && mobileMenu) {
    overlay = document.createElement('div');
    overlay.className = 'mobile-overlay';
    document.body.appendChild(overlay);
  }

  function openMenu() {
    if (!mobileMenu) return;
    mobileMenu.classList.add('open');
    if (overlay) overlay.classList.add('active');
    hamburger?.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    if (!mobileMenu) return;
    mobileMenu.classList.remove('open');
    if (overlay) overlay.classList.remove('active');
    hamburger?.classList.remove('active');
    document.body.style.overflow = '';
  }

  hamburger?.addEventListener('click', e => {
    e.stopPropagation();
    mobileMenu?.classList.contains('open') ? closeMenu() : openMenu();
  });

  overlay?.addEventListener('click', closeMenu);

  /* Fermer le menu au clic sur un lien mobile */
  document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  /* Fermer au resize vers desktop */
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) closeMenu();
  });

  /* =====================================================
     7. ANIMATIONS AU SCROLL (IntersectionObserver)
  ===================================================== */
  const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
  if (revealEls.length) {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(el => obs.observe(el));
  }

  /* =====================================================
     8. COMPTEURS ANIMÉS
  ===================================================== */
  function startCounters() {
    const counters = document.querySelectorAll('.counter');
    if (!counters.length) return;

    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(c => obs.observe(c));
  }

  function animateCounter(el) {
    const target   = parseInt(el.getAttribute('data-target'), 10);
    const duration = 1800;
    const start    = performance.now();

    function update(now) {
      const p       = Math.min((now - start) / duration, 1);
      const eased   = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.floor(eased * target).toLocaleString('fr-FR');
      if (p < 1) requestAnimationFrame(update);
      else el.textContent = target.toLocaleString('fr-FR');
    }
    requestAnimationFrame(update);
  }

  /* Démarrer si pas de loader */
  if (!document.getElementById('pageLoader')) startCounters();

  /* =====================================================
     9. FAQ ACCORDÉON
     Fix : supprimer les onclick inline du HTML et gérer ici
     → plus de double déclenchement, plus de conflit
  ===================================================== */
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    /* Supprimer le handler inline s'il existe */
    item.removeAttribute('onclick');

    item.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      /* Fermer tous les autres */
      faqItems.forEach(other => other.classList.remove('open'));
      /* Ouvrir celui-ci seulement s'il était fermé */
      if (!isOpen) item.classList.add('open');
    });
  });

  /* =====================================================
     10. PARALLAXE HERO LÉGER
  ===================================================== */
  const heroBg = document.getElementById('heroBg');
  if (heroBg) {
    window.addEventListener('scroll', () => {
      heroBg.style.transform = `translateY(${window.scrollY * 0.35}px)`;
    }, { passive: true });
  }

  /* =====================================================
     11. SMOOTH SCROLL ANCRES
  ===================================================== */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* =====================================================
     12. TOAST GLOBAL
  ===================================================== */
  window.showToast = function(message, type = 'success') {
    const t = document.getElementById('toast');
    if (!t) return;
    const colors = { success:'#1a6b35', error:'#dc2626', info:'#2563eb', warning:'#d97706' };
    t.textContent = message;
    t.style.background = colors[type] || colors.success;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 3500);
  };

  /* =====================================================
     13. TRIGGER HERO REVEAL (appelé après loader)
  ===================================================== */
  function triggerHeroReveal() {
    document.querySelectorAll('.hero .reveal-up').forEach(el => {
      el.classList.add('visible');
    });
  }

  /* =====================================================
     14. CŒURS FAVORIS SUR LA HOME (feat-heart)
  ===================================================== */
  document.querySelectorAll('.feat-heart').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      e.stopPropagation();
      btn.classList.toggle('active');
      const icon = btn.querySelector('i');
      if (btn.classList.contains('active')) {
        icon.className = 'fas fa-heart';
        icon.style.color = '#ef4444';
        btn.animate([{ transform:'scale(1)' },{ transform:'scale(1.3)' },{ transform:'scale(1)' }], { duration:300 });
      } else {
        icon.className = 'far fa-heart';
        icon.style.color = '';
      }
    });
  });

  /* =====================================================
     15. ONGLETS BARRE RECHERCHE RAPIDE (home uniquement)
  ===================================================== */
  const searchTabs = document.querySelectorAll('.search-tab');
  let activeStatus = 'all';

  searchTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      searchTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      activeStatus = tab.getAttribute('data-status');
    });
  });

  const quickSearchBtn = document.getElementById('quickSearchBtn');
  quickSearchBtn?.addEventListener('click', () => {
    const search = document.getElementById('quickSearch')?.value.trim();
    const type   = document.getElementById('quickType')?.value;
    let url = 'property.html?';
    if (activeStatus !== 'all') url += `status=${activeStatus}&`;
    if (type && type !== 'all') url += `type=${type}&`;
    if (search) url += `city=${encodeURIComponent(search)}`;
    window.location.href = url;
  });

}); // fin DOMContentLoaded
