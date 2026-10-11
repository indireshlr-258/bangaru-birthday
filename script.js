'use strict';
const $=s=>document.querySelector(s),slides=[...document.querySelectorAll('.slide')],dots=$('#dots');
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;let current=0,changing=false;
slides.forEach((slide,i)=>{const b=document.createElement('button');b.type='button';b.setAttribute('aria-label',`Go to slide ${i+1}`);b.addEventListener('click',()=>go(i));dots.append(b)});
function update(){slides.forEach((s,i)=>{const active=i===current;s.classList.toggle('active',active);s.setAttribute('aria-hidden',String(!active));s.inert=!active});[...dots.children].forEach((d,i)=>{d.classList.toggle('selected',i===current);if(i===current)d.setAttribute('aria-current','step');else d.removeAttribute('aria-current')});$('#counter').textContent=`${current+1} / ${slides.length}`;$('#backBtn').disabled=current===0;$('#nextBtn').disabled=current===slides.length-1;$('#nextBtn').textContent=current===slides.length-1?'The end ♡':'Next →'}
function go(i){
  if(changing||$('#photoLock').open||i<0||i>=slides.length||i===current)return;
  changing=true;
  const previous=current;
  const direction=i>previous?'forward':'backward';
  const oldSlide=slides[previous];
  oldSlide.classList.remove('enter-from-left');
  oldSlide.classList.add(direction==='forward'?'exit-to-left':'exit-to-right');
  current=i;
  update();
  const nextSlide=slides[i];
  nextSlide.classList.remove('enter-from-left');
  if(direction==='backward')nextSlide.classList.add('enter-from-left');
  nextSlide.scrollTop=0;
  if(i===1)confetti(130);
  setTimeout(()=>{
    oldSlide.classList.remove('exit-to-left','exit-to-right');
    changing=false;
  },reduced?0:600);
}
update();$('#backBtn').onclick=()=>go(current-1);$('#nextBtn').onclick=()=>go(current+1);$('#beginBtn').onclick=()=>go(1);$('#celebrateBtn').onclick=()=>{confetti(150);go(2)};
document.addEventListener('keydown',e=>{if($('#photoLock').open||e.target.closest('input,button,textarea,select')||e.altKey||e.ctrlKey||e.metaKey)return;if(e.key==='ArrowRight')go(current+1);if(e.key==='ArrowLeft')go(current-1)});
let touch=null;document.addEventListener('touchstart',e=>{touch={x:e.changedTouches[0].clientX,y:e.changedTouches[0].clientY}},{passive:true});document.addEventListener('touchend',e=>{if(!touch||$('#photoLock').open)return;const dx=e.changedTouches[0].clientX-touch.x,dy=e.changedTouches[0].clientY-touch.y;if(Math.abs(dx)>75&&Math.abs(dx)>Math.abs(dy)*1.5)go(current+(dx<0?1:-1));touch=null},{passive:true});
const audio=$('#birthdayMusic'),musicBtn=$('#musicBtn');
let autoplayTried=false;
function syncMusic(){const playing=!audio.paused;musicBtn.setAttribute('aria-pressed',String(playing));$('#musicLabel').textContent=playing?'Pause song':'Play our song'}
async function startBirthdayMusic(){
  if(!audio.paused)return true;
  try{await audio.play();syncMusic();return true}
  catch(error){
    // Browsers often block autoplay until the visitor interacts with the page.
    if(error?.name==='NotAllowedError')$('#musicLabel').textContent='Tap to start song ♫';
    else $('#musicLabel').textContent='Add music file first';
    return false;
  }
}
// Try autoplay as soon as the page loads; if the browser blocks it, start on the first user gesture.
audio.volume=0.7;
audio.preload='auto';
if(!autoplayTried){autoplayTried=true;startBirthdayMusic()}
const startMusicOnFirstGesture=()=>{if(audio.paused)startBirthdayMusic();document.removeEventListener('pointerdown',startMusicOnFirstGesture);document.removeEventListener('keydown',startMusicOnFirstGesture)};
document.addEventListener('pointerdown',startMusicOnFirstGesture,{once:true});
document.addEventListener('keydown',startMusicOnFirstGesture,{once:true});
musicBtn.onclick=async()=>{if(audio.paused){await startBirthdayMusic()}else{audio.pause();syncMusic()}};
audio.addEventListener('pause',syncMusic);audio.addEventListener('play',syncMusic);audio.addEventListener('error',()=>{$('#musicLabel').textContent='Add music file first'});
$('#cakeBtn').onclick=()=>{
  const cake=$('#cakeBtn');
  const blown=cake.classList.toggle('blown');
  $('#cakeMessage').textContent=blown
    ?'A million hearts for you, Bangaru! You are loved more than words can say. ♡'
    :'Tap the cake to make another wish ✨';
  if(blown){
    confetti(320);
    const rect=cake.getBoundingClientRect();
    heartExplosion(rect.left+rect.width/2,rect.top+rect.height/2,420);
    showMillionHearts();
    cake.classList.remove('cake-celebrating');
    void cake.offsetWidth;
    cake.classList.add('cake-celebrating');
    setTimeout(()=>cake.classList.remove('cake-celebrating'),1000);
  }
};$('#finalBtn').onclick=e=>{confetti(260);e.currentTarget.textContent='Forever loved, Bangaru 💗';burst(innerWidth/2,innerHeight/2,22)};
if(!reduced){setInterval(()=>{if(document.hidden)return;const h=document.createElement('span');h.className='floating-heart';h.textContent=Math.random()>.5?'♡':'♥';h.style.left=Math.random()*100+'%';h.style.fontSize=12+Math.random()*19+'px';h.style.setProperty('--duration',7+Math.random()*7+'s');$('#hearts').append(h);h.addEventListener('animationend',()=>h.remove(),{once:true})},950)}
function burst(x,y,n=7){if(reduced)return;for(let i=0;i<n;i++){const h=document.createElement('span');h.className='burst-heart';h.textContent=i%3?'♡':'✧';h.style.left=x+'px';h.style.top=y+'px';h.style.setProperty('--dx',(Math.random()*220-110)+'px');h.style.setProperty('--dy',(Math.random()*70-35)+'px');document.body.append(h);h.addEventListener('animationend',()=>h.remove(),{once:true})}}
document.addEventListener('click',e=>{if(!$('#photoLock').open&&!e.target.closest('input,dialog')&&!reduced)burst(e.clientX,e.clientY,3)});
const canvas=$('#confetti'),ctx=canvas.getContext('2d');let particles=[],raf=0;function resize(){const d=Math.min(devicePixelRatio||1,2);canvas.width=innerWidth*d;canvas.height=innerHeight*d;ctx.setTransform(d,0,0,d,0,0)}resize();addEventListener('resize',resize);
function confetti(n){if(reduced)return;for(let i=0;i<n;i++)particles.push({x:innerWidth*(.15+Math.random()*.7),y:innerHeight*.28,vx:(Math.random()-.5)*8,vy:-3-Math.random()*7,life:120+Math.random()*50,rot:Math.random()*6,c:['#e875a0','#ffc4d8','#f5bb72','#d8a7eb'][i%4]});if(!raf)tick()}
function tick(){ctx.clearRect(0,0,innerWidth,innerHeight);particles=particles.filter(p=>p.life>0&&p.y<innerHeight+20);particles.forEach(p=>{p.x+=p.vx;p.y+=p.vy;p.vy+=.16;p.rot+=.08;p.life--;ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.rot);ctx.fillStyle=p.c;ctx.globalAlpha=Math.min(1,p.life/25);ctx.fillRect(-3,-5,6,10);ctx.restore()});raf=particles.length?requestAnimationFrame(tick):0}

