(()=>{
  'use strict';
  const state={items:[],index:0,lastFocus:null};
  const q=(s,r=document)=>r.querySelector(s);
  const qa=(s,r=document)=>[...r.querySelectorAll(s)];
  const AR={
    'All Projects':'كل المشاريع',
    'View gallery →':'عرض المعرض ←',
    'View project →':'عرض المشروع ←',
    'Close gallery':'إغلاق المعرض',
    'Project buildings':'مباني المشروع',
    'Dining Facility':'مبنى المطعم',
    'Sports Center':'المركز الرياضي',
    'NEOM Professional Village':'قرية نيوم المهنية',
    'Dining Facility Gallery':'معرض مبنى المطعم',
    'Sports Center Gallery':'معرض المركز الرياضي',
    'Architectural BIM modeling and documentation for the NEOM Dining Facility.':'نمذجة وتوثيق BIM معماري لمبنى المطعم في مشروع نيوم.',
    'Architectural BIM modeling and documentation for the NEOM Sports Center.':'نمذجة وتوثيق BIM معماري للمركز الرياضي في مشروع نيوم.',
    'Multi-building NEOM sub-project prepared for separate building image galleries.':'مشروع فرعي متعدد المباني ضمن نيوم، منظم بمعارض صور مستقلة لكل مبنى.',
    'NEOM Professional Village has its own multi-building project page and can be expanded with additional buildings as needed.':'لدى قرية نيوم المهنية صفحة مشروع مستقلة متعددة المباني ويمكن توسيعها بإضافة مبانٍ أخرى عند الحاجة.',
    'Multi-building BIM documentation and coordination work, organized by building and sub-project for clear navigation and image galleries.':'أعمال توثيق وتنسيق BIM متعددة المباني، منظمة حسب المبنى والمشروع الفرعي لسهولة التنقل وعرض الصور.',
    'Building 01 · Warehouse':'المبنى 01 · المستودع',
    'Architectural BIM drawings organized from AR-0000 to AR-1700':'لوحات BIM المعمارية منظمة من AR-0000 حتى AR-1700',
    'View drawing gallery →':'عرض معرض اللوحات ←',
    'Building 02':'المبنى 02','Building 03':'المبنى 03','Building 04':'المبنى 04',
    'Content not published yet':'المحتوى لم يُنشر بعد',
    'Home':'الرئيسية',
    'Back to projects':'العودة إلى المشاريع',
    'Back to Qiddiya Project':'العودة إلى مشروع القدية',
    'Project content will be added soon.':'سيتم إضافة محتوى المشروع قريبًا.',
    'Project not found':'المشروع غير موجود',
    'The requested project could not be found.':'تعذر العثور على المشروع المطلوب.',
    'Project drawings and images':'صور ولوحات المشروع',
    'Open drawing':'فتح اللوحة',
    'Image viewer':'عارض الصور',
    'Close image viewer':'إغلاق عارض الصور',
    'Previous image':'الصورة السابقة',
    'Next image':'الصورة التالية',
    'Primary navigation':'التنقل الرئيسي',
    'Skip to main content':'انتقل إلى المحتوى الرئيسي'
  };
  const EN=Object.fromEntries(Object.entries(AR).map(([en,ar])=>[ar,en]));
  function savedLanguage(){try{return localStorage.getItem('portfolio-lang')||localStorage.getItem('portfolio-language')||document.documentElement.lang||'en'}catch(_){return document.documentElement.lang||'en'}}
  function ensureLightbox(){
    let box=q('#pgLightbox');
    if(box)return box;
    box=document.createElement('div');box.id='pgLightbox';box.className='pg-lightbox';box.setAttribute('role','dialog');box.setAttribute('aria-modal','true');
    box.innerHTML='<button class="pg-lightbox-close" type="button">×</button><button class="pg-lightbox-prev" type="button">‹</button><figure class="pg-lightbox-figure"><img alt=""><figcaption class="pg-lightbox-caption"></figcaption></figure><button class="pg-lightbox-next" type="button">›</button><div class="pg-lightbox-counter" aria-live="polite"></div>';
    document.body.append(box);
    q('.pg-lightbox-close',box).addEventListener('click',close);
    q('.pg-lightbox-prev',box).addEventListener('click',()=>show(state.index-1));
    q('.pg-lightbox-next',box).addEventListener('click',()=>show(state.index+1));
    box.addEventListener('click',e=>{if(e.target===box)close()});
    localizeControls(document.documentElement.lang==='ar'?'ar':'en');
    return box;
  }
  function refresh(){state.items=qa('[data-pg-image]').filter(el=>el.dataset.pgImage)}
  function show(i){refresh();if(!state.items.length)return;state.index=(i+state.items.length)%state.items.length;const item=state.items[state.index],box=ensureLightbox(),img=q('img',box),cap=q('.pg-lightbox-caption',box),counter=q('.pg-lightbox-counter',box);img.src=item.dataset.pgImage;img.alt=item.dataset.pgAlt||item.getAttribute('aria-label')||'';cap.textContent=item.dataset.pgCaption||item.dataset.pgAlt||'';counter.textContent=`${state.index+1} / ${state.items.length}`;box.classList.add('open');document.body.style.overflow='hidden'}
  function open(item){refresh();const i=state.items.indexOf(item);state.lastFocus=document.activeElement;show(i<0?0:i);requestAnimationFrame(()=>q('.pg-lightbox-close',ensureLightbox()).focus())}
  function close(){const box=q('#pgLightbox');if(!box||!box.classList.contains('open'))return;box.classList.remove('open');q('img',box).removeAttribute('src');document.body.style.overflow='';if(state.lastFocus&&state.lastFocus.focus)state.lastFocus.focus()}
  function bind(root=document){qa('[data-pg-image]',root).forEach(el=>{if(el.dataset.pgBound)return;el.dataset.pgBound='1';el.addEventListener('click',()=>open(el))});refresh()}
  function translateStatic(lang){
    const map=lang==='ar'?AR:EN;
    const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);
    const nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);
    nodes.forEach(n=>{const raw=n.nodeValue||'',trim=raw.trim();if(!trim||!map[trim])return;n.nodeValue=raw.replace(trim,map[trim])});
    qa('[aria-label]').forEach(el=>{const v=el.getAttribute('aria-label');if(map[v])el.setAttribute('aria-label',map[v])});
  }
  function localizeControls(lang){const ar=lang==='ar',box=q('#pgLightbox');if(box){box.setAttribute('aria-label',ar?'عارض الصور':'Image viewer');q('.pg-lightbox-close',box).setAttribute('aria-label',ar?'إغلاق عارض الصور':'Close image viewer');q('.pg-lightbox-prev',box).setAttribute('aria-label',ar?'الصورة السابقة':'Previous image');q('.pg-lightbox-next',box).setAttribute('aria-label',ar?'الصورة التالية':'Next image')}}
  function ensureLanguageButton(){if(q('[data-pg-lang],#langBtn,[data-set-language]'))return;const host=q('.nav-inner,.navInner,.header');if(!host)return;const btn=document.createElement('button');btn.type='button';btn.className='pg-btn pg-lang';btn.setAttribute('data-pg-lang','');btn.setAttribute('aria-label','Switch language');host.append(btn)}
  function applyLanguage(lang){
    const next=lang==='ar'?'ar':'en',ar=next==='ar';document.documentElement.lang=next;document.documentElement.dir=ar?'rtl':'ltr';document.body.dir=ar?'rtl':'ltr';
    qa('[data-en][data-ar]').forEach(el=>{const value=el.dataset[next];if(value!==undefined)el.textContent=value});
    qa('[data-en-aria][data-ar-aria]').forEach(el=>el.setAttribute('aria-label',ar?el.dataset.arAria:el.dataset.enAria));
    qa('[data-pg-lang]').forEach(btn=>{btn.setAttribute('aria-pressed',String(ar));btn.textContent=ar?'English':'العربية';btn.setAttribute('aria-label',ar?'Switch to English':'التبديل إلى العربية')});
    try{localStorage.setItem('portfolio-language',next);localStorage.setItem('portfolio-lang',next)}catch(_){}
    translateStatic(next);localizeControls(next);document.dispatchEvent(new CustomEvent('projectgallery:language',{detail:{lang:next}}));
  }
  function initLanguage(){ensureLanguageButton();const bilingual=!!q('[data-pg-lang]')||!!q('[data-en][data-ar]');if(!bilingual)return;applyLanguage(savedLanguage()==='ar'?'ar':'en');qa('[data-pg-lang]').forEach(btn=>{if(btn.dataset.langBound)return;btn.dataset.langBound='1';btn.addEventListener('click',()=>applyLanguage(document.documentElement.lang==='ar'?'en':'ar'))})}
  document.addEventListener('keydown',e=>{const box=q('#pgLightbox');if(!box||!box.classList.contains('open'))return;if(e.key==='Escape')close();else if(e.key==='ArrowLeft')show(state.index-1);else if(e.key==='ArrowRight')show(state.index+1)});
  document.addEventListener('DOMContentLoaded',()=>{bind();initLanguage()});
  window.ProjectGallery={bind,open,close,show,applyLanguage,refresh};
})();