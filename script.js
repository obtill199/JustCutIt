const menuButton = document.querySelector('.menu-toggle');
const mobileMenu = document.querySelector('.mobile-menu');

menuButton?.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!isOpen));
  menuButton.setAttribute('aria-label', isOpen ? 'Open menu' : 'Close menu');
  mobileMenu.hidden = isOpen;
  document.body.classList.toggle('menu-open', !isOpen);
});

mobileMenu?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    mobileMenu.hidden = true;
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Open menu');
    document.body.classList.remove('menu-open');
  });
});

document.querySelector('#year').textContent = new Date().getFullYear();

document.querySelector('#quote-form')?.addEventListener('submit', (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  if (!form.reportValidity()) return;
  const fields = new FormData(form);
  const name = String(fields.get('name') || '').trim();
  const phone = String(fields.get('phone') || '').trim();
  const location = String(fields.get('location') || '').trim();
  const service = String(fields.get('service') || '').trim();
  const details = String(fields.get('details') || '').trim();
  const subject = `Lawn care quote request from ${name}`;
  const body = `Hi Just Cut It Lawn Care,\n\nI'd like a quote for my property.\n\nName: ${name}\nPhone: ${phone}\nProperty address or ZIP: ${location}\nService: ${service}\nAdditional details: ${details || 'None provided'}\n\nThanks!`;
  window.location.href = `mailto:justcutitlandscaping@icloud.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
});
