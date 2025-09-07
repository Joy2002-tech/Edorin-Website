/* Logo list (case-sensitive!) */
const logos = [
  'assets/Ashok.png','assets/ITC.png','assets/LIC.png','assets/RIL.png',
  'assets/SBI.png','assets/Tata.png','assets/ULTRA.png','assets/hdfc.png','assets/info.png'
];

/* MAIN bubble rotation */
const mainImg = document.getElementById('mainImg');
const mainBubble = document.getElementById('mainBubble');
let mainIndex = 0;
function showMain(idx){
  mainImg.classList.remove('show');
  mainBubble.classList.remove('pop');
  setTimeout(()=>{
    const src = logos[idx % logos.length] || '';
    mainImg.src = src;
    mainBubble.classList.add('pop');
    void mainImg.offsetWidth;
    mainImg.classList.add('show');
  }, 160);
}
showMain(mainIndex);
setInterval(()=>{ mainIndex = (mainIndex + 1) % logos.length; showMain(mainIndex); }, 4000);
mainBubble.addEventListener('click', ()=>{ mainIndex = (mainIndex + 1) % logos.length; showMain(mainIndex); });

/* Continuous side bubble flow */
function spawnBubble(columnId){
  const col=document.getElementById(columnId);
  if(!col) return;
  const div=document.createElement('div');
  div.className='side-bubble';
  const img=document.createElement('img');
  img.src = logos[Math.floor(Math.random()*logos.length)];
  div.appendChild(img);
  col.appendChild(div);
  // remove after animation ends (12s)
  setTimeout(()=>{ if(div && div.parentNode) div.parentNode.removeChild(div); },12000);
}
setInterval(()=>spawnBubble('leftBubbles'),2000);
setInterval(()=>spawnBubble('rightBubbles'),2200);

/* Interactive card button ripple + toast (for the two Our Edge cards) */
document.addEventListener('DOMContentLoaded', () => {
  const toast = document.createElement('div');
  toast.id = 'toast';
  toast.className = 'toast';
  document.body.appendChild(toast);

  document.querySelectorAll('.btn').forEach(btn=>{
    btn.addEventListener('click', function(e){
      // ripple
      const rect = btn.getBoundingClientRect();
      const ripple = document.createElement('span');
      ripple.className = 'ripple';
      const size = Math.max(rect.width, rect.height) * 1.3;
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = (e.clientX - rect.left - size/2) + 'px';
      ripple.style.top = (e.clientY - rect.top - size/2) + 'px';
      btn.appendChild(ripple);
      requestAnimationFrame(()=>{ ripple.style.transform = 'scale(1)'; ripple.style.opacity = '0'; });
      setTimeout(()=>ripple.remove(),520);

      // toast
      toast.textContent = btn.dataset.msg || 'Thanks';
      toast.classList.add('show');
      clearTimeout(window._toastTimer);
      window._toastTimer = setTimeout(()=>{ toast.classList.remove('show'); }, 1500);
    });
    // keyboard activation
    btn.addEventListener('keydown', function(e){ if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); btn.click(); } });
  });
});



/* Responsive parallax handler */
document.addEventListener('DOMContentLoaded', () => {
  const hero = document.querySelector('.hero');

  function enableParallax() {
    if (!hero) return;
    if (window.innerWidth < 900) {
      hero.style.backgroundPosition = 'center center';
      return;
    }
    const handler = () => {
      const scrolled = window.scrollY;
      const y = Math.max(-50, Math.min(50, scrolled * 0.12));
      hero.style.backgroundPosition = `center calc(50% + ${y}px)`;
    };
    window.removeEventListener('scroll', hero._parallaxHandler);
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
});
