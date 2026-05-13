/* ══════════════════════════════════════
   CONTENT ENGINE v3
══════════════════════════════════════ */

/* ── Caminho base absoluto ──
   Calcula o root do site independentemente
   de estar em /pages/ ou na raiz
──────────────────────────────────────── */
function getRootURL() {
  const path = window.location.pathname;
  let root = path.replace(/\/pages\/.*$/, '').replace(/\/[^/]*\.html$/, '');
  if (!root.endsWith('/')) root += '/';
  return window.location.origin + root;
}

async function fetchMD(relativePath) {
  const url = getRootURL() + relativePath;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Erro ${res.status}: ${url}`);
  return res.text();
}

/* ── Frontmatter ── */
function parseFrontmatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) return { meta: {}, body: raw };
  const meta = {};
  match[1].split('\n').forEach(line => {
    const col = line.indexOf(':');
    if (col === -1) return;
    const key = line.slice(0, col).trim();
    let val   = line.slice(col + 1).trim();
    if (val.startsWith('[') && val.endsWith(']')) {
      val = val.slice(1, -1).split(',').map(s => s.trim().replace(/^["']|["']$/g, '')).filter(Boolean);
    }
    meta[key] = val;
  });
  return { meta, body: match[2] };
}

/* ── Categorias — suporta string, "Cat1, Cat2" ou array ── */
function getCategories(meta) {
  if (!meta.category) return [];
  if (Array.isArray(meta.category)) return meta.category;
  return meta.category.split(',').map(s => s.trim()).filter(Boolean);
}

function slugify(text) {
  return text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').trim();
}

/* ── Placeholder com ícone SVG por categoria ── */
function categoryIcon(category) {
  const icons = {
    'Web Dev':     `<path d="M13 10V3L4 14h7v7l9-11h-7z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`,
    'Design':      `<circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" stroke-width="2" stroke-linecap="round"/>`,
    'Ferramentas': `<path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`,
    'Carreira':    `<path d="M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z"/><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`,
    'TypeScript':  `<polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`,
    'Performance': `<polyline points="22 12 18 12 15 21 9 3 6 12 2 12" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`,
    'Backend':     `<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" stroke-width="2" stroke-linecap="round"/>`,
    'Web App':     `<rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`,
    'Open Source': `<circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><path d="M13 6h3a2 2 0 012 2v7M6 9v12" stroke-width="2" stroke-linecap="round"/>`,
    'Tutorial':    `<path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`,
  };
  return icons[category] || `<circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01" stroke-width="2" stroke-linecap="round"/>`;
}

function categoryColor(category) {
  const map = {
    'Web Dev':     '#00f5d4', 'Design':      '#e8ff47',
    'Ferramentas': '#00b4d8', 'Carreira':    '#f72585',
    'TypeScript':  '#3b82f6', 'Performance': '#f97316',
    'Backend':     '#22c55e', 'Web App':     '#00f5d4',
    'Open Source': '#a78bfa', 'Tutorial':    '#fb923c',
  };
  return map[category] || 'var(--accent)';
}

function thumbPlaceholder(category) {
  const color = categoryColor(category);
  const icon  = categoryIcon(category);
  return `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:var(--surface);position:relative;overflow:hidden;"><svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="${color}" opacity="0.35" xmlns="http://www.w3.org/2000/svg">${icon}</svg></div>`;
}

/* ── Vídeo ── */
function isYouTube(url) { return url.includes('youtube.com') || url.includes('youtu.be'); }
function isVimeo(url)   { return url.includes('vimeo.com'); }
function getYouTubeId(url) { const m = url.match(/(?:v=|youtu\.be\/)([^&\s]+)/); return m ? m[1] : null; }
function getVimeoId(url)   { const m = url.match(/vimeo\.com\/(\d+)/); return m ? m[1] : null; }