// Hundreds of love hearts burst outward from the cake when it is tapped.
function heartExplosion(originX, originY, count=320){
  if(reduced){
    burst(originX,originY,18);
    return;
  }
  const symbols=['💗','💖','💕','💞','💘','❤️','♡','♥','💓'];
  const fragment=document.createDocumentFragment();
  for(let i=0;i<count;i++){
    const heart=document.createElement('span');
    heart.className='love-explosion-heart';
    heart.textContent=symbols[Math.floor(Math.random()*symbols.length)];
    const angle=Math.random()*Math.PI*2;
    // Random radial distance spreads hearts across and beyond the viewport.
    const distance=90+Math.random()*Math.max(innerWidth,innerHeight)*0.72;
    const dx=Math.cos(angle)*distance;
    const dy=Math.sin(angle)*distance;
    heart.style.left=`${originX}px`;
    heart.style.top=`${originY}px`;
    heart.style.setProperty('--dx',`${dx}px`);
    heart.style.setProperty('--dy',`${dy}px`);
    heart.style.setProperty('--turn',`${Math.random()*720-360}deg`);
    heart.style.setProperty('--size',`${14+Math.random()*24}px`);
    heart.style.setProperty('--duration',`${1.45+Math.random()*1.45}s`);
    heart.style.setProperty('--delay',`${Math.random()*420}ms`);
    fragment.appendChild(heart);
    heart.addEventListener('animationend',()=>heart.remove(),{once:true});
  }
  document.body.appendChild(fragment);
}

