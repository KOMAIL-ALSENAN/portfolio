(()=>{
  'use strict';
  const state={items:[],index:0,lastFocus:null};
  const q=(s,r=document)=>r.querySelector(s);
  const qa=(s,r=document)=>[...r.querySelectorAll(s)];
  function ensureLightbox(){
    let box=q('#pgLightbox');
    if(box)return box;
    box=document.createElement('div');
    box.id='pgLightbox';box.className='pg-lightbox';box.setAttribute('role','dialog');box.setAttribute('aria-modal','true');box.setAttribute('aria-label','Image viewer');
    box.innerHTML='<button class="pg-lightbox-close" type="button" aria-label="Close image viewer">×</button><button class="pg-lightbox-prev" type="button" aria-label="Previous image">‹</button><figure class="pg-lightbox-figure"><img alt=""><figcaption class="pg-lightbox-caption"></figcaption></figure><button class="pg-lightbox-next" type="button" aria-label="Next image">›</button><div class="pg-lightbox-counter" aria-live="polite"></div>';
    document.body.append(box);
    q('.pg-lightbox-close',box).addEventListener('click',close);
    q('.pg-lightbox-prev',box).addEventListener('click',()=>show(state.index-1));
    q('.pg-lightbox-next',box).addEventListener('click',()=>show(state.index+1));
    box.addEventListener('click',e=>{if(e.target===box)close()});
    return box;
  }
  function refresh(){state.items=qa('[data-pg-image]').filter(el=>el.dataset.pgImage)}
  function show(i){
    refresh();if(!state.items.length)return;
    state.index=(i+state.items.length)%state.items.length;
    const item=state.items[state.index],box=ensureLightbox(),img=q('img',box),cap=q('.pg-lightbox-caption',box),counter=q('.pg-lightbox-counter',box);
    img.src=item.dataset.pgImage;img.alt=item.dataset.pgAlt||item.getAttribute('aria-label')||'';
    cap.textContent=item.dataset.pgCaption||item.dataset.pgAlt||'';
    counter.textContent=`${state.index+1} / ${state.items.length}`;
    box.classList.add('open');document.body.style.overflow='hidden';
  }
  function open(item){refresh();const i=state.items.indexOf(item);state.lastFocus=document.activeElement;show(i<0?0:i);requestAnimationFrame(()=>q('.pg-lightbox-close',ensureLightbox()).focus())}
  function close(){const box=q('#pgLightbox');if(!box||!box.classList.contains('open'))return;box.classList.remove('open');q('img',box).removeAttribute('src');document.body.style.overflow='';if(state.lastFocus&&state.lastFocus.focus)state.lastFocus.focus()}
  function bind(root=document){qa('[data-pg-image]',root).forEach(el=>{if(el.dataset.pgBound)return;el.dataset.pgBound='1';el.addEventListener('click',()=>open(el))});refresh()}
  function applyLanguage(lang){
    const next=lang==='ar'?'ar':'en';document.documentElement.lang=next;document.documentElement.dir=next==='ar'?'rtl':'ltr';
    qa('[data-en][data-ar]').forEach(el=>{const value=el.dataset[next];if(value!==undefined)el.textContent=value});
    qa('[data-en-aria][data-ar-aria]').forEach(el=>el.setAttribute('aria-label',next==='ar'?el.dataset.arAria:el.dataset.enAria));
    qa('[data-pg-lang]').forEach(btn=>{btn.setAttribute('aria-pressed',String(next==='ar'));btn.textContent=next==='ar'?'English':'العربية'});
    try{localStorage.setItem('portfolio-language',next)}catch(_){}
    document.dispatchEvent(new CustomEvent('projectgallery:language',{detail:{lang:next}}));
  }
  function initLanguage(){
    const bilingual=!!q('[data-pg-lang]')||!!q('[data-en][data-ar]');if(!bilingual)return;
    let lang='en';try{lang=localStorage.getItem('portfolio-language')||document.documentElement.lang||'en'}catch(_){lang=document.documentElement.lang||'en'}
    applyLanguage(lang==='ar'?'ar':'en');qa('[data-pg-lang]').forEach(btn=>btn.addEventListener('click',()=>applyLanguage(document.documentElement.lang==='ar'?'en':'ar')))
  }
  document.addEventListener('keydown',e=>{const box=q('#pgLightbox');if(!box||!box.classList.contains('open'))return;if(e.key==='Escape')close();else if(e.key==='ArrowLeft')show(state.index-1);else if(e.key==='ArrowRight')show(state.index+1)});
  document.addEventListener('DOMContentLoaded',()=>{bind();initLanguage()});
  window.ProjectGallery={bind,open,close,show,applyLanguage,refresh};
})();