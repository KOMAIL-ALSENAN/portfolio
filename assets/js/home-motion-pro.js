
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

  function loadProjectImages(){
    const images=[...document.querySelectorAll('img[data-project-src]')];
    if(!images.length)return;
    const load=img=>{
      if(!img.dataset.projectSrc)return;
      const src=img.dataset.projectSrc;
      img.onload=()=>img.removeAttribute('data-project-src');
      img.onerror=()=>img.removeAttribute('data-project-src');
      img.src=src;
    };
    if(!('IntersectionObserver' in window)){images.forEach(load);return}
    const imageObserver=new IntersectionObserver(entries=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){
          load(entry.target);
          imageObserver.unobserve(entry.target);
        }
      });
    },{rootMargin:'160px 0px',threshold:.01});
    images.forEach(img=>imageObserver.observe(img));
  }
  loadProjectImages();

  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const selector = [
    '#projects .project',
    '#experience .experience-item',
    '#capabilities .capability-card',
    '#skills .tool-card',
    '#skills .secondary-tools',
    '#products .developed-tool-card',
    '#certificates .certificate',
    '#about .about-card',
    '#about .stat',
    '#developer-highlight .home-dev-card',
    '.section-head'
  ].join(',');

  const registered = new WeakSet();
  let revealObserver = null;

  if (!reduce && 'IntersectionObserver' in window) {
    revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {threshold:.08, rootMargin:'0px 0px -5% 0px'});
  }

  function register(root=document){
    const nodes = [];
    if(root.nodeType===1 && root.matches?.(selector)) nodes.push(root);
    root.querySelectorAll?.(selector).forEach(el=>nodes.push(el));
    nodes.forEach(el=>{
      if(registered.has(el)) return;
      registered.add(el);
      el.classList.add('motion-reveal');
      if(reduce || !revealObserver) el.classList.add('is-visible');
      else revealObserver.observe(el);
    });
  }

  function revealPassedTargets(){
    if(reduce) return;
    document.querySelectorAll('.motion-reveal:not(.is-visible)').forEach(el=>{
      const rect=el.getBoundingClientRect();
      if(rect.top <= window.innerHeight * 1.08){
        el.classList.add('is-visible');
        revealObserver?.unobserve(el);
      }
    });
  }

  register(document);
  revealPassedTargets();

  let scheduled=false;
  const scheduleReveal=()=>{
    if(scheduled)return;
    scheduled=true;
    requestAnimationFrame(()=>{
      scheduled=false;
      register(document);
      revealPassedTargets();
    });
  };
  addEventListener('scroll',scheduleReveal,{passive:true});
  addEventListener('resize',scheduleReveal,{passive:true});
  addEventListener('hashchange',scheduleReveal);

  const mutationObserver = new MutationObserver(mutations=>{
    let needsRegister=false;
    for(const mutation of mutations){
      if(mutation.addedNodes?.length){needsRegister=true;break}
    }
    if(needsRegister)scheduleReveal();
  });
  mutationObserver.observe(document.body,{childList:true,subtree:true});

  document.addEventListener('portfolio:language',scheduleReveal);
  document.addEventListener('projectgallery:language',scheduleReveal);
})();