/* ── Blocos especiais ── */
function processBlocks(md) {
  const fences = [];
  md = md.replace(/```[\s\S]*?```/g, block => {
    const token = `@@CODE_FENCE_${fences.length}@@`;
    fences.push(block);
    return token;
  });

  md = md.replace(/:::carousel\n([\s\S]*?):::/g, (_, inner) => {
    const images = inner.trim().split('\n').filter(Boolean);
    const slides = images.map((src, i) => `<div class="carousel-slide${i === 0 ? ' active' : ''}"><img src="${src.trim()}" alt="Imagem ${i + 1}" loading="lazy"/></div>`).join('');
    const dots   = images.map((_, i) => `<button class="carousel-dot${i === 0 ? ' active' : ''}" data-index="${i}" aria-label="Slide ${i + 1}"></button>`).join('');
    return `<div class="carousel" data-total="${images.length}"><div class="carousel-track">${slides}</div><button class="carousel-prev" aria-label="Anterior">&#8592;</button><button class="carousel-next" aria-label="Próximo">&#8594;</button><div class="carousel-dots">${dots}</div></div>`;
  });
  md = md.replace(/:::callout\n([\s\S]*?):::/g, (_, inner) =>
    `<div class="callout"><span class="callout-icon">💡</span><div class="callout-body">${inner.trim()}</div></div>`
  );
  md = md.replace(/:::video\n([\s\S]*?):::/g, (_, inner) => {
    const url = inner.trim();
    if (isYouTube(url)) return `<div class="video-wrap"><iframe src="https://www.youtube.com/embed/${getYouTubeId(url)}" frameborder="0" allowfullscreen loading="lazy"></iframe></div>`;
    if (isVimeo(url))   return `<div class="video-wrap"><iframe src="https://player.vimeo.com/video/${getVimeoId(url)}" frameborder="0" allowfullscreen loading="lazy"></iframe></div>`;
    return `<div class="video-wrap"><video controls><source src="${url}"></video></div>`;
  });
  fences.forEach((block, i) => {
    md = md.replace(`@@CODE_FENCE_${i}@@`, block);
  });
  return md;
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/* ── Markdown ── */
function renderMarkdown(md) {
  if (window.marked) {
    const renderer = new window.marked.Renderer();
    renderer.code = function(codeOrToken, infoString) {
      const code = typeof codeOrToken === 'object' && codeOrToken !== null
        ? codeOrToken.text || ''
        : codeOrToken || '';
      const rawInfo = typeof codeOrToken === 'object' && codeOrToken !== null
        ? codeOrToken.lang || ''
        : infoString || '';
      const titleMatch = rawInfo.match(/title="([^"]+)"/);
      const lang = rawInfo.replace(/\s*title="[^"]*"/, '').trim();
      let highlighted = escapeHtml(code);
      if (window.hljs && lang) {
        try { highlighted = window.hljs.highlight(code, { language: lang }).value; } catch {}
      }
      const codeHtml = `<pre><code class="language-${escapeHtml(lang)}">${highlighted}</code></pre>`;
      return titleMatch ? `<div class="code-block"><div class="code-title">${escapeHtml(titleMatch[1])}</div>${codeHtml}</div>` : `<div class="code-block">${codeHtml}</div>`;
    };
    renderer.image = (href, title, alt) =>
      `<figure class="post-figure"><img src="${href}" alt="${alt || ''}" loading="lazy"/>${alt ? `<figcaption>${alt}</figcaption>` : ''}</figure>`;
    renderer.heading = function(text, level) {
      const t = typeof text === 'object' ? text.text : text;
      const l = typeof text === 'object' ? text.depth : level;
      return `<h${l} id="${slugify(t)}">${t}</h${l}>`;
    };
    window.marked.setOptions({ breaks: true, gfm: true });
    return window.marked.parse(md, { renderer });
  }
  return md;
}

/* ── TOC ── */
function buildTOC(html) {
  const headings = [...html.matchAll(/<h2 id="([^"]+)">([^<]+)<\/h2>/g)];
  if (headings.length < 2) return '';
  return `<div class="post-toc"><h4>Índice</h4><div class="toc-list">${headings.map(([, id, text]) => `<a href="#${id}" class="toc-link">${text}</a>`).join('')}</div></div>`;
}

