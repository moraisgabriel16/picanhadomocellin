/* Interações leves, com funcionamento mesmo sem bibliotecas externas. */
(() => {
  document.documentElement.classList.add('js-ready');
  document.querySelectorAll('.current-year').forEach(node => node.textContent = String(new Date().getFullYear()));
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.08, rootMargin: '0px 0px 40px 0px' });
    document.querySelectorAll('[data-reveal]').forEach(node => observer.observe(node));
  } else {
    document.querySelectorAll('[data-reveal]').forEach(node => node.classList.add('is-visible'));
  }
  if (window.lucide && typeof window.lucide.createIcons === 'function') window.lucide.createIcons();
})();
