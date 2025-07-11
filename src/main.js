import './style.css';
import './components/header/header.css';

async function loadComponent(selector, path) {
  const res = await fetch(path);
  const html = await res.text();
  document.querySelector(selector).innerHTML = html;
}

function disableScroll() {
  document.body.style.overflow = 'hidden';
  const main = document.querySelector('.main');
  if (main) {
    main.style.overflowY = 'hidden';
  }
}

function enableScroll() {
  document.body.style.overflow = '';
  const main = document.querySelector('.main');
  if (main) {
    main.style.overflowY = 'scroll';
  }
}

async function initHeader() {
  await loadComponent('#header-placeholder', '/src/components/header/header.html');

  const links = document.querySelectorAll('.nav-link');
  links.forEach(link => {
    link.addEventListener('click', () => {
      const href = link.getAttribute('href');

      links.forEach(l => l.classList.remove('header__link--active'));

      links.forEach(l => {
        if (l.getAttribute('href') === href) {
          l.classList.add('header__link--active');
        }
      });
    });
  });

  const menuButton = document.querySelector(".header__icon_nav");
  const mobileMenu = document.querySelector(".mobile-menu");
  const overlay = document.querySelector(".mobile-menu-overlay");
  const cartIcon = document.querySelector(".header__icon-cart");
  const navIcon = document.querySelector(".header__icon_nav");
  const closeIcon = document.querySelector(".icon_close");
  const header = document.querySelector('.header');

  if (menuButton && mobileMenu && overlay) {
    const closeMenu = () => {
      mobileMenu.classList.remove("open");
      mobileMenu.classList.add("closing");
      overlay.classList.remove("active");
      cartIcon.classList.remove("hide-icons");
      navIcon.classList.remove("hide-icons");
      closeIcon.classList.add("hide-icons");
      enableScroll();

      setTimeout(() => {
        mobileMenu.classList.remove("closing");
      }, 1000);
    };

    menuButton.addEventListener("click", (e) => {
      e.stopPropagation();

      const isOpen = mobileMenu.classList.contains("open");
      if (!isOpen) {
        mobileMenu.classList.remove("closing");
        mobileMenu.classList.add("open");
        overlay.classList.add("active");
        cartIcon.classList.add("hide-icons");
        navIcon.classList.add("hide-icons");
        closeIcon.classList.remove("hide-icons");
        disableScroll();
      } else {
        closeMenu();
      }
    });

    if (closeIcon) {
      closeIcon.addEventListener("click", () => {
        if (mobileMenu.classList.contains("open")) {
          closeMenu();
        }
      });
    }

    overlay.addEventListener('click', (e) => {
      if (header && header.contains(e.target)) {
        return;
      }
      if (mobileMenu.classList.contains("open")) {
        closeMenu();
      }
    });

    mobileMenu.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  }

  const modal = document.querySelector('.modal-form');
  const modalCloseBtn = document.querySelector('.modal-close');
  const callButtons = document.querySelectorAll('.call-button');

  if (modal && modalCloseBtn) {
    callButtons.forEach(button => {
      button.addEventListener('click', () => {
        modal.classList.add('active');
        overlay.classList.add("active");
        mobileMenu.classList.remove("open");
        mobileMenu.classList.add("closing");
        cartIcon.classList.remove("hide-icons");
        navIcon.classList.remove("hide-icons");
        closeIcon.classList.add("hide-icons");
        disableScroll();
      });
    });

    modalCloseBtn.addEventListener('click', () => {
      modal.classList.remove('active');
      overlay.classList.remove("active");
      enableScroll();
    });

    window.addEventListener('click', (e) => {
      if (modal.classList.contains('active') && !modal.querySelector('.form').contains(e.target) && !e.target.closest('.call-button')) {
        modal.classList.remove('active');
        overlay.classList.remove("active");
        enableScroll();
      }
    });
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  await initHeader();
});