function initTOCSpy() {
  const links    = document.querySelectorAll('.toc-link');
  const headings = [...document.querySelectorAll('.post-body h2, .project-content h2')];
  if (!links.length || !headings.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        links.forEach(l => l.classList.remove('active'));
        const a = [...links].find(l => l.getAttribute('href') === '#' + e.target.id);
        if (a) a.classList.add('active');
      }
    });
  }, { rootMargin: '-20% 0px -70% 0px' });
  headings.forEach(h => obs.observe(h));
}

/* ── Carrossel ── */
function initCarousels() {
  document.querySelectorAll('.carousel').forEach(c => {
    const slides = c.querySelectorAll('.carousel-slide');
    const dots   = c.querySelectorAll('.carousel-dot');
    let current  = 0;
    function goTo(n) {
      slides[current].classList.remove('active');
      dots[current] && dots[current].classList.remove('active');
      current = (n + slides.length) % slides.length;
      slides[current].classList.add('active');
      dots[current] && dots[current].classList.add('active');
    }
    c.querySelector('.carousel-prev')?.addEventListener('click', () => goTo(current - 1));
    c.querySelector('.carousel-next')?.addEventListener('click', () => goTo(current + 1));
    dots.forEach((d, i) => d.addEventListener('click', () => goTo(i)));
    let startX = 0;
    c.addEventListener('touchstart', e => { startX = e.touches[0].clientX; });
    c.addEventListener('touchend',   e => { const dx = e.changedTouches[0].clientX - startX; if (Math.abs(dx) > 50) goTo(dx < 0 ? current + 1 : current - 1); });
  });
}

/* ── Fallback para imagens em falta nos cards ── */
function handleImgError(img) {
  const cat     = img.dataset.fallbackCat || '';
  const wrapper = img.parentElement;
  if (wrapper) wrapper.innerHTML = thumbPlaceholder(cat);
}

/* ── Erros de media dentro do body de posts/projectos ── */
function initBodyMediaErrors() {
  // Imagens simples dentro de figures
  document.querySelectorAll('.post-body figure img, .project-content figure img').forEach(img => {
    if (img.complete && img.naturalWidth === 0) {
      img.closest('figure')?.classList.add('img-missing');
    } else {
      img.addEventListener('error', () => img.closest('figure')?.classList.add('img-missing'));
    }
  });

  // Imagens dentro de carrosseis
  document.querySelectorAll('.carousel-slide img').forEach(img => {
    if (img.complete && img.naturalWidth === 0) {
      img.closest('.carousel-slide')?.classList.add('slide-missing');
    } else {
      img.addEventListener('error', () => img.closest('.carousel-slide')?.classList.add('slide-missing'));
    }
  });

  // Iframes de vídeo (YouTube/Vimeo não dão erro, mas vídeo local pode falhar)
  document.querySelectorAll('.video-wrap video').forEach(video => {
    video.addEventListener('error', () => video.closest('.video-wrap')?.classList.add('video-missing'));
  });
}

/* ── Reveal ── */
function initReveal() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) { setTimeout(() => e.target.classList.add('visible'), i * 70); obs.unobserve(e.target); }
    });
  }, { threshold: 0.08 });
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
}

/* ══════════════════════════════════════
   BLOG LIST
══════════════════════════════════════ */
async function loadBlogList() {
  const grid     = document.getElementById('blog-grid');
  const featured = document.getElementById('blog-featured');
  if (!grid) return;
  try {
    const index = await fetchMD('data/posts-index.json').then(t => JSON.parse(t));
    const posts  = await Promise.all(index.map(async id => {
      const raw = await fetchMD(`content/posts/${id}.md`);
      const { meta } = parseFrontmatter(raw);
      return { id, ...meta };
    }));
    buildFilters(posts, 'post');
    if (featured) featured.innerHTML = posts.slice(0, 2).map(p => featuredCard(p)).join('');
    grid.innerHTML = posts.map(p => blogCard(p)).join('');
    initFilters('post');
  } catch (e) {
    grid.innerHTML = '<p class="error-msg">Não foi possível carregar os posts.</p>';
    console.error(e);
  }
}

