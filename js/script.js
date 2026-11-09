/* Growing Minds Child Development Center — site behaviour:
   nav menu, scroll reveal, milestone checker, 4-step booking form → WhatsApp,
   therapist auto-assignment, calendar, live Google Map on hosted domains. */
(function(){
const CLINIC_WA='919098070339';
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const store={get(k,d){try{return JSON.parse(localStorage.getItem(k))??d}catch(e){return d}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};
function toast(msg){const t=$('#toast');t.textContent=msg;t.classList.add('show');clearTimeout(t._h);t._h=setTimeout(()=>t.classList.remove('show'),2600)}
$('#yr').textContent=new Date().getFullYear();

/* nav */
const burger=$('#burger'),links=$('#links');
burger.addEventListener('click',()=>{const o=links.classList.toggle('open');burger.classList.toggle('x',o);burger.setAttribute('aria-expanded',o)});
links.addEventListener('click',e=>{if(e.target.closest('a')){links.classList.remove('open');burger.classList.remove('x');burger.setAttribute('aria-expanded',false)}});
addEventListener('scroll',()=>$('header').classList.toggle('scrolled',scrollY>10),{passive:true});

/* reveal */
const io=('IntersectionObserver' in window)?new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12}):null;
$$('.reveal').forEach(el=>io?io.observe(el):el.classList.add('in'));

/* service links prefill */
const TH={khyati:'Dr. Khyati Rana (Occupational Therapist)',nafees:'Nafees Khan (Speech Language Pathologist & Audiologist)',danish:'Danish Khan (Speech & Language Therapist)',team:'Growing Minds team (any available therapist)'};
function therFor(s){if(/speech|communication/i.test(s))return TH.nafees;if(/special education|ABA|behaviour analysis/i.test(s))return TH.team;return TH.khyati}
$('#service').addEventListener('change',()=>{$('#therapist').value=therFor($('#service').value)});
$$('[data-svc]').forEach(a=>a.addEventListener('click',()=>{const opt=[...$('#service').options].find(o=>o.text===a.dataset.svc);if(opt)$('#service').value=opt.value;$('#therapist').value=a.dataset.ther?TH[a.dataset.ther]:therFor($('#service').value);$('#f-service').classList.remove('invalid');if(typeof go==='function')try{go(1)}catch(e){}}));

/* milestones */
const M={
 '6–12 months':['Sits without support','Picks up small objects with thumb and finger','Crawls or moves around on the floor','Passes toys from one hand to the other','Responds to their name','Enjoys peek-a-boo and simple games'],
 '1–2 years':['Walks on their own','Scribbles with a crayon','Stacks 2–4 blocks','Drinks from a cup with little spilling','Points to show you things','Uses a spoon with some help'],
 '2–3 years':['Runs and climbs easily','Kicks a ball','Turns pages of a book one at a time','Copies a vertical line','Helps with undressing (e.g. removes socks)','Plays alongside other children'],
 '3–4 years':['Pedals a tricycle','Copies a circle','Uses child scissors to snip paper','Dresses with little help','Takes turns in simple games','Can calm down after being upset'],
 '4–5 years':['Hops on one foot','Draws a person with 2–4 body parts','Holds a pencil with fingers, not a fist','Uses the toilet independently','Follows 2–3 step instructions','Sits for a short activity (10+ min)'],
 '5–7 years':['Writes own name clearly','Cuts along a line with scissors','Buttons and zips clothes','Catches a small ball','Pays attention in class for short periods','Copes with changes in routine']
};
const tabs=$('#ageTabs');let cur=Object.keys(M)[2];
Object.keys(M).forEach(k=>{const b=document.createElement('button');b.type='button';b.role='tab';b.textContent=k;b.onclick=()=>{cur=k;renderM()};tabs.appendChild(b)});
function renderM(){
  $$('#ageTabs button').forEach(b=>b.setAttribute('aria-selected',b.textContent===cur));
  $('#mTitle').textContent='Age '+cur;
  $('#mList').innerHTML=M[cur].map((s,i)=>`<label class="check"><input type="checkbox" data-i="${i}"><span>${s}</span></label>`).join('');
  $('#mResult').className='result';
}
renderM();
$('#mCheck').onclick=()=>{
  const n=$$('#mList input:checked').length,t=M[cur].length,r=$('#mResult');
  if(n>=t-1){r.className='result show ok';r.innerHTML=`Great! Your child is doing ${n} of ${t} skills. They appear to be on track for this age. Keep playing and exploring together!`}
  else{r.className='result show warn';r.innerHTML=`Your child is doing ${n} of ${t} skills. Some skills may need support  that's very common, and early help makes a big difference. <a href="#book">Book a developmental assessment →</a>`}
};

/* booking */
const form=$('#bookForm');let step=1;const state={date:null,slot:null};
const panes=$$('.pane'),bars=$$('.prog div');
function go(n){step=n;panes.forEach(p=>p.classList.toggle('active',+p.dataset.step===n));bars.forEach((b,i)=>b.classList.toggle('on',i<Math.min(n,4)));
  const card=form.closest('.form-card');const top=card.getBoundingClientRect().top+scrollY-90;if(Math.abs(scrollY-top)>200)scrollTo({top,behavior:'smooth'});}
function setErr(id,bad){$(id).classList.toggle('invalid',bad);return !bad}
function validate(n){
  let ok=true;
  if(n===1){ok=setErr('#f-service',!$('#service').value)}
  if(n===2){ok=setErr('#f-slot',!state.date)}
  if(n===3){
    const ph=$('#phone').value.replace(/\D/g,'').replace(/^(91|0)(?=\d{10}$)/,'');
    ok=[setErr('#f-parent',$('#parent').value.trim().length<2),setErr('#f-phone',!/^[6-9]\d{9}$/.test(ph)),setErr('#f-child',!$('#child').value.trim()),setErr('#f-age',!$('#age').value)].every(Boolean);
  }
  if(n===4){ok=setErr('#f-consent',!$('#consent').checked)}
  if(!ok){const f=form.querySelector('.pane.active .invalid input,.pane.active .invalid select');f&&f.focus()}
  return ok;
}
form.addEventListener('click',e=>{
  if(e.target.closest('[data-next]')){if(validate(step)){if(step===3)buildSummary();go(step+1)}}
  if(e.target.closest('[data-prev]'))go(step-1);
});
['service','parent','phone','child','age','consent'].forEach(id=>$('#'+id).addEventListener('input',()=>$('#'+id).closest('.field')?.classList.remove('invalid')));
$('#consent').addEventListener('change',()=>$('#f-consent').classList.remove('invalid'));

/* live google map when hosted on her own domain (embeds are blocked inside claude.ai previews) */
(function(){const box=$('#mapBox');if(!box)return;const h=location.hostname;
  if(location.protocol.startsWith('http')&&!/claude|anthropic|claudeusercontent/.test(h)){const f=document.createElement('iframe');f.src=box.dataset.src;f.loading='lazy';f.title='Growing Minds Child Development Center on Google Maps';f.referrerPolicy='no-referrer-when-downgrade';box.innerHTML='';box.appendChild(f)}})();
/* online mode */
function syncMode(){const on=form.querySelector('[name=mode]:checked').value.startsWith('Online');$('#f-app').style.display=on?'block':'none'}
form.querySelectorAll('[name=mode]').forEach(r=>r.addEventListener('change',syncMode));
$('#bookOnline').onclick=()=>{$('#m2').checked=true;syncMode();go(1);document.getElementById('book').scrollIntoView({behavior:'smooth'})};
/* calendar */
const today=new Date();today.setHours(0,0,0,0);
const maxDate=new Date(today);maxDate.setDate(maxDate.getDate()+60);
let view=new Date(today.getFullYear(),today.getMonth(),1);
const fmtD=d=>d.toLocaleDateString('en-IN',{weekday:'short',day:'numeric',month:'short',year:'numeric'});
const key=d=>d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate();
function renderCal(){
  $('#calMonth').textContent=view.toLocaleDateString('en-IN',{month:'long',year:'numeric'});
  $('#calPrev').disabled=view<=new Date(today.getFullYear(),today.getMonth(),1);
  $('#calNext').disabled=new Date(view.getFullYear(),view.getMonth()+1,1)>maxDate;
  const g=$('#calGrid');g.innerHTML=['Mo','Tu','We','Th','Fr','Sa','Su'].map(d=>`<div class="dow">${d}</div>`).join('');
  const first=(view.getDay()+6)%7,days=new Date(view.getFullYear(),view.getMonth()+1,0).getDate();
  for(let i=0;i<first;i++)g.insertAdjacentHTML('beforeend','<span></span>');
  for(let d=1;d<=days;d++){
    const dt=new Date(view.getFullYear(),view.getMonth(),d);const b=document.createElement('button');b.type='button';b.textContent=d;
    const closed=dt.getDay()===0||dt.getDay()===6;b.disabled=dt<today||dt>maxDate||closed||(+dt===+today&&new Date().getHours()>=20);
    b.setAttribute('aria-label',fmtD(dt)+(closed?' (closed)':''));
    if(+dt===+today)b.classList.add('today');
    if(state.date&&+dt===+state.date)b.classList.add('sel');
    b.onclick=()=>{state.date=dt;renderCal();renderSlots();$('#f-slot').classList.remove('invalid')};
    g.appendChild(b);
  }
}
$('#calPrev').onclick=()=>{view.setMonth(view.getMonth()-1);renderCal()};
$('#calNext').onclick=()=>{view.setMonth(view.getMonth()+1);renderCal()};
function renderSlots(){
  const w=$('#slotWrap');
  if(!state.date){w.innerHTML='<div class="empty-slots">Select your preferred date. The exact appointment time will be shared when the clinic confirms your booking.</div>';return}
  w.innerHTML=`<div class="date-note"><b>Preferred date: ${fmtD(state.date)}</b><span> Your appointment time will be shared by the clinic on WhatsApp / call when your booking is confirmed.</span></div>`;
}
renderCal();

/* summary + submit */
function data(){return{service:$('#service').value,therapist:$('#therapist').value,mode:form.querySelector('[name=mode]:checked').value,app:$('#vapp').value,visit:$('#visit').value,date:fmtD(state.date),slot:state.slot,parent:$('#parent').value.trim(),phone:$('#phone').value.trim(),child:$('#child').value.trim(),age:$('#age').value,email:$('#email').value.trim(),concern:$('#concern').value.trim()}}
const esc=s=>s.replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
function buildSummary(){const d=data();const rows=[['Service',d.service],['Therapist',d.therapist],['Visit type',d.mode+(d.mode.startsWith('Online')?' ('+d.app+')':'')],['First visit?',d.visit],['Preferred date',d.date],['Time','Shared on confirmation'],['Parent',d.parent],['Mobile',d.phone],['Child',d.child+' ('+d.age+')']];if(d.email)rows.push(['Email',d.email]);if(d.concern)rows.push(['Concern',d.concern]);
  $('#summary').innerHTML=rows.map(([k,v])=>`<div><span>${k}</span><b>${esc(v)}</b></div>`).join('')}
let lastMsg='';
form.addEventListener('submit',e=>{
  e.preventDefault();if(!validate(4))return;
  const d=data(),ref='GM-'+Date.now().toString(36).toUpperCase().slice(-6);
  lastMsg=`*New Appointment Request  ${d.service.toUpperCase()}* (${ref})\n\n`+
   `Service: ${d.service}\nTherapist: ${d.therapist}\nVisit type: ${d.mode}${d.mode.startsWith('Online')?' via '+d.app:''}\nFirst visit: ${d.visit}\nPreferred date: ${d.date}\nTime: Please confirm a suitable time\n\n`+
   `Parent: ${d.parent}\nMobile: ${d.phone}\nChild: ${d.child} (${d.age})`+(d.email?`\nEmail: ${d.email}`:'')+(d.concern?`\nConcern: ${d.concern}`:'')+
   `\n\nPlease confirm my appointment. Thank you!`;
  $('#waSend').href=`https://wa.me/${CLINIC_WA}?text=${encodeURIComponent(lastMsg)}`;
  $('#refNo').textContent='Ref: '+ref;
  const list=store.get('gm_bookings',[]);list.push({ref,dkey:key(state.date),date:d.date,slot:d.slot,child:d.child,service:d.service});store.set('gm_bookings',list.slice(-10));
  renderMine();go(5);
});
$('#copyBtn').onclick=async()=>{try{await navigator.clipboard.writeText(lastMsg.replace(/\*/g,''));toast('Booking details copied')}catch(e){toast('Copy not available  please call +91 90980 70339')}};
$('#newBooking').onclick=e=>{e.preventDefault();form.reset();syncMode();state.date=null;state.slot=null;renderCal();renderSlots();go(1)};

function renderMine(){
  const list=store.get('gm_bookings',[]).filter(b=>{const p=b.dkey.split('-').map(Number);return new Date(p[0],p[1]-1,p[2])>=today});
  const el=$('#myBookings');if(!list.length){el.innerHTML='';return}
  el.innerHTML='<b style="display:block;margin-top:18px">Your requested appointments</b>'+list.map(b=>`<div class="bk"><span>${esc(b.child)} · ${b.date} · time to be confirmed</span><button data-ref="${b.ref}" aria-label="Remove">Remove</button></div>`).join('');
  el.querySelectorAll('[data-ref]').forEach(btn=>btn.onclick=()=>{store.set('gm_bookings',store.get('gm_bookings',[]).filter(b=>b.ref!==btn.dataset.ref));renderMine();if(state.date)renderSlots();toast('Removed. Please also inform the clinic on WhatsApp.')});
}
renderMine();
})();
