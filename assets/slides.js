(() => {
  'use strict';
  const slides = [...document.querySelectorAll('#deck > .slide')];
  const total = slides.length;
  const deck = document.getElementById('deck');
  const viewport = document.getElementById('viewport');
  const dialog = document.getElementById('overview-dialog');
  let current = 0, overviewBuilt = false;
  const fromHash = () => Math.max(0, Math.min(total - 1, (parseInt(location.hash.slice(1), 10) || 1) - 1));
  function fit() {
    const r = viewport.getBoundingClientRect();
    deck.style.transform = 'scale(' + Math.min(r.width / 1920, r.height / 1080) + ')';
    document.querySelectorAll('.overview-thumb').forEach(t => {
      t.firstElementChild.style.transform = 'scale(' + t.clientWidth / 1920 + ')';
    });
  }
  function show(n, update = true) {
    current = Math.max(0, Math.min(total - 1, n));
    slides.forEach((s, i) => {
      s.classList.toggle('active', i === current);
      s.setAttribute('aria-hidden', i === current ? 'false' : 'true');
      s.inert = i !== current;
    });
    document.getElementById('counter').textContent = (current + 1) + ' / ' + total;
    document.getElementById('prev').disabled = current === 0;
    document.getElementById('next').disabled = current === total - 1;
    document.title = (current + 1) + ' / ' + total + ' · ' + slides[current].dataset.title;
    if (update) history.replaceState(null, '', '#' + (current + 1));
    document.querySelectorAll('.overview-item').forEach((b, i) => b.classList.toggle('current', i === current));
  }
  function overview() {
    if (!overviewBuilt) {
      const grid = document.getElementById('overview-grid');
      slides.forEach((s, i) => {
        const button = document.createElement('button');
        button.className = 'overview-item';
        button.setAttribute('aria-label', (i + 1) + '페이지 ' + s.dataset.title);
        const thumb = document.createElement('div');
        thumb.className = 'overview-thumb'; thumb.setAttribute('aria-hidden', 'true');
        const clone = s.cloneNode(true);
        clone.removeAttribute('id'); clone.removeAttribute('aria-hidden'); clone.inert = true;
        clone.querySelectorAll('[id]').forEach(el => el.removeAttribute('id'));
        clone.querySelectorAll('a').forEach(a => a.removeAttribute('href'));
        clone.classList.remove('active'); thumb.append(clone);
        const caption = document.createElement('div'); caption.className = 'overview-title';
        const number = document.createElement('b'); number.textContent = String(i + 1).padStart(2, '0');
        const text = document.createElement('span'); text.textContent = s.dataset.title;
        caption.append(number, text); button.append(thumb, caption);
        button.addEventListener('click', () => { show(i); dialog.close(); });
        grid.append(button);
      });
      overviewBuilt = true;
    }
    show(current); dialog.showModal(); requestAnimationFrame(fit);
    const b = document.querySelector('.overview-item.current');
    if (b) { b.focus({ preventScroll: true }); b.scrollIntoView({ block: 'nearest' }); }
  }
  async function fullscreen() {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await document.documentElement.requestFullscreen();
    } catch { document.getElementById('fullscreen').textContent = '브라우저 F11 사용'; }
  }
  document.getElementById('prev').addEventListener('click', () => show(current - 1));
  document.getElementById('next').addEventListener('click', () => show(current + 1));
  document.getElementById('overview').addEventListener('click', overview);
  document.getElementById('close-overview').addEventListener('click', () => dialog.close());
  document.getElementById('fullscreen').addEventListener('click', fullscreen);
  document.getElementById('print').addEventListener('click', () => window.print());
  document.addEventListener('fullscreenchange', () => {
    document.getElementById('fullscreen').innerHTML = document.fullscreenElement ? '화면 복귀 <kbd>F</kbd>' : '전체 화면 <kbd>F</kbd>';
    fit();
  });
  window.addEventListener('hashchange', () => show(fromHash(), false));
  window.addEventListener('resize', fit);
  document.addEventListener('keydown', e => {
    if (dialog.open || e.altKey || e.ctrlKey || e.metaKey) return;
    if (['INPUT','TEXTAREA','SELECT','BUTTON','A'].includes(document.activeElement.tagName) && [' ','Enter'].includes(e.key)) return;
    if (['ArrowRight','ArrowDown','PageDown',' '].includes(e.key)) { e.preventDefault(); show(current + 1); }
    else if (['ArrowLeft','ArrowUp','PageUp'].includes(e.key)) { e.preventDefault(); show(current - 1); }
    else if (e.key === 'Home') { e.preventDefault(); show(0); }
    else if (e.key === 'End') { e.preventDefault(); show(total - 1); }
    else if (e.key.toLowerCase() === 'o') { e.preventDefault(); overview(); }
    else if (e.key.toLowerCase() === 'f') { e.preventDefault(); fullscreen(); }
  });
  window.addEventListener('beforeprint', () => slides.forEach(s => { s.inert = false; s.setAttribute('aria-hidden','false'); }));
  window.addEventListener('afterprint', () => show(current, false));
  show(fromHash(), false); fit(); document.fonts.ready.then(fit);
})();