// Full-screen birthday celebration: a glowing burst of red and pink hearts.
function showMillionHearts(){
  const old=document.querySelector('.million-hearts-overlay');
  if(old)old.remove();
  const overlay=document.createElement('div');
  overlay.className='million-hearts-overlay';
  overlay.setAttribute('role','status');
  overlay.setAttribute('aria-label','A million hearts for Bangaru');
  const title=document.createElement('div');
  title.className='million-hearts-title';
  title.innerHTML='<span>A Million Hearts</span><small>For You, Bangaru! ♡</small>';
  const field=document.createElement('div');
  field.className='million-hearts-field';
  overlay.append(title,field);
  document.body.appendChild(overlay);
  const symbols=['♥','❤','💖','💗','💕','💘','♥','❤'];
  const total=reduced?24:260;
  for(let i=0;i<total;i++){
    const h=document.createElement('span');
    h.className='showcase-heart';
    h.textContent=symbols[Math.floor(Math.random()*symbols.length)];
    h.style.setProperty('--x',`${Math.random()*100}vw`);
    h.style.setProperty('--y',`${Math.random()*100}vh`);
    h.style.setProperty('--size',`${16+Math.random()*42}px`);
    h.style.setProperty('--delay',`${Math.random()*900}ms`);
    h.style.setProperty('--duration',`${2.2+Math.random()*2.2}s`);
    h.style.setProperty('--spin',`${Math.random()*100-50}deg`);
    field.appendChild(h);
  }
  // Keep the spectacular screen visible briefly, then return to the cake.
  const dismiss=()=>{overlay.classList.add('million-hearts-out');setTimeout(()=>overlay.remove(),500)};
  overlay.addEventListener('click',dismiss,{once:true});
  setTimeout(dismiss,4800);
}