function blogCard(p, linkPrefix = '') {
  const cats    = getCategories(p);
  const thumb   = p.cover
    ? `<img src="${p.cover}" alt="${p.title}" loading="lazy" style="width:100%;height:100%;object-fit:cover" data-fallback-cat="${cats[0] || ''}" onerror="handleImgError(this)"/>`
    : thumbPlaceholder(cats[0]);
  const catTags = cats.map(c => `<span class="blog-cat">${c}</span>`).join('');
  return `
<a href="${linkPrefix}blog-post.html?id=${p.id}" class="blog-card" data-category="${cats.join(',')}">
  <div class="blog-thumb">${thumb}</div>
  <div class="blog-body">
    <div class="blog-meta">${catTags}<span class="blog-date">${p.date || ''}</span></div>
    <div class="blog-title">${p.title}</div>
    <div class="blog-excerpt">${p.desc || ''}</div>
    <div class="blog-footer"><span class="read-time">${p.readTime || ''}</span><span class="btn-ghost" style="font-size:11px">Ler</span></div>
  </div>
</a>`;
}

function featuredCard(p) {
  const cats    = getCategories(p);
  const thumb   = p.cover
    ? `<img src="${p.cover}" alt="${p.title}" loading="lazy" style="width:100%;height:100%;object-fit:cover" data-fallback-cat="${cats[0] || ''}" onerror="handleImgError(this)"/>`
    : thumbPlaceholder(cats[0]);
  const catTags = cats.map(c => `<span class="blog-cat">${c}</span>`).join('');
  return `
<a href="blog-post.html?id=${p.id}" class="blog-featured-card">
  <div class="blog-featured-thumb">${thumb}</div>
  <div class="blog-featured-body">
    <div class="blog-meta" style="gap:6px">${catTags}<span class="blog-date">${p.date || ''}</span></div>
    <div class="blog-featured-title">${p.title}</div>
    <p style="font-size:14px;color:var(--muted2);line-height:1.8;margin-bottom:16px">${p.desc || ''}</p>
    <div style="display:flex;align-items:center;justify-content:space-between">
      <span class="read-time">${p.readTime || ''}</span>
      <span class="btn-ghost">Ler artigo</span>
    </div>
  </div>
</a>`;
}

/* ══════════════════════════════════════
   BLOG POST
══════════════════════════════════════ */
async function loadBlogPost() {
  const container = document.getElementById('post-container');
  if (!container) return;
  const id = new URLSearchParams(window.location.search).get('id');
  if (!id) { container.innerHTML = '<p class="error-msg">Post não encontrado.</p>'; return; }
  try {
    const raw = await fetchMD(`content/posts/${id}.md`);
    const { meta, body } = parseFrontmatter(raw);
    document.title = `${meta.title} — Tiago Cabaça`;

    const hero = document.getElementById('post-hero');
    if (hero) {
      const cats    = getCategories(meta);
      const catTags = cats.map(c => `<span class="blog-cat">${c}</span>`).join('');
      const cover   = meta.cover ? `<div class="post-cover"><img src="${meta.cover}" alt="${meta.title}"/></div>` : '';
      hero.innerHTML = `
        <div class="container" style="position:relative;z-index:2">
          <div style="margin-bottom:12px"><a href="blog.html" style="font-family:var(--font-mono);font-size:11px;color:var(--muted2);letter-spacing:.08em">← Blog</a></div>
          <div class="blog-meta" style="margin-bottom:14px;gap:8px;flex-wrap:wrap">${catTags}<span class="blog-date">${meta.date || ''}</span><span class="read-time">· ${meta.readTime || ''}</span></div>
          <h1 class="section-title" style="max-width:760px">${meta.title}</h1>
          ${cover}
        </div>
        <div class="page-hero-bg">POST</div>`;
    }

    const processed = processBlocks(body);
    const html      = renderMarkdown(processed);

    const tocEl = document.getElementById('post-toc-container');
    if (tocEl) tocEl.innerHTML = buildTOC(html);

    const bodyEl = document.getElementById('post-body');
    if (bodyEl) bodyEl.innerHTML = html;

    const metaEl = document.getElementById('post-meta-sidebar');
    if (metaEl) {
      const cats    = getCategories(meta);
      const catTags = cats.map(c => `<span class="tag" style="margin:2px 4px 2px 0">${c}</span>`).join('');
      metaEl.innerHTML = `
        <div class="detail-info-card">
          ${meta.date   ? `<div class="detail-info-row"><span>Publicado</span><span>${meta.date}</span></div>` : ''}
          ${meta.readTime ? `<div class="detail-info-row"><span>Leitura</span><span>${meta.readTime}</span></div>` : ''}
          ${cats.length ? `<div class="detail-info-row" style="flex-direction:column;align-items:flex-start;gap:6px;border-bottom:none"><span style="font-family:var(--font-mono);font-size:11px;color:var(--muted)">Categorias</span><div>${catTags}</div></div>` : ''}
        </div>`;
    }

    initTOCSpy(); initCarousels(); initReveal(); initBodyMediaErrors();
    loadRelatedPosts(id);
  } catch (e) {
    container.innerHTML = '<p class="error-msg">Não foi possível carregar o post.</p>';
    console.error(e);
  }
}

