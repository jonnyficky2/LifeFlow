export function initNavbar() {
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  
  // Toggle mobile menu
  hamburger?.addEventListener('click', () => {
    navLinks?.classList.toggle('active');
  });
  
  // Close menu ketika link diklik
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navLinks?.classList.remove('active');
    });
  });
}

export function updateNavbarUser(userName = 'User') {
  const userNameEl = document.querySelector('.navbar-user-name');
  if (userNameEl) {
    userNameEl.textContent = userName;
  }
}