// AES-GCM encrypted photo loading: encrypted data is public, passphrase stays local.
const dialog=$('#photoLock'),form=$('#unlockForm'),secret=$('#secret'),status=$('#unlockStatus'),images=[...document.querySelectorAll('img[data-photo]')];let photoUrls=[];
function bytes64(s){const b=atob(s),out=new Uint8Array(b.length);for(let i=0;i<b.length;i++)out[i]=b.charCodeAt(i);return out}
async function derive(pass,salt,iterations){const material=await crypto.subtle.importKey('raw',new TextEncoder().encode(pass),'PBKDF2',false,['deriveKey']);return crypto.subtle.deriveKey({name:'PBKDF2',salt,iterations,hash:'SHA-256'},material,{name:'AES-GCM',length:256},false,['decrypt'])}
async function unlock(pass){const r=await fetch('./encrypted-photos.json',{cache:'no-store'});if(!r.ok)throw Error('Encrypted photos not found');const pack=await r.json();if(pack.version!==1||pack.algorithm!=='AES-GCM'||pack.keyDerivation!=='PBKDF2-SHA-256'||pack.iterations!==600000||!Array.isArray(pack.photos))throw Error('Unsupported format');const key=await derive(pass,bytes64(pack.salt),pack.iterations),decoded=new Map();for(const p of pack.photos){if(!/^image\/(jpeg|png|webp|gif)$/.test(p.type))throw Error('Unsupported image type');const buf=await crypto.subtle.decrypt({name:'AES-GCM',iv:bytes64(p.iv)},key,bytes64(p.data));decoded.set(p.name,new Blob([buf],{type:p.type}))}for(const img of images){if(!decoded.has(img.dataset.photo))throw Error('Missing image')}const created=[];try{const urls=new Map();for(const [name,blob] of decoded){const url=URL.createObjectURL(blob);created.push(url);urls.set(name,url)}for(const img of images){img.src=urls.get(img.dataset.photo);img.hidden=false;img.previousElementSibling.hidden=true}photoUrls=created;return true}catch(e){created.forEach(URL.revokeObjectURL);throw e}}
form.addEventListener('submit',async e=>{e.preventDefault();const btn=form.querySelector('[type=submit]');btn.disabled=true;status.textContent='Decrypting locally…';try{await unlock(secret.value);secret.value='';status.textContent='';dialog.close()}catch(err){status.textContent='Unable to unlock. Check the passphrase and encrypted file.';console.warn('Unlock failed:',err.message)}finally{btn.disabled=false}});
$('#skipUnlock').onclick=()=>dialog.close();addEventListener('pagehide',()=>{photoUrls.forEach(URL.revokeObjectURL);photoUrls=[]});
// Opening panda greeting: require the secret phrase, then send exactly three red-heart kisses.
const pandaIntro=$('#pandaIntro');
const pandaAnswerForm=$('#pandaAnswerForm');
const pandaAnswer=$('#pandaAnswer');
const pandaAnswerBtn=$('#pandaAnswerBtn');
let pandaIntroFinished=false;
let pandaKissesStarted=false;
function finishPandaIntro(){
  if(pandaIntroFinished)return;
  pandaIntroFinished=true;
  pandaIntro.classList.add('panda-intro-out');
  setTimeout(()=>{
    pandaIntro.remove();
    startBalloonGame();
  },reduced?0:450);
}
function startPandaKisses(){
  if(pandaKissesStarted)return;
  pandaKissesStarted=true;
  const trail=$('#pandaKissTrail'),count=$('#pandaKissCount');
  const kisses=['❤️','💋❤️','❤️'];
  pandaIntro.classList.add('panda-celebrating');
  kisses.forEach((kiss,i)=>{
    const item=document.createElement('span');
    item.className='panda-kiss panda-red-kiss';
    item.textContent=kiss;
    item.style.setProperty('--kiss-x',`${(i-1)*105+(Math.random()*20-10)}px`);
    item.style.setProperty('--kiss-y',`${-135-Math.random()*55}px`);
    item.style.setProperty('--kiss-delay',`${i*420}ms`);
    trail.appendChild(item);
  });
  count.textContent='Three red-heart kisses, just for you! ❤️❤️❤️';
  pandaAnswer.disabled=true;
  pandaAnswerBtn.disabled=true;
  pandaAnswerForm.classList.add('panda-answer-complete');
  setTimeout(finishPandaIntro,reduced?700:3000);
}
function checkPandaAnswer(){
  if(pandaKissesStarted)return;
  const answer=pandaAnswer.value.trim().toLowerCase().replace(/[.!]+/g,'').replace(/\s+/g,' ');
  if(answer==='i lv my brother'){
    startPandaKisses();
  }else{
    $('#pandaKissCount').textContent='Almost! Type exactly: i lv my brother 💗';
    pandaAnswer.classList.remove('panda-input-shake');
    void pandaAnswer.offsetWidth;
    pandaAnswer.classList.add('panda-input-shake');
    pandaAnswer.focus();
  }
}
// Three-balloon mini game: every pop reveals one playful sibling joke.
const balloonGame=$('#balloonGame');
const balloonButtons=[...document.querySelectorAll('[data-balloon]')];
const balloonMessages=['monkey 🐒','aunty 😁','thika amikond mundhe nadi 😂🤣'];
let poppedBalloons=new Set();
function startBalloonGame(){
  poppedBalloons.clear();
  document.querySelectorAll('.balloon-item').forEach((item,i)=>{
    item.classList.remove('popped');
    item.querySelector('.balloon').disabled=false;
    item.querySelector('.balloon').hidden=false;
    item.querySelector('.balloon').setAttribute('aria-label',`Pop the ${['first','second','third'][i]} balloon`);
    const reveal=item.querySelector('.balloon-reveal');
    reveal.textContent=balloonMessages[i];
    reveal.style.animation='none';
    void reveal.offsetWidth;
    reveal.style.animation='';
  });
  $('#balloonStatus').textContent='0 of 3 balloons popped';
  $('#balloonContinue').hidden=true;
  balloonGame.hidden=false;
  balloonButtons[0]?.focus({preventScroll:true});
}
balloonButtons.forEach(button=>button.addEventListener('click',()=>{
  const index=Number(button.dataset.balloon);
  if(poppedBalloons.has(index))return;
  poppedBalloons.add(index);
  const item=button.closest('.balloon-item');
  item.classList.add('popped');
  button.disabled=true;
  $('#balloonStatus').textContent=`${poppedBalloons.size} of 3 balloons popped`;
  confetti(24);
  if(poppedBalloons.size===3){
    $('#balloonStatus').textContent='You popped them all! Certified comedy queen 😂💗';
    $('#balloonContinue').hidden=false;
    setTimeout(()=>$('#balloonContinue').focus({preventScroll:true}),350);
  }
}));
$('#balloonContinue').addEventListener('click',()=>{
  balloonGame.hidden=true;
  if(!crypto.subtle){status.textContent='Open on HTTPS or localhost for secure decryption.'}
  if(!dialog.open)dialog.showModal();
});
pandaAnswerForm.addEventListener('submit',e=>{e.preventDefault();checkPandaAnswer()});
// Also react as soon as the exact phrase is typed, so the button is optional.
pandaAnswer.addEventListener('input',()=>{
  const answer=pandaAnswer.value.trim().toLowerCase().replace(/[.!]+/g,'').replace(/\s+/g,' ');
  if(answer==='i lv my brother') startPandaKisses();
});
