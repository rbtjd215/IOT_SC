(() => {
  'use strict';
  const button = document.getElementById('motion');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let paused = false;
  try { paused = localStorage.getItem('iot-final-gray-motion-v1') === 'paused'; } catch {}
  function update() {
    document.documentElement.classList.toggle('motion-paused', paused || reduced.matches);
    button.setAttribute('aria-pressed', String(paused || reduced.matches));
    button.disabled = reduced.matches;
    button.innerHTML = reduced.matches ? '동작 줄이기 적용' : paused ? '모션 재생 <kbd>M</kbd>' : '모션 정지 <kbd>M</kbd>';
  }
  function toggle() {
    if (reduced.matches) return;
    paused = !paused;
    try { localStorage.setItem('iot-final-gray-motion-v1', paused ? 'paused' : 'playing'); } catch {}
    update();
  }
  button.addEventListener('click', toggle);
  document.addEventListener('keydown', e => {
    if (e.ctrlKey || e.metaKey || e.altKey || document.getElementById('overview-dialog').open) return;
    if (e.key.toLowerCase() === 'm') { e.preventDefault(); toggle(); }
  });
  reduced.addEventListener('change', update);
  update();
})();
