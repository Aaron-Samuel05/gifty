/* ==========================================
   ANISHKA'S SPECIAL WEBSITE - INTERACTIVE LOGIC
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
  // --- 1. Floating Background Particle Engine ---
  initBackgroundCanvas();
  // --- 2. Real-Time Love Counter ---
  initLoveCounter();
  // --- 3. Gallery Lightbox & Like Counter ---
  initGalleryAndLightbox();
  // --- 4. Interactive Flip Cards ---
  initFlipCards();
  // --- 5. Secret Lockbox & Envelope ---
  initSecretEnvelope();
  // --- 6. Mini Game: Catch Hearts ---
  initMiniGame();
  // --- 7. Theme Switcher ---
  initThemeToggle();
  // --- 8. Audio Synthesizer (Melody & SFX) ---
  initAudioSynthesizer();
});

function initBackgroundCanvas() {
  const canvas = document.getElementById('bg-canvas'); if (!canvas) return;
  const ctx = canvas.getContext('2d'); let width=canvas.width=innerWidth,height=canvas.height=innerHeight;
  addEventListener('resize',()=>{width=canvas.width=innerWidth;height=canvas.height=innerHeight});
  const particles=[], symbols=['💖','💕','✨','🌸','💘','💫'];
  class Particle{constructor(){this.reset()}reset(){this.x=Math.random()*width;this.y=height+20;this.size=Math.random()*16+12;this.speedY=Math.random()*1.5+.5;this.speedX=(Math.random()-.5)*.8;this.symbol=symbols[Math.floor(Math.random()*symbols.length)];this.opacity=Math.random()*.6+.3;this.rotation=Math.random()*Math.PI*2;this.rotSpeed=(Math.random()-.5)*.02}update(){this.y-=this.speedY;this.x+=Math.sin(this.y*.01)+this.speedX;this.rotation+=this.rotSpeed;if(this.y<-30)this.reset()}draw(){ctx.save();ctx.globalAlpha=this.opacity;ctx.translate(this.x,this.y);ctx.rotate(this.rotation);ctx.font=`${this.size}px sans-serif`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(this.symbol,0,0);ctx.restore()}}
  for(let i=0;i<28;i++)particles.push(new Particle()); const sparks=[];
  addEventListener('mousemove',e=>{if(Math.random()<.3)sparks.push({x:e.clientX,y:e.clientY,size:Math.random()*8+4,color:`hsl(${Math.random()*40+330},100%,75%)`,alpha:1,vx:(Math.random()-.5)*2,vy:(Math.random()-.5)*2})});
  function animate(){ctx.clearRect(0,0,width,height);particles.forEach(p=>{p.update();p.draw()});for(let i=sparks.length-1;i>=0;i--){const s=sparks[i];s.x+=s.vx;s.y+=s.vy;s.alpha-=.03;if(s.alpha<=0){sparks.splice(i,1);continue}ctx.save();ctx.globalAlpha=s.alpha;ctx.fillStyle=s.color;ctx.beginPath();ctx.arc(s.x,s.y,s.size,0,Math.PI*2);ctx.fill();ctx.restore()}requestAnimationFrame(animate)} animate();
}

function initLoveCounter(){const startDate=new Date('2026-02-12T17:00:00');const d=document.getElementById('timer-days'),h=document.getElementById('timer-hours'),m=document.getElementById('timer-mins'),s=document.getElementById('timer-secs');if(!d)return;function update(){const diff=Math.abs(Date.now()-startDate.getTime());d.textContent=String(Math.floor(diff/86400000)).padStart(2,'0');h.textContent=String(Math.floor(diff/3600000)%24).padStart(2,'0');m.textContent=String(Math.floor(diff/60000)%60).padStart(2,'0');s.textContent=String(Math.floor(diff/1000)%60).padStart(2,'0')}update();setInterval(update,1000)}

function initGalleryAndLightbox(){const cards=document.querySelectorAll('.polaroid-card');const filterBtns=document.querySelectorAll('.filter-btn[data-filter]');const lightbox=document.getElementById('lightbox-modal');const lightboxImg=document.getElementById('lightbox-img');const lightboxCaption=document.getElementById('lightbox-caption');const closeBtn=document.getElementById('lightbox-close');const prevBtn=document.getElementById('lightbox-prev');const nextBtn=document.getElementById('lightbox-next');const styleBtns=document.querySelectorAll('.lightbox-tools .filter-btn');let currentIndex=0;filterBtns.forEach(btn=>btn.addEventListener('click',()=>{filterBtns.forEach(b=>b.classList.remove('active'));btn.classList.add('active');const cat=btn.dataset.filter;cards.forEach(card=>card.style.display=cat==='all'||card.dataset.category===cat?'block':'none');playPopSFX(600)}));cards.forEach(card=>card.addEventListener('click',e=>{if(e.target.closest('.like-btn'))return;currentIndex=parseInt(card.dataset.index,10);openLightbox(currentIndex)}));function openLightbox(index){const card=document.querySelector(`.polaroid-card[data-index="${index}"]`);if(!card)return;const img=card.querySelector('.polaroid-img'),caption=card.querySelector('.polaroid-caption');lightboxImg.src=img.src;lightboxCaption.textContent=caption.textContent;lightbox.classList.add('active');lightboxImg.className='lightbox-img filter-normal';styleBtns.forEach(b=>b.classList.remove('active'));styleBtns[0].classList.add('active');playPopSFX(700)}function closeLightbox(){lightbox.classList.remove('active')}closeBtn?.addEventListener('click',closeLightbox);lightbox?.addEventListener('click',e=>{if(e.target===lightbox)closeLightbox()});prevBtn?.addEventListener('click',()=>{currentIndex=(currentIndex-1+cards.length)%cards.length;openLightbox(currentIndex)});nextBtn?.addEventListener('click',()=>{currentIndex=(currentIndex+1)%cards.length;openLightbox(currentIndex)});document.addEventListener('keydown',e=>{if(!lightbox.classList.contains('active'))return;if(e.key==='Escape')closeLightbox();if(e.key==='ArrowLeft')prevBtn.click();if(e.key==='ArrowRight')nextBtn.click()});styleBtns.forEach(btn=>btn.addEventListener('click',()=>{styleBtns.forEach(b=>b.classList.remove('active'));btn.classList.add('active');lightboxImg.className=`lightbox-img filter-${btn.dataset.style}`;playPopSFX(800)}));document.querySelectorAll('.like-btn').forEach(btn=>btn.addEventListener('click',e=>{e.stopPropagation();const countEl=btn.querySelector('.like-count');let count=parseInt(countEl.textContent,10);if(btn.classList.contains('liked')){btn.classList.remove('liked');countEl.textContent=count-1}else{btn.classList.add('liked');countEl.textContent=count+1;triggerFloatingHeart(e.clientX,e.clientY);playPopSFX(950)}}))}
function triggerFloatingHeart(x,y){for(let i=0;i<6;i++){const el=document.createElement('div');el.textContent='💖';Object.assign(el.style,{position:'fixed',left:`${x}px`,top:`${y}px`,pointerEvents:'none',zIndex:'9999',fontSize:`${Math.random()*16+20}px`,transition:'all 1s cubic-bezier(.175,.885,.32,1.275)'});document.body.appendChild(el);setTimeout(()=>{el.style.transform=`translate(${(Math.random()-.5)*120}px,-${Math.random()*100+50}px) scale(1.5)`;el.style.opacity='0'},10);setTimeout(()=>el.remove(),1000)}}
function initFlipCards(){document.querySelectorAll('.flip-card').forEach(card=>card.addEventListener('click',()=>{card.classList.toggle('flipped');playPopSFX(500)}))}

function initSecretEnvelope(){
  const form=document.getElementById('secret-form');
  const input=document.getElementById('passcode-input');
  const envelopeWrapper=document.getElementById('envelope-wrapper');
  const envelope=document.getElementById('envelope');
  const letterContent=document.getElementById('letter-content');
  if(!form)return;

  // The actual secret password is: Anishka
  const SECRET_PASSWORD='Anishka';

  form.addEventListener('submit',e=>{
    e.preventDefault();
    const entered=(input?.value||'').trim();
    if(entered.toLowerCase()!==SECRET_PASSWORD.toLowerCase()){
      input?.classList.remove('secret-wrong');
      void input?.offsetWidth;
      input?.classList.add('secret-wrong');
      if(input) input.value='';
      alert('💌 Nope! That is not the secret password. Try again 💕');
      return;
    }
    envelopeWrapper.classList.add('active');
    envelopeWrapper.scrollIntoView({behavior:'smooth',block:'center'});
    playPopSFX(750);
  });

  envelope?.addEventListener('click',()=>{
    envelope.classList.add('open');
    setTimeout(()=>{
      letterContent.classList.add('show');
      letterContent.scrollIntoView({behavior:'smooth',block:'center'});
      playPopSFX(900);
    },600);
  });
}

function initMiniGame(){const canvas=document.getElementById('game-canvas'),startBtn=document.getElementById('start-game-btn'),scoreEl=document.getElementById('game-score');if(!canvas||!startBtn)return;const ctx=canvas.getContext('2d');let playing=false,score=0,animationId=null,hearts=[];function resize(){const r=canvas.getBoundingClientRect();canvas.width=r.width;canvas.height=380}resize();addEventListener('resize',resize);class FallingHeart{constructor(){this.reset()}reset(){this.x=Math.random()*(canvas.width-40)+20;this.y=-30;this.speed=Math.random()*2+1.5;this.radius=Math.random()*10+16}update(){this.y+=this.speed;if(this.y>canvas.height+30)this.reset()}draw(){ctx.font=`${this.radius*1.5}px sans-serif`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('💖',this.x,this.y)}}function loop(){if(!playing)return;ctx.clearRect(0,0,canvas.width,canvas.height);if(hearts.length<10&&Math.random()<.05)hearts.push(new FallingHeart());hearts.forEach(h=>{h.update();h.draw()});animationId=requestAnimationFrame(loop)}startBtn.addEventListener('click',()=>{playing=true;score=0;scoreEl.textContent=0;hearts=[];startBtn.textContent='Restart Game 🔄';cancelAnimationFrame(animationId);loop();playPopSFX(800)});function hit(e){if(!playing)return;const r=canvas.getBoundingClientRect(),x=e.clientX-r.left,y=e.clientY-r.top;for(let i=hearts.length-1;i>=0;i--){const h=hearts[i];if(Math.hypot(x-h.x,y-h.y)<h.radius*2){score++;scoreEl.textContent=score;hearts.splice(i,1);playPopSFX(1000+score*50);if(score===10)alert("🎉 Awesome! Anishka scored 10 Hearts! You're super fast! 💕");else if(score===25)alert("👑 Master Heart Catcher! Anishka wins the Golden Heart Trophy! 🏆💖");break}}}canvas.addEventListener('click',hit);canvas.addEventListener('touchstart',e=>{e.preventDefault();if(e.touches.length)hit(e.touches[0])})}
function initThemeToggle(){const btn=document.getElementById('theme-toggle'),html=document.documentElement;btn?.addEventListener('click',()=>{const theme=html.getAttribute('data-theme'),next=theme==='cool'?'cute':'cool';html.setAttribute('data-theme',next);btn.textContent=next==='cool'?'🌙':'✨';playPopSFX(650)})}
let audioCtx=null,bgAudio=null,isAudioPlaying=false;function initAudioSynthesizer(){const btn=document.getElementById('audio-toggle');if(!btn)return;bgAudio=new Audio('Earrings.mp3');bgAudio.loop=true;bgAudio.volume=0;bgAudio.preload='auto';btn.addEventListener('click',()=>{if(!audioCtx)audioCtx=new(window.AudioContext||window.webkitAudioContext)();if(audioCtx.state==='suspended')audioCtx.resume();if(isAudioPlaying){fadeAudio(bgAudio,0,600,()=>bgAudio.pause());btn.classList.remove('playing');btn.textContent='🎵';isAudioPlaying=false}else{bgAudio.play().then(()=>fadeAudio(bgAudio,.75,800)).catch(()=>{});btn.classList.add('playing');btn.textContent='🎶';isAudioPlaying=true}playPopSFX(700)})}
function fadeAudio(audio,target,duration,done){const start=audio.volume,diff=target-start,steps=30,stepTime=duration/steps;let step=0;const timer=setInterval(()=>{step++;audio.volume=Math.min(1,Math.max(0,start+diff*(step/steps)));if(step>=steps){clearInterval(timer);if(done)done()}},stepTime)}
function playPopSFX(freq=800){try{const ctx=audioCtx||new(window.AudioContext||window.webkitAudioContext)(),osc=ctx.createOscillator(),gain=ctx.createGain();osc.type='sine';osc.frequency.setValueAtTime(freq,ctx.currentTime);osc.frequency.exponentialRampToValueAtTime(freq*1.5,ctx.currentTime+.1);gain.gain.setValueAtTime(.15,ctx.currentTime);gain.gain.exponentialRampToValueAtTime(.001,ctx.currentTime+.12);osc.connect(gain);gain.connect(ctx.destination);osc.start();osc.stop(ctx.currentTime+.12)}catch(e){}}
