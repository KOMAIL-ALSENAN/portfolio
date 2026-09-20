(()=>{'use strict';const PROJECT_IMAGE_PROTECTION_GLOBAL_V1=true;const isProjectImage=el=>{if(!(el instanceof HTMLImageElement))return false;const src=el.getAttribute('src')||'';return src.includes('assets/projects/')||el.closest('.gallery,.lightbox,.building,.project-card,.project-image,.drawing-card')!==null};const protect=img=>{if(!isProjectImage(img))return;img.draggable=false;img.setAttribute('draggable','false');img.style.webkitUserDrag='none';img.style.userSelect='none';img.style.webkitUserSelect='none'};const isProjectCardImage=img=>img instanceof HTMLImageElement&&img.closest('.project-media')!==null;const projectCardLabel=img=>{const card=img.closest('.project');const heading=card&&card.querySelector('h2');if(heading&&heading.textContent.trim())return heading.textContent.trim();return(img.alt||'Project').replace(/\s+(project image|logo)$/i,'').trim()||'Project'};const replaceProjectCardImage=img=>{const media=img.closest('.project-media');if(!media)return;const label=projectCardLabel(img);const fallback=document.createElement('div');fallback.className='project-art project-image-fallback';fallback.setAttribute('role','img');fallback.setAttribute('aria-label',`${label} image unavailable`);fallback.textContent=label;media.replaceChildren(fallback)};const recoverProjectCardImage=img=>{if(!isProjectCardImage(img))return;if(img.dataset.projectImageRetry!=='1'){img.dataset.projectImageRetry='1';const raw=img.getAttribute('src');if(raw){const sep=raw.includes('?')?'&':'?';img.src=`${raw}${sep}image-retry=${Date.now()}`;return}}replaceProjectCardImage(img)};const recoverCompletedFailures=root=>{if(!root.querySelectorAll)return;root.querySelectorAll('.project-media img').forEach(img=>{if(img.complete&&img.naturalWidth===0)recoverProjectCardImage(img)})};const protectAll=root=>(root.querySelectorAll?root.querySelectorAll('img').forEach(protect):null);protectAll(document);recoverCompletedFailures(document);document.addEventListener('DOMContentLoaded',()=>{protectAll(document);recoverCompletedFailures(document)});window.addEventListener('error',event=>{if(isProjectCardImage(event.target))recoverProjectCardImage(event.target)},true);new MutationObserver(records=>records.forEach(r=>r.addedNodes.forEach(n=>{if(n.nodeType!==1)return;if(n.tagName==='IMG'){protect(n);if(isProjectCardImage(n)&&n.complete&&n.naturalWidth===0)recoverProjectCardImage(n)}protectAll(n);recoverCompletedFailures(n)}))).observe(document.documentElement,{childList:true,subtree:true});document.addEventListener('contextmenu',e=>{if(isProjectImage(e.target)){e.preventDefault();e.stopPropagation()}},true);document.addEventListener('dragstart',e=>{if(isProjectImage(e.target)){e.preventDefault();e.stopPropagation()}},true);document.addEventListener('copy',e=>{const s=document.getSelection();const node=s&&s.anchorNode;const el=node&&(node.nodeType===1?node:node.parentElement);if(el&&(isProjectImage(el)||el.closest('.gallery,.lightbox,.building,.project-card,.project-image,.drawing-card'))){e.preventDefault();e.stopPropagation()}},true);document.addEventListener('keydown',e=>{const k=(e.key||'').toLowerCase();if((e.ctrlKey||e.metaKey)&&(k==='s'||k==='u'||k==='c')&&(document.querySelector('.lightbox.open')||document.querySelector('.gallery,.drawing-card,.project-image'))){e.preventDefault();e.stopPropagation()}},true);})();

/* PROJECT_WATERMARK_LAYER_V1
   Visual stack: project image -> watermark -> transparent protection layer.
   Image files are not modified. */