async function loadRelatedPosts(currentId) {
  const el = document.getElementById('related-posts');
  if (!el) return;
  try {
    const index  = await fetchMD('data/posts-index.json').then(t => JSON.parse(t));
    const others = await Promise.all(index.filter(id => id !== currentId).slice(0, 3).map(async id => {
      const raw = await fetchMD(`content/posts/${id}.md`);
      const { meta } = parseFrontmatter(raw);
      return { id, ...meta };
    }));
    el.innerHTML = others.map(p => blogCard(p)).join('');
  } catch {}
}

/* ══════════════════════════════════════
   PROJECTS LIST
══════════════════════════════════════ */
async function loadProjectsList() {
  const grid = document.getElementById('projects-grid');
  if (!grid) return;
  try {
    const index    = await fetchMD('data/projects-index.json').then(t => JSON.parse(t));
    const projects = await Promise.all(index.map(async (id, i) => {
      const raw = await fetchMD(`content/projects/${id}.md`);
      const { meta } = parseFrontmatter(raw);
      return { id, num: String(i + 1).padStart(2, '0'), ...meta };
    }));
    buildFilters(projects, 'project');
    grid.innerHTML = projects.map(p => projectCard(p)).join('');
    initFilters('project');
  } catch (e) {
    grid.innerHTML = '<p class="error-msg">Não foi possível carregar os projectos.</p>';
    console.error(e);
  }
}

function projectCard(p, linkPrefix = '') {
  const cats      = getCategories(p);
  const thumb     = p.cover
    ? `<img src="${p.cover}" alt="${p.title}" loading="lazy" style="width:100%;height:100%;object-fit:cover" data-fallback-cat="${cats[0] || ''}" onerror="handleImgError(this)"/>`
    : thumbPlaceholder(cats[0]);
  const stackTags = Array.isArray(p.stack) ? p.stack.slice(0, 3).map(t => `<span class="project-tag">${t}</span>`).join('') : '';
  return `
<div class="project-card" data-category="${cats.join(',')}">
  <div class="project-accent-line"></div>
  <div class="project-thumb">${thumb}</div>
  <div class="project-body">
    <div class="project-tags">${stackTags}</div>
    <div class="project-name">${p.title}</div>
    <div class="project-desc">${p.desc || ''}</div>
    <div class="project-links">
      <a href="${linkPrefix}project-detail.html?id=${p.id}" class="btn-ghost">Ver projecto</a>
      ${p.github ? `<a href="${p.github}" target="_blank" class="btn-ghost" style="margin-left:16px;color:var(--muted2)">GitHub</a>` : ''}
      ${p.live   ? `<a href="${p.live}"   target="_blank" class="btn-ghost" style="margin-left:16px;color:var(--muted2)">Live</a>` : ''}
    </div>
  </div>
</div>`;
}

