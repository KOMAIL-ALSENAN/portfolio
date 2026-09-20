
(() => {
  const body = document.body;
  body.classList.add('motion-ready');

  const progress = document.createElement('div');
  progress.className = 'scroll-progress';
  progress.setAttribute('aria-hidden','true');
  document.body.appendChild(progress);

  const updateProgress = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const pct = max > 0 ? Math.min(100, Math.max(0, (window.scrollY / max) * 100)) : 0;
    document.documentElement.style.setProperty('--scroll-progress', pct + '%');
  };
  updateProgress();
  addEventListener('scroll', updateProgress, {passive:true});
  addEventListener('resize', updateProgress, {passive:true});

  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const targets = document.querySelectorAll(
    '#projects .project, #capabilities .capability-card, #skills .tool-card, #skills .secondary-tools, #about .about-card, #about .stat, #certificates .certificate, .section-head'
  );
  targets.forEach(el => el.classList.add('motion-reveal'));

  if (reduce || !('IntersectionObserver' in window)) {
    targets.forEach(el => el.classList.add('is-visible'));
    return;
  }

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, {threshold:.12, rootMargin:'0px 0px -7% 0px'});

  targets.forEach(el => io.observe(el));
})();