(()=>{
  'use strict';
  const PROJECT_WATERMARK_LAYER_V1=true;
  const WATERMARK_TEXT='KOMAIL ALSENAN • PORTFOLIO •';
  const STYLE_ID='project-watermark-layer-style';

  const isProjectImage=img=>{
    if(!(img instanceof HTMLImageElement))return false;
    const src=img.getAttribute('src')||'';
    return src.includes('assets/projects/')||img.closest('.gallery,.lightbox,.building,.project-card,.project-image,.drawing-card,.project-media')!==null;
  };

  const installStyles=()=>{
    if(document.getElementById(STYLE_ID))return;
    const style=document.createElement('style');
    style.id=STYLE_ID;
    style.textContent=`
      .project-layer-host{position:relative!important;isolation:isolate}
      .project-inline-image-stack{position:relative;display:block;width:100%;overflow:hidden;line-height:0}
      .project-lightbox-image-stack{position:relative;display:grid;place-items:center;max-width:94vw;max-height:90dvh;line-height:0}
      .project-watermark-layer{position:absolute;inset:0;overflow:hidden;z-index:2;pointer-events:none;user-select:none;-webkit-user-select:none}
      .project-watermark-grid{position:absolute;inset:-24%;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));grid-auto-rows:minmax(42px,1fr);gap:12px 28px;align-items:center;justify-items:center;transform:rotate(-18deg) scale(1.08);transform-origin:center;color:rgba(255,255,255,.22);text-shadow:0 1px 2px rgba(0,0,0,.22)}
      .project-watermark-grid span{white-space:nowrap;font:700 clamp(10px,1.35vw,22px)/1.1 Inter,"Segoe UI",Tahoma,Arial,sans-serif;letter-spacing:.16em;text-transform:uppercase}
      .project-protection-layer{position:absolute;inset:0;z-index:3;background:rgba(255,255,255,.004);pointer-events:none;user-select:none;-webkit-user-select:none}
      @media(max-width:620px){.project-watermark-grid{inset:-30%;grid-template-columns:1fr;gap:8px;transform:rotate(-18deg) scale(1.12)}.project-watermark-grid span{font-size:clamp(9px,3vw,14px);letter-spacing:.12em}}
      @media(prefers-reduced-motion:reduce){.project-watermark-grid{transform:rotate(-18deg)}}
    `;
    document.head.appendChild(style);
  };

  const makeWatermark=()=>{
    const watermark=document.createElement('span');
    watermark.className='project-watermark-layer';
    watermark.setAttribute('aria-hidden','true');
    const grid=document.createElement('span');
    grid.className='project-watermark-grid';
    for(let i=0;i<14;i++){
      const line=document.createElement('span');
      line.textContent=WATERMARK_TEXT;
      grid.appendChild(line);
    }
    watermark.appendChild(grid);
    return watermark;
  };

  const makeShield=()=>{
    const shield=document.createElement('span');
    shield.className='project-protection-layer';
    shield.setAttribute('aria-hidden','true');
    return shield;
  };

  const resolveHost=img=>{
    const parent=img.parentElement;
    if(!parent)return null;
    if(parent.matches('.lightbox,.viewer,[role="dialog"]')){
      let wrapper=img.closest('.project-lightbox-image-stack');
      if(!wrapper){
        wrapper=document.createElement('span');
        wrapper.className='project-lightbox-image-stack project-layer-host';
        parent.insertBefore(wrapper,img);
        wrapper.appendChild(img);
      }
      return wrapper;
    }
    if(parent.matches('.building,.project-card,.drawing-card')){
      let wrapper=img.closest('.project-inline-image-stack');
      if(!wrapper){
        wrapper=document.createElement('span');
        wrapper.className='project-inline-image-stack project-layer-host';
        parent.insertBefore(wrapper,img);
        wrapper.appendChild(img);
      }
      return wrapper;
    }
    parent.classList.add('project-layer-host');
    return parent;
  };

  const applyLayers=img=>{
    if(!isProjectImage(img)||img.dataset.projectWatermarkLayer==='1')return;
    const host=resolveHost(img);
    if(!host)return;
    const watermark=makeWatermark();
    const shield=makeShield();
    host.append(watermark,shield);
    img.dataset.projectWatermarkLayer='1';
  };

  const scan=root=>{
    if(root instanceof HTMLImageElement)applyLayers(root);
    root.querySelectorAll?.('img').forEach(applyLayers);
  };

  installStyles();
  scan(document);
  document.addEventListener('DOMContentLoaded',()=>scan(document),{once:true});
  new MutationObserver(records=>records.forEach(record=>record.addedNodes.forEach(node=>{
    if(node.nodeType===1)scan(node);
  }))).observe(document.documentElement,{childList:true,subtree:true});
})();