/* ══════════════════════════════════════
   PROJECT DETAIL
══════════════════════════════════════ */
async function loadProjectDetail() {
  const container = document.getElementById('project-container');
  if (!container) return;
  const id = new URLSearchParams(window.location.search).get('id');
  if (!id) { container.innerHTML = '<p class="error-msg">Projecto não encontrado.</p>'; return; }
  try {
    const raw = await fetchMD(`content/projects/${id}.md`);
    const { meta, body } = parseFrontmatter(raw);
    document.title = `${meta.title} — Tiago Cabaça`;

    const hero = document.getElementById('project-hero');
    if (hero) {
      const stackTags = Array.isArray(meta.stack) ? meta.stack.map(t => `<span class="project-tag">${t}</span>`).join('') : '';
      hero.innerHTML = `
        <div class="container" style="position:relative;z-index:2">
          <div style="margin-bottom:12px"><a href="projects.html" style="font-family:var(--font-mono);font-size:11px;color:var(--muted2);letter-spacing:.08em">← Projectos</a></div>
          <div class="project-tags" style="margin-bottom:16px">${stackTags}</div>
          <h1 class="section-title">${meta.title}</h1>
          <div style="display:flex;gap:16px;margin-top:20px;flex-wrap:wrap">
            ${meta.live   ? `<a href="${meta.live}"   target="_blank" class="btn btn-primary">Ver live →</a>` : ''}
            ${meta.github ? `<a href="${meta.github}" target="_blank" class="btn btn-outline">GitHub →</a>` : ''}
          </div>
        </div>
        <div class="page-hero-bg">PROJECT</div>`;
    }

    const sidebar = document.getElementById('project-sidebar');
    if (sidebar) {
      const cats      = getCategories(meta);
      const catTags   = cats.map(c => `<span class="tag" style="margin:2px 4px 2px 0">${c}</span>`).join('');
      const stackList = Array.isArray(meta.stack) ? meta.stack.map(t => `<span class="tag" style="margin:2px 4px 2px 0">${t}</span>`).join('') : '';
      const statusColor = meta.status === 'Em produção' ? '#00e87a' : meta.status === 'Em desenvolvimento' ? 'var(--accent)' : 'var(--muted2)';
      sidebar.innerHTML = `
        <div class="detail-info-card">
          ${meta.year     ? `<div class="detail-info-row"><span>Ano</span><span>${meta.year}</span></div>` : ''}
          ${meta.type     ? `<div class="detail-info-row"><span>Tipo</span><span>${meta.type}</span></div>` : ''}
          ${meta.duration ? `<div class="detail-info-row"><span>Duração</span><span>${meta.duration}</span></div>` : ''}
          ${meta.status   ? `<div class="detail-info-row"><span>Estado</span><span style="color:${statusColor};font-family:var(--font-mono);font-size:11px">● ${meta.status}</span></div>` : ''}
          ${cats.length   ? `<div class="detail-info-row" style="flex-direction:column;align-items:flex-start;gap:6px"><span style="font-family:var(--font-mono);font-size:11px;color:var(--muted)">Categorias</span><div>${catTags}</div></div>` : ''}
          ${meta.stack    ? `<div class="detail-info-row" style="flex-direction:column;align-items:flex-start;gap:8px;border-bottom:none"><span style="font-family:var(--font-mono);font-size:11px;color:var(--muted)">Stack</span><div>${stackList}</div></div>` : ''}
        </div>`;
    }

    const processed = processBlocks(body);
    const html      = renderMarkdown(processed);
    const bodyEl    = document.getElementById('project-body');
    if (bodyEl) bodyEl.innerHTML = html;

    initCarousels(); initReveal(); initTOCSpy(); initBodyMediaErrors();
    loadRelatedProjects(id);
  } catch (e) {
    container.innerHTML = '<p class="error-msg">Não foi possível carregar o projecto.</p>';
    console.error(e);
  }
}

