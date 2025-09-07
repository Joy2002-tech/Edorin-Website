/* Edorin site script.js — improved and hardened
   - Ensures images get .loaded/.show on load
   - Safe guards for missing elements
   - Limits side-bubble count to prevent DOM bloat
   - Keeps ripple/toast and parallax functionality
*/

/* Logo list (case-sensitive!) */
const logos = [
  'assets/Ashok.png','assets/ITC.png','assets/LIC.png','assets/RIL.png',
  'assets/SBI.png','assets/Tata.png','assets/ULTRA.png','assets/hdfc.png','assets/info.png'
];

/* Small utility: set an img src safely and attach load/error handlers */
function safeSetImgSrc(imgEl, src, opts = {}) {
  if (!imgEl) return;
  const fallback = opts.fallback || 'assets/info.png';
  imgEl.classList.remove('show', 'loaded');
  // remove previous handlers if any
  imgEl.onload = null;
  imgEl.onerror = null;

  imgEl.onload = () => {
    imgEl.classList.add('loaded', 'show');
    imgEl.style.opacity = ''; // ensure CSS no forced hidden
  };
  imgEl.onerror = () => {
    if (imgEl.src !== fallback) {
      imgEl.src = fallback;
    } else {
      imgEl.classList.add('loaded', 'show'); // still show placeholder
    }
  };
  imgEl.src = src || fallback;
}

