
(() => {
  document.body.classList.add('motion-ready');

  const bar = document.createElement('div');
  bar.className = 'scroll-progress';
  bar.setAttribute('aria-hidden','true');
  document.body.appendChild(bar);

  const update = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    const pct = max > 0 ? Math.max(0,Math.min(100,scrollY / max * 100)) : 0;
    document.documentElement.style.setProperty('--scroll-progress', pct + '%');
  };
  update();
  addEventListener('scroll',update,{passive:true});
  addEventListener('resize',update,{passive:true});

  const targets = document.querySelectorAll(
    '.project,.certificate,.building,.issuer,.dynamic-case-study,.drawing-section,.panel>.buildings,.gallery-section'
  );
  targets.forEach(el=>el.classList.add('motion-reveal'));

  if (matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
    targets.forEach(el=>el.classList.add('is-visible'));
    return;
  }

  const io = new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  },{threshold:.08,rootMargin:'0px 0px -5% 0px'});
  targets.forEach(el=>io.observe(el));
})();