async function loadRelatedProjects(currentId) {
  const el = document.getElementById('related-projects');
  if (!el) return;
  try {
    const index  = await fetchMD('data/projects-index.json').then(t => JSON.parse(t));
    const others = await Promise.all(index.filter(id => id !== currentId).slice(0, 3).map(async (id, i) => {
      const raw = await fetchMD(`content/projects/${id}.md`);
      const { meta } = parseFrontmatter(raw);
      return { id, num: String(i + 1).padStart(2, '0'), ...meta };
    }));
    el.innerHTML = others.map(p => projectCard(p)).join('');
  } catch {}
}

/* ══════════════════════════════════════
   INDEX PREVIEWS
══════════════════════════════════════ */
async function loadIndexPreviews() {
  const projGrid = document.getElementById('index-projects');
  if (projGrid) {
    try {
      const index    = await fetchMD('data/projects-index.json').then(t => JSON.parse(t));
      const projects = await Promise.all(index.slice(0, 3).map(async (id, i) => {
        const raw = await fetchMD(`content/projects/${id}.md`);
        const { meta } = parseFrontmatter(raw);
        return { id, num: String(i + 1).padStart(2, '0'), ...meta };
      }));
      projGrid.innerHTML = projects.map(p => projectCard(p, 'pages/')).join('');
    } catch {}
  }

  const blogGrid = document.getElementById('index-blog');
  if (blogGrid) {
    try {
      const index = await fetchMD('data/posts-index.json').then(t => JSON.parse(t));
      const posts  = await Promise.all(index.slice(0, 3).map(async id => {
        const raw = await fetchMD(`content/posts/${id}.md`);
        const { meta } = parseFrontmatter(raw);
        return { id, ...meta };
      }));
      blogGrid.innerHTML = posts.map(p => blogCard(p, 'pages/')).join('');
    } catch {}
  }
}

/* ══════════════════════════════════════
   FILTROS — suporta múltiplas categorias
══════════════════════════════════════ */
function buildFilters(items, type) {
  const bar = document.getElementById(`${type}-filters`);
  if (!bar) return;
  const allCats = new Set();
  items.forEach(item => getCategories(item).forEach(c => allCats.add(c)));
  bar.innerHTML = [
    `<button class="filter-btn active" data-filter="all">Todos</button>`,
    ...[...allCats].map(c => `<button class="filter-btn" data-filter="${c}">${c}</button>`)
  ].join('');
}

function initFilters(type) {
  const bar    = document.getElementById(`${type}-filters`);
  const gridId = type === 'post' ? 'blog-grid' : 'projects-grid';
  const grid   = document.getElementById(gridId);
  if (!bar || !grid) return;
  bar.addEventListener('click', e => {
    const btn = e.target.closest('.filter-btn');
    if (!btn) return;
    bar.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const cat = btn.dataset.filter;
    grid.querySelectorAll('[data-category]').forEach(card => {
      if (cat === 'all') { card.style.display = ''; return; }
      card.style.display = card.dataset.category.split(',').includes(cat) ? '' : 'none';
    });
  });
}

/* ══════════════════════════════════════
   SEARCH
══════════════════════════════════════ */
function initSearch() {
  const input = document.querySelector('.blog-search');
  if (!input) return;
  input.addEventListener('input', () => {
    const q = input.value.toLowerCase().trim();
    document.querySelectorAll('.blog-card').forEach(card => {
      const title = card.querySelector('.blog-title')?.textContent.toLowerCase() || '';
      const cats  = (card.dataset.category || '').toLowerCase();
      const exc   = card.querySelector('.blog-excerpt')?.textContent.toLowerCase() || '';
      card.style.display = (!q || title.includes(q) || cats.includes(q) || exc.includes(q)) ? '' : 'none';
    });
  });
}

/* ══════════════════════════════════════
   INIT
══════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  const path = window.location.pathname;
  if (path.endsWith('index.html') || path === '/' || path.endsWith('/'))   loadIndexPreviews();
  if (path.includes('blog.html') && !path.includes('blog-post'))           { loadBlogList(); initSearch(); }
  if (path.includes('blog-post.html'))                                      loadBlogPost();
  if (path.includes('projects.html') && !path.includes('project-detail'))  loadProjectsList();
  if (path.includes('project-detail.html'))                                 loadProjectDetail();
  initReveal();
});