/* We'll wire everything after DOM is ready */
document.addEventListener('DOMContentLoaded', () => {

  /* ---------------- MAIN bubble rotation ---------------- */
  const mainImg = document.getElementById('mainImg');
  const mainBubble = document.getElementById('mainBubble');
  let mainIndex = 0;
  let mainIntervalId = null;

  function showMain(idx) {
    if (!mainImg || !mainBubble) return;
    // small pop animation reset
    mainBubble.classList.remove('pop');
    void mainBubble.offsetWidth; // force reflow for restart

    const src = logos[idx % logos.length] || logos[0];
    safeSetImgSrc(mainImg, src, { fallback: 'assets/info.png' });

    // add pop after a tiny timeout so it feels snappy
    setTimeout(() => {
      mainBubble.classList.add('pop');
    }, 160);
  }

  if (mainImg && mainBubble) {
    showMain(mainIndex);
    mainIntervalId = setInterval(() => {
      mainIndex = (mainIndex + 1) % logos.length;
      showMain(mainIndex);
    }, 4000);

    mainBubble.addEventListener('click', () => {
      mainIndex = (mainIndex + 1) % logos.length;
      showMain(mainIndex);
      // restart interval so user interaction doesn't immediately flip again
      if (mainIntervalId) {
        clearInterval(mainIntervalId);
        mainIntervalId = setInterval(() => {
          mainIndex = (mainIndex + 1) % logos.length;
          showMain(mainIndex);
        }, 4000);
      }
    });
  }

  /* ---------------- Continuous side bubble flow ----------------
     spawnBubble will add a side-bubble, then remove it after the assumed
     animation duration. We limit max simultaneous bubbles to prevent DOM bloat.
  */
  const MAX_SIDE_BUBBLES = 8; // per column
  function spawnBubble(columnId) {
    const col = document.getElementById(columnId);
    if (!col) return;
    // limit children
    const existing = col.querySelectorAll('.side-bubble').length;
    if (existing >= MAX_SIDE_BUBBLES) return;

    const div = document.createElement('div');
    div.className = 'side-bubble';
    // optional: add tiny horizontal offset for variety (works if .side-bubble is not strictly centered)
    // div.style.left = `${Math.random() * 6 - 3}px`;

    const img = document.createElement('img');
    img.alt = 'logo';
    // pick random logo and set safely
    const src = logos[Math.floor(Math.random() * logos.length)];
    safeSetImgSrc(img, src, { fallback: 'assets/info.png' });

    div.appendChild(img);
    col.appendChild(div);

    // remove after animation ends (12s) — be safe and check parent
    setTimeout(() => {
      if (div && div.parentNode) div.parentNode.removeChild(div);
    }, 12000);
  }

  // start intervals only if columns exist
  const leftExists = !!document.getElementById('leftBubbles');
  const rightExists = !!document.getElementById('rightBubbles');
  let leftIntervalId = null, rightIntervalId = null;
  if (leftExists) leftIntervalId = setInterval(() => spawnBubble('leftBubbles'), 2000);
  if (rightExists) rightIntervalId = setInterval(() => spawnBubble('rightBubbles'), 2200);

  /* ---------------- Interactive card button ripple + toast ---------------- */
  // Create toast element once
  const toast = document.createElement('div');
  toast.id = 'toast';
  toast.className = 'toast';
  document.body.appendChild(toast);

  // Add ripple + toast to buttons with .btn
  document.querySelectorAll('.btn').forEach(btn => {
    // ensure button is focusable & keyboard friendly
    btn.tabIndex = btn.tabIndex || 0;

    btn.addEventListener('click', function (e) {
      // ripple effect
      const rect = btn.getBoundingClientRect();
      const ripple = document.createElement('span');
      ripple.className = 'ripple';
      const size = Math.max(rect.width, rect.height) * 1.3;
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
      ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
      btn.appendChild(ripple);
      // animate (CSS transitions in your stylesheet handle transform/opacity)
      requestAnimationFrame(() => {
        ripple.style.transform = 'scale(1)';
        ripple.style.opacity = '0';
      });
      setTimeout(() => ripple.remove(), 520);

      // toast text comes from data-msg attribute or fallback
      const msg = btn.dataset.msg || 'Thanks — opening...';
      toast.textContent = msg;
      toast.classList.add('show');
      clearTimeout(window._toastTimer);
      window._toastTimer = setTimeout(() => { toast.classList.remove('show'); }, 1500);
    });

    // keyboard activation (Enter / Space)
    btn.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        btn.click();
      }
    });
  });

  /* ---------------- small image loader helper for all images on the page --------------
     This ensures images that are already in the DOM get a 'loaded' class so your CSS
     transitions (opacity, .show) work reliably.
  */
  document.querySelectorAll('img').forEach(img => {
    if (img.complete && img.naturalWidth !== 0) {
      img.classList.add('loaded', 'show');
      img.style.opacity = ''; // ensure visible
    } else {
      img.addEventListener('load', () => {
        img.classList.add('loaded', 'show');
        img.style.opacity = '';
      });
      img.addEventListener('error', () => {
        // fallback if image fails to load
        if (!img.src.includes('info.png')) {
          img.src = 'assets/info.png';
        } else {
          img.classList.add('loaded', 'show');
        }
      });
    }
  });

  /* ---------------- Responsive parallax handler ---------------- */
  const hero = document.querySelector('.hero');

  function enableParallax() {
    if (!hero) return;
    if (window.innerWidth < 900) {
      hero.style.backgroundPosition = 'center center';
      // remove handler if present
      if (hero._parallaxHandler) {
        window.removeEventListener('scroll', hero._parallaxHandler);
        hero._parallaxHandler = null;
      }
      return;
    }
    const handler = () => {
      const scrolled = window.scrollY || window.pageYOffset;
      const y = Math.max(-50, Math.min(50, scrolled * 0.12));
      hero.style.backgroundPosition = `center calc(50% + ${y}px)`;
    };
    // ensure we don't double-add
    if (hero._parallaxHandler) window.removeEventListener('scroll', hero._parallaxHandler);
    hero._parallaxHandler = handler;
    window.addEventListener('scroll', handler, { passive: true });
    handler();
  }

  enableParallax();
  let resT;
  window.addEventListener('resize', () => {
    clearTimeout(resT);
    resT = setTimeout(enableParallax, 180);
  });

  /* ---------------- expose cleanup helper for dev (optional) ---------------- */
  // window._edorinCleanup = () => {
  //   if (mainIntervalId) clearInterval(mainIntervalId);
  //   if (leftIntervalId) clearInterval(leftIntervalId);
  //   if (rightIntervalId) clearInterval(rightIntervalId);
  //   if (hero && hero._parallaxHandler) window.removeEventListener('scroll', hero._parallaxHandler);
  // };

}); // DOMContentLoaded end
