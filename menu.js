/* Menu digital: catálogo + busca + seleção local sem pedidos online. */
(() => {
  'use strict';
  const items = Array.isArray(window.MOCELLIN_MENU) ? window.MOCELLIN_MENU : [];
  const directory = document.getElementById('menu-groups');
  if (!directory) return;

  const categories = [
    {id:'carnes',name:'Carnes',subtitle:'Cortes para escolher seu ponto. Preços por 100g, com exceções indicadas.',image:'picanha-espeto.webp'},
    {id:'acompanhamentos',name:'Acompanhamentos',subtitle:'O toque que faz toda a diferença.',image:'fraldinha.webp'},
    {id:'saladas',name:'Saladas',subtitle:'Frescor para acompanhar a brasa.',image:'salada.webp',tall:true},
    {id:'porcoes',name:'Porções',subtitle:'Para começar a noite ou dividir com alguém.',image:'batata-catupiry.webp'},
    {id:'sobremesas',name:'Sobremesas',subtitle:'O final que a refeição merece.',image:'sobremesa.webp'},
    {id:'bebidas',name:'Bebidas',subtitle:'Refrescantes para acompanhar cada momento.',image:'suco.webp',tall:true},
    {id:'cervejas',name:'Cervejas',subtitle:'600ml e long neck: escolha a sua.',image:'cervejas.webp'},
    {id:'drinks',name:'Drinks',subtitle:'Clássicos e combinações da casa.',image:'drinks.webp',tall:true},
    {id:'doses',name:'Doses',subtitle:'Para quem sabe o que gosta.',image:'vinho.webp'},
    {id:'chopp',name:'Chopp',subtitle:'Uma pausa gelada entre um corte e outro.',image:'chopp.webp',tall:true},
    {id:'vinhos',name:'Vinhos',subtitle:'Rótulos para acompanhar a sua escolha.',image:'vinho.webp',tall:true}
  ];

  const $ = (selector) => document.querySelector(selector);
  const escape = value => String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const simplify = value => String(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('pt-BR');
  const money = value => Number(value).toLocaleString('pt-BR', { style:'currency',currency:'BRL' });
  const getCategory = name => categories.find(cat => cat.name === name);
  const searchEl = $('#search-input');
  const sidebar = $('#category-sidebar');
  const mobileNav = $('#category-mobile');
  const metaEl = $('#results-meta');
  const noResults = $('#no-results');
  const clearFilters = $('#clear-filters');
  const emptyReset = $('#empty-reset');
  const countEl = $('#hero-item-count');
  countEl.textContent = String(items.length);
  let query = '';
  let currentInView = 'all';
  let selection = loadSelection();
  let previousFocus = null;

  function loadSelection() {
    try {
      const stored = JSON.parse(localStorage.getItem('mocellin-lista-v2') || '{}');
      if (stored && typeof stored === 'object' && !Array.isArray(stored)) {
        const valid = {};
        for (const [key,count] of Object.entries(stored)) {
          const id = Number(key);
          if (Number.isInteger(id) && items[id] && Number.isInteger(count) && count>0 && count<=99) valid[id]=count;
        }
        return valid;
      }
    } catch (_) { /* armazenamento indisponível: seleção segue em memória */ }
    return {};
  }
  function saveSelection() {
    try { localStorage.setItem('mocellin-lista-v2',JSON.stringify(selection)); } catch (_) { }
  }
  function navLabel(cat, i) {
    return `<button type="button" data-jump="${cat.id}" class="${currentInView===cat.id?'is-active':''}" aria-label="Ir para ${escape(cat.name)}"><span>${escape(cat.name)}</span><span>${String(i+1).padStart(2,'0')}</span></button>`;
  }
  sidebar.innerHTML = categories.map(navLabel).join('');
  mobileNav.innerHTML = `<button type="button" data-jump="all">Todas</button>` + categories.map(cat => `<button type="button" data-jump="${cat.id}">${escape(cat.name)}</button>`).join('');

  function itemMarkup(item, index) {
    const quantity = selection[index] || 0;
    return `<article class="menu-row" data-item="${index}">
      <div class="menu-row-info"><h3>${escape(item.name)}</h3>${item.description?`<p>${escape(item.description)}</p>`:''}</div>
      <span class="menu-row-price">${money(item.price)}</span>
      <button type="button" class="add-item${quantity?' added':''}" data-add="${index}" aria-label="Adicionar ${escape(item.name)} à minha seleção" title="Adicionar à minha seleção">${quantity?'✓':'+'}</button>
    </article>`;
  }
  function sectionMarkup(cat, index, matched) {
    return `<section class="menu-group" id="${cat.id}" aria-labelledby="heading-${cat.id}">
      <div class="group-header"><div class="group-title-block${cat.name==='Acompanhamentos'?' title-long':''}"><small>${String(index+1).padStart(2,'0')} / SABORES DA CASA</small><h2 id="heading-${cat.id}">${escape(cat.name.toLocaleUpperCase('pt-BR'))}<span class="heading-dot">.</span></h2></div>
      <div class="group-image${cat.tall?' tall':''}"><img src="assets/images/${escape(cat.image)}" alt="" loading="lazy"></div></div>
      <div class="group-subhead"><span>${escape(cat.subtitle)}</span><span>${matched.length} ${matched.length===1?'OPÇÃO':'OPÇÕES'}</span></div>
      <div class="menu-rows">${matched.map(({item,index})=>itemMarkup(item,index)).join('')}</div>
    </section>`;
  }

  function updateNav() {
    document.querySelectorAll('[data-jump]').forEach(button => {
      const cat = button.dataset.jump;
      button.classList.toggle('is-active',cat===currentInView || (cat==='all' && !query && currentInView==='all'));
    });
  }
  function render() {
    const filtered = items.map((item,index)=>({item,index})).filter(({item}) => {
      return !query || simplify(item.name+' '+item.description+' '+item.category).includes(simplify(query));
    });
    metaEl.textContent = query ? `${filtered.length} ${filtered.length===1?'RESULTADO':'RESULTADOS'} PARA “${query.toLocaleUpperCase('pt-BR')}”` : `TODOS OS SABORES · ${items.length} OPÇÕES`;
    clearFilters.hidden = !query;
    noResults.hidden = filtered.length !== 0;
    directory.innerHTML = categories.map((cat,i) => {
      const matched = filtered.filter(obj => obj.item.category === cat.name);
      return matched.length ? sectionMarkup(cat,i,matched) : '';
    }).join('');
    updateNav();
  }

  function jumpTo(id) {
    if (query) { query='';searchEl.value='';render(); }
    if (id==='all') {
      currentInView='all';updateNav();
      document.querySelector('.menu-discovery').scrollIntoView({behavior:'smooth',block:'start'});
      return;
    }
    const group = document.getElementById(id);
    if (group) {
      currentInView=id; updateNav();
      group.scrollIntoView({behavior:'smooth',block:'start'});
      try { history.replaceState(null,'',`#${id}`); } catch (_) { }
    }
  }
  document.addEventListener('click', event => {
    const nav = event.target.closest('[data-jump]');
    if (nav) { jumpTo(nav.dataset.jump);return; }
    const add = event.target.closest('[data-add]');
    if (add) { changeQuantity(Number(add.dataset.add),1);return; }
  });
  searchEl.addEventListener('input',()=>{query=searchEl.value.trim();currentInView='all';render();});
  const clearSearch = () => {query='';searchEl.value='';currentInView='all';render();searchEl.focus();};
  clearFilters.addEventListener('click',clearSearch);
  emptyReset.addEventListener('click',clearSearch);

  // Atualiza categorias conforme a seção visível; não interfere na rolagem do leitor.
  let ticking = false;
  window.addEventListener('scroll',() => {
    if (ticking || query) return;
    ticking = true;
    requestAnimationFrame(()=>{
      ticking=false;
      const visible = [...document.querySelectorAll('.menu-group')].filter(section => section.getBoundingClientRect().top <= 180);
      if(visible.length) { const id=visible.at(-1).id; if(id!==currentInView){currentInView=id; updateNav();} }
    });
  },{passive:true});

  const bar = $('#selection-bar');
  const barCount = $('#selection-bar-count');
  const drawer = $('#selection-drawer');
  const backdrop = $('#drawer-backdrop');
  const selectionItems = $('#selection-items');
  const copyFeedback = $('#copy-feedback');
  const drawerOpen = () => !drawer.hidden;

  function changeQuantity(id,amount) {
    if (!items[id]) return;
    const next = Math.max(0,Math.min(99,(selection[id]||0)+amount));
    if (next) selection[id]=next; else delete selection[id];
    saveSelection();
    updateSelection();
    const btn = document.querySelector(`[data-add="${id}"]`);
    if (btn) { btn.classList.toggle('added',Boolean(next));btn.textContent=next?'✓':'+'; }
  }
  function updateSelection() {
    const entries=Object.entries(selection).filter(([id,count]) => items[Number(id)] && count>0);
    const count=entries.reduce((sum,[,count])=>sum+count,0);
    bar.hidden=count===0;
    barCount.textContent=`${count} ${count===1?'item':'itens'}`;
    selectionItems.innerHTML=entries.length?entries.map(([id,qty])=>{
      const item=items[Number(id)];
      return `<div class="selection-item"><div><strong>${escape(item.name)}</strong><small>${money(item.price)}${item.description?' · '+escape(item.description):''}</small></div><div class="qty-controls"><button type="button" data-qty="-1" data-id="${id}" aria-label="Remover uma unidade de ${escape(item.name)}">−</button><span>${qty}</span><button type="button" data-qty="1" data-id="${id}" aria-label="Adicionar uma unidade de ${escape(item.name)}">+</button></div></div>`;
    }).join(''):'<p class="drawer-help">Sua lista está vazia. Escolha algo no cardápio.</p>';
  }
  function openDrawer() {
    previousFocus=document.activeElement;
    drawer.hidden=false;backdrop.hidden=false;copyFeedback.textContent='';
    $('#close-selection').focus();
  }
  function closeDrawer(){drawer.hidden=true;backdrop.hidden=true;previousFocus?.focus?.();}
  $('#open-selection').addEventListener('click',openDrawer);
  $('#close-selection').addEventListener('click',closeDrawer);
  backdrop.addEventListener('click',closeDrawer);
  selectionItems.addEventListener('click',event=>{
    const btn=event.target.closest('[data-qty]');
    if(btn) changeQuantity(Number(btn.dataset.id),Number(btn.dataset.qty));
  });
  $('#clear-selection').addEventListener('click',()=>{
    selection={}; saveSelection();updateSelection();
    document.querySelectorAll('.add-item').forEach(button => {button.classList.remove('added');button.textContent='+';});
    copyFeedback.textContent='Seleção limpa.';
  });
  async function copyText(text) {
    if (navigator.clipboard?.writeText) { await navigator.clipboard.writeText(text);return; }
    // Fallback para arquivos locais e navegadores antigos.
    const el=document.createElement('textarea');el.value=text;el.style.position='fixed';el.style.opacity='0';document.body.appendChild(el);el.select();const ok=document.execCommand('copy');el.remove();if(!ok)throw new Error('Cópia indisponível');
  }
  $('#copy-selection').addEventListener('click',async()=>{
    const entries=Object.entries(selection).filter(([id,qty])=>items[Number(id)]&&qty>0);
    if(!entries.length){copyFeedback.textContent='Sua lista está vazia.';return;}
    const content='Minha seleção — Picanha do Mocellin\n'+entries.map(([id,qty])=>`${qty}x ${items[Number(id)].name} — ${money(items[Number(id)].price)}${items[Number(id)].description?' ('+items[Number(id)].description+')':''}`).join('\n')+'\n\nLista de consulta, não é um pedido.';
    try{await copyText(content);copyFeedback.textContent='Lista copiada!';}catch(_){copyFeedback.textContent='Não foi possível copiar automaticamente neste navegador.';}
  });
  document.addEventListener('keydown',event=>{
    if(event.key==='Escape'&&drawerOpen()){closeDrawer();return;}
    if(event.key==='/'&&document.activeElement?.tagName!=='INPUT'&&!drawerOpen()){event.preventDefault();searchEl.focus();}
    if(event.key==='Tab'&&drawerOpen()) {
      const focusable=[...drawer.querySelectorAll('button:not(:disabled)')];
      const first=focusable[0],last=focusable.at(-1);
      if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}
      else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}
    }
  });
  render();updateSelection();
  const startHash=decodeURIComponent(location.hash.slice(1));
  if(categories.some(cat=>cat.id===startHash)) {
    requestAnimationFrame(()=>setTimeout(()=>document.getElementById(startHash)?.scrollIntoView({block:'start'}),100));
  }
})();
