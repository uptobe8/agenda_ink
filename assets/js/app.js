
if(!window.INKLAB_V9){
window.INKLAB_V9=true;
(function(){
"use strict";
const KEY="inklab-v9-data", THEME="inklab-v9-theme";
const BASE_DATE=new Date("2026-05-25T12:00:00");
let view="day", cur=new Date(BASE_DATE), selectedTemplate=null, selectedClient=null, parsedOCR=[];
const seed={
 appointments:[
  {id:"a1",client:"Laura Medina",phone:"+34600111222",email:"laura@example.com",whatsapp:"+34600111222",date:"2026-05-25",time:"10:00",duration:180,artist:"Alicia",service:"Tatuaje",status:"Confirmada",detail:"Floral antebrazo · línea fina",notes:"Señal pagada.",price:420},
  {id:"a2",client:"Carlos Vela",phone:"+34600333444",email:"carlos@example.com",whatsapp:"+34600333444",date:"2026-05-25",time:"14:30",duration:90,artist:"Diego",service:"Diseño",status:"Pendiente",detail:"Blackwork pecho",notes:"Enviar propuesta.",price:160},
  {id:"a3",client:"Marta Ruiz",phone:"+34600555666",email:"marta@example.com",whatsapp:"+34600555666",date:"2026-05-26",time:"11:30",duration:120,artist:"Nora",service:"Retoque",status:"Señal pendiente",detail:"Lettering costillas",notes:"Avisar preparación.",price:130},
  {id:"a4",client:"Sergio León",phone:"+34600777888",email:"sergio@example.com",whatsapp:"+34600777888",date:"2026-05-27",time:"16:00",duration:240,artist:"Alicia",service:"Tatuaje",status:"Confirmada",detail:"Realismo brazo",notes:"Sesión larga.",price:690},
  {id:"a5",client:"Elena Torres",phone:"+34600999000",email:"elena@example.com",whatsapp:"+34600999000",date:"2026-05-29",time:"12:00",duration:60,artist:"Equipo INKLAB",service:"Piercing",status:"Confirmada",detail:"Oreja",notes:"Consentimiento listo.",price:60},
  {id:"a6",client:"Javier Sanz",phone:"+34600123456",email:"javier@example.com",whatsapp:"+34600123456",date:"2026-05-30",time:"17:30",duration:150,artist:"Diego",service:"Tatuaje",status:"Pendiente",detail:"Tradicional pierna",notes:"Pendiente señal.",price:310}
 ],
 payments:[
  {id:"p1",client:"Laura Medina",concept:"Señal floral",amount:120,status:"Recibido",date:"2026-05-20",link:"https://pago.ejemplo.com/inklab/p1"},
  {id:"p2",client:"Carlos Vela",concept:"Señal blackwork",amount:80,status:"Pendiente",date:"2026-05-25",link:"https://pago.ejemplo.com/inklab/p2"},
  {id:"p3",client:"Marta Ruiz",concept:"Retoque lettering",amount:60,status:"Enviado",date:"2026-05-24",link:"https://pago.ejemplo.com/inklab/p3"},
  {id:"p4",client:"Sergio León",concept:"Sesión realismo",amount:350,status:"Recibido",date:"2026-05-22",link:"https://pago.ejemplo.com/inklab/p4"},
  {id:"p5",client:"Elena Torres",concept:"Piercing",amount:45,status:"Vencido",date:"2026-05-18",link:"https://pago.ejemplo.com/inklab/p5"},
  {id:"p6",client:"Javier Sanz",concept:"Señal tradicional",amount:90,status:"Pendiente",date:"2026-05-26",link:"https://pago.ejemplo.com/inklab/p6"}
 ],
 templates:[
  {id:"t1",type:"WhatsApp",title:"Confirmación con señal",subject:"",paymentLink:"https://pago.ejemplo.com/inklab/senal",body:"Hola {{cliente}}, tu cita en INKLAB queda reservada para el {{fecha}} a las {{hora}}.\n\nPara confirmar, completa la señal aquí:\n{{enlace_pago}}\n\nGracias."},
  {id:"t2",type:"WhatsApp",title:"Recordatorio 24h",subject:"",paymentLink:"https://pago.ejemplo.com/inklab/pendiente",body:"Hola {{cliente}}, te recordamos tu cita de mañana en INKLAB.\n\nServicio: {{servicio}}\nHora: {{hora}}\n\nResponde a este WhatsApp si necesitas ajustar algo."},
  {id:"t3",type:"Email",title:"Presupuesto",subject:"Tu presupuesto INKLAB",paymentLink:"https://pago.ejemplo.com/inklab/presupuesto",body:"Hola {{cliente}},\n\nTe enviamos el presupuesto de tu proyecto. Para reservar fecha, puedes completar la señal aquí:\n{{enlace_pago}}\n\nINKLAB Madrid"},
  {id:"t4",type:"Email",title:"Pago pendiente",subject:"Pago pendiente de confirmación",paymentLink:"https://pago.ejemplo.com/inklab/recordatorio",body:"Hola {{cliente}},\n\nTenemos pendiente la confirmación del pago asociado a tu cita.\n\nPuedes realizarlo aquí:\n{{enlace_pago}}\n\nGracias."}
 ],
 clients:[
  {id:"c1",name:"Laura Medina",phone:"+34600111222",email:"laura@example.com",whatsapp:"+34600111222",last:"2026-05-20",value:620,preference:"Floral, línea fina",risk:"Bajo",notes:"Alta probabilidad de repetir."},
  {id:"c2",name:"Carlos Vela",phone:"+34600333444",email:"carlos@example.com",whatsapp:"+34600333444",last:"2026-05-15",value:240,preference:"Blackwork",risk:"Medio",notes:"Necesita seguimiento para cerrar señal."},
  {id:"c3",name:"Marta Ruiz",phone:"+34600555666",email:"marta@example.com",whatsapp:"+34600555666",last:"2026-05-05",value:180,preference:"Lettering",risk:"Bajo",notes:"Cliente recurrente."},
  {id:"c4",name:"Sergio León",phone:"+34600777888",email:"sergio@example.com",whatsapp:"+34600777888",last:"2026-05-10",value:920,preference:"Realismo",risk:"Bajo",notes:"Cliente alto valor."},
  {id:"c5",name:"Elena Torres",phone:"+34600999000",email:"elena@example.com",whatsapp:"+34600999000",last:"2026-05-12",value:95,preference:"Piercing",risk:"Medio",notes:"Interesada en segundo piercing."}
 ]
};
let state=load();
function $(s,p=document){return p.querySelector(s)}
function $all(s,p=document){return [...p.querySelectorAll(s)]}
function clone(o){return JSON.parse(JSON.stringify(o))}
function load(){try{return Object.assign(clone(seed),JSON.parse(localStorage.getItem(KEY)||"{}"))}catch(e){return clone(seed)}}
function save(){try{localStorage.setItem(KEY,JSON.stringify(state))}catch(e){}}
function page(){return document.documentElement.dataset.page}
function euro(n){return Number(n||0).toLocaleString("es-ES",{maximumFractionDigits:0})+" €"}
function percent(n){return Math.round(Number(n||0))+"%"}
function iso(d){return new Date(d).toISOString().slice(0,10)}
function date(v){return new Date(v+"T12:00:00")}
function fmt(v){return date(v).toLocaleDateString("es-ES",{day:"2-digit",month:"short",year:"numeric"})}
function addDays(d,n){let x=new Date(d);x.setDate(x.getDate()+n);return x}
function startWeek(d){let x=new Date(d);x.setDate(x.getDate()-((x.getDay()+6)%7));return x}
function normPhone(v){return String(v||"").replace(/[^\d+]/g,"")}
function cls(v){return ["Confirmada","Recibido","Finalizada","Bajo"].includes(v)?"ok":["Pendiente","Señal pendiente","Enviado","Medio"].includes(v)?"warn":"bad"}
function toast(m){let o=$(".toast"); if(o)o.remove(); let n=document.createElement("div"); n.className="toast"; n.textContent=m; n.style.cssText="position:fixed;z-index:300;left:50%;bottom:18px;transform:translateX(-50%);background:#050505;color:#fff;border-radius:999px;padding:11px 14px;font-weight:700;box-shadow:0 18px 50px rgba(0,0,0,.25);max-width:calc(100% - 24px);text-align:center"; document.body.appendChild(n); setTimeout(()=>n.remove(),2100)}
function kpi(l,v,n=""){return `<div class="kpi"><span>${l}</span><strong>${v}</strong>${n?`<p>${n}</p>`:""}</div>`}
function setTheme(){let t=localStorage.getItem(THEME)||"day";document.documentElement.dataset.theme=t==="night"?"dark":"day";let b=$("#themeToggle");if(b)b.textContent=t==="night"?"Noche":"Día"}
function initBase(){
 setTheme(); $all(".nav a").forEach(a=>{if(a.dataset.nav===page())a.classList.add("active")});
 let th=$("#themeToggle"); if(th)th.onclick=()=>{localStorage.setItem(THEME,localStorage.getItem(THEME)==="night"?"day":"night");setTheme()};
 $all("[data-new]").forEach(b=>b.onclick=()=>openModal());
 $all("[data-close]").forEach(b=>b.onclick=closeModal);
 let f=$("#appointmentForm"); if(f)f.onsubmit=saveAppointment;
 let d=$("#deleteAppointment"); if(d)d.onclick=deleteAppointment;
 let vf=$("#voiceFill"); if(vf)vf.onclick=()=>voice("fill");
 let vn=$("#voiceNotes"); if(vn)vn.onclick=()=>voice("notes");
}

function bindHamburgerMenu(){
 const btn=$("#menuToggle"), nav=$("#mainNav"), scrim=$("#navScrim");
 if(!btn||!nav)return;
 const close=()=>{document.body.classList.remove("menu-open");nav.classList.remove("open");btn.setAttribute("aria-expanded","false")};
 const open=()=>{document.body.classList.add("menu-open");nav.classList.add("open");btn.setAttribute("aria-expanded","true")};
 btn.onclick=()=>nav.classList.contains("open")?close():open();
 if(scrim)scrim.onclick=close;
 nav.querySelectorAll("a").forEach(a=>a.addEventListener("click",close));
 document.addEventListener("keydown",e=>{if(e.key==="Escape")close()});
}

function apptCard(a){
 let tel=normPhone(a.phone), wa=normPhone(a.whatsapp||a.phone).replace("+","");
 return `<article class="appointment">
 <div class="cardtop"><div><div class="event-title">${a.time} · ${a.client}</div><div class="event-meta">${a.service} · ${a.artist} · ${a.detail}</div></div><span class="pill ${cls(a.status)}">${a.status}</span></div>
 <div class="ctarow"><a class="cta call" href="tel:${tel}">Llamar</a><a class="cta mail" href="mailto:${a.email}?subject=Cita%20INKLAB">Mail</a><a class="cta wa" href="https://wa.me/${wa}">WhatsApp</a><button data-edit="${a.id}">Editar</button></div>
 </article>`;
}
function bindEdits(){$all("[data-edit]").forEach(b=>b.onclick=()=>openModal(b.dataset.edit))}
function openModal(id){
 let m=$("#appointmentModal"), f=$("#appointmentForm"); if(!m||!f)return; f.reset(); f.id.value="";
 let a=state.appointments.find(x=>x.id===id); $("#modalTitle").textContent=a?"Editar cita":"Nueva cita"; $("#deleteAppointment").style.display=a?"inline-flex":"none";
 if(a){Object.keys(a).forEach(k=>{if(f.elements[k])f.elements[k].value=a[k]})}
 else{f.date.value=iso(new Date());f.time.value="10:00";f.duration.value=120;f.price.value=180;f.status.value="Pendiente";f.service.value="Tatuaje"}
 m.classList.add("open");m.setAttribute("aria-hidden","false");
}
function closeModal(){let m=$("#appointmentModal");if(m){m.classList.remove("open");m.setAttribute("aria-hidden","true")}}
function saveAppointment(e){
 e.preventDefault(); let f=e.target, a={}; ["id","client","phone","email","whatsapp","date","time","duration","artist","service","status","detail","notes","price"].forEach(k=>a[k]=f.elements[k].value);
 if(!a.id)a.id="a"+Date.now(); let i=state.appointments.findIndex(x=>x.id===a.id); if(i>-1)state.appointments[i]=a;else state.appointments.push(a);
 save(); closeModal(); toast("Cita guardada"); renderAll();
}
function deleteAppointment(){let id=$("#appointmentForm").id.value;if(!id)return;state.appointments=state.appointments.filter(a=>a.id!==id);save();closeModal();toast("Cita eliminada");renderAll()}
function voice(mode){
 let SR=window.SpeechRecognition||window.webkitSpeechRecognition, s=$("#voiceStatus"); if(!SR){s.textContent="Dictado no soportado.";return}
 let r=new SR(); r.lang="es-ES"; r.interimResults=false; s.textContent="Escuchando...";
 r.onresult=e=>{let txt=e.results[0][0].transcript, f=$("#appointmentForm"); if(mode==="notes")f.notes.value+=(f.notes.value?"\n":"")+txt;else{f.notes.value+=(f.notes.value?"\n":"")+"Dictado: "+txt;let hr=txt.match(/(\d{1,2})[:\.](\d{2})/)||txt.match(/(\d{1,2})\s?horas?/);if(hr)f.time.value=String(hr[1]).padStart(2,"0")+":"+(hr[2]||"00")}s.textContent="Dictado recibido"};
 r.onerror=()=>s.textContent="No se pudo acceder al micrófono."; r.start();
}
function dayAppointments(d=iso(BASE_DATE)){return state.appointments.filter(a=>a.date===d).sort((a,b)=>a.time.localeCompare(b.time))}
function renderIndex(){
 if(!$("#todaySchedule"))return;
 let d=iso(BASE_DATE), arr=dayAppointments(d), revenue=state.appointments.reduce((s,a)=>s+Number(a.price||0),0), pending=state.payments.filter(p=>["Pendiente","Vencido"].includes(p.status)).reduce((s,p)=>s+Number(p.amount),0), hours=state.appointments.reduce((s,a)=>s+Number(a.duration||0),0)/60, occ=Math.round(hours/48*100);
 $("#homeKpis").innerHTML=kpi("Citas hoy",arr.length,"agenda visible")+kpi("Ocupación",percent(occ),"capacidad semanal")+kpi("Señales pendientes",euro(pending),"recuperable")+kpi("Ingresos agenda",euro(revenue),"reservado");
 renderDateStrip("#dateStrip");
 renderDayTimeline("#todaySchedule",d);
 renderHourHeatmap("#hourHeatmap");
 $("#homeNext").innerHTML=arr.map(apptCard).join("")||`<div class="card">Sin citas hoy.</div>`;
 drawBars("#homeOccupancy",[["09-11",75],["11-13",90],["13-15",42],["15-17",86],["17-19",58]]);
 bindEdits();
}
function renderDateStrip(sel){let el=$(sel); if(!el)return; let s=startWeek(BASE_DATE); el.innerHTML=[0,1,2,3,4,5,6].map(i=>{let d=addDays(s,i), day=iso(d); return `<button class="date-card ${day===iso(BASE_DATE)?"active":""}" data-jump="${day}"><span>${d.toLocaleDateString("es-ES",{weekday:"short"})}</span><b>${d.getDate()}</b></button>`}).join("")}
function renderDayTimeline(sel,d){let el=$(sel); if(!el)return; let arr=dayAppointments(d), hours=[9,10,11,12,13,14,15,16,17,18,19,20]; let html=`<div class="day-layout"><div class="hours">${hours.map(h=>`<div class="hour-label">${String(h).padStart(2,"0")}:00</div>`).join("")}</div><div class="timeline">`;
 hours.forEach(h=>{let ev=arr.filter(a=>Number(a.time.split(":")[0])===h); html+=`<div class="slot">${ev.map(a=>`<div class="event"><div class="event-title">${a.time} · ${a.client}</div><div class="event-meta">${a.service} · ${a.artist}</div></div>`).join("")}</div>`});
 el.innerHTML=html+`</div></div>`;
}
function renderHourHeatmap(sel){let el=$(sel); if(!el)return; let days=["L","M","X","J","V","S","D"], levels=[[3,4,2,0,3,1,0],[2,3,4,1,2,2,0],[1,2,3,0,4,1,0],[0,1,2,2,3,3,0],[2,4,1,1,2,2,0],[3,2,0,3,4,1,0]]; el.innerHTML=days.map((d,i)=>`<div class="heat-col"><div class="heat-head">${d}</div>${levels.map((r,ri)=>`<div class="heat-cell h${r[i]}">${9+ri*2}</div>`).join("")}</div>`).join("")}
function filtered(){let q=($("#agendaSearch")?.value||"").toLowerCase(), artist=$("#artistFilter")?.value||"", status=$("#statusFilter")?.value||"", service=$("#serviceFilter")?.value||"";return state.appointments.filter(a=>{let h=(a.client+" "+a.phone+" "+a.email+" "+a.detail+" "+a.artist+" "+a.service).toLowerCase();return(!q||h.includes(q))&&(!artist||a.artist===artist)&&(!status||a.status===status)&&(!service||a.service===service)}).sort((a,b)=>(a.date+a.time).localeCompare(b.date+b.time))}
function periodLabel(){if(view==="day")return cur.toLocaleDateString("es-ES",{weekday:"long",day:"2-digit",month:"long"});if(view==="week"){let s=startWeek(cur),e=addDays(s,6);return fmt(iso(s))+" — "+fmt(iso(e))}if(view==="month")return cur.toLocaleDateString("es-ES",{month:"long",year:"numeric"});return String(cur.getFullYear())}
function renderAgenda(){
 if(!$("#agendaCanvas"))return; $("#periodLabel").textContent=periodLabel(); let items=filtered(), el=$("#agendaCanvas");
 if(view==="day"){renderDayTimeline("#agendaCanvas",iso(cur));}
 if(view==="week"){let s=startWeek(cur), html=`<div class="week">`; for(let i=0;i<7;i++){let d=addDays(s,i), day=iso(d), arr=items.filter(a=>a.date===day); html+=`<section class="weekcol"><div class="muted" style="font-size:12px;margin-bottom:7px">${d.toLocaleDateString("es-ES",{weekday:"short",day:"2-digit"})}</div>${arr.map(apptCard).join("")}</section>`} el.innerHTML=html+`</div>`}
 if(view==="month"){let first=new Date(cur.getFullYear(),cur.getMonth(),1), start=addDays(first,-((first.getDay()+6)%7)), html=`<div class="calendar">`; for(let i=0;i<42;i++){let d=addDays(start,i), day=iso(d), arr=items.filter(a=>a.date===day); html+=`<section class="daycell ${d.getMonth()!==cur.getMonth()?"muted":""}"><div class="muted">${d.getDate()}</div>${arr.map(a=>`<button class="chip" data-edit="${a.id}">${a.time} ${a.client}</button>`).join("")}</section>`} el.innerHTML=html+`</div>`}
 if(view==="year"){let html=`<div class="year">`; for(let m=0;m<12;m++){html+=`<section class="month"><h3>${new Date(cur.getFullYear(),m,1).toLocaleDateString("es-ES",{month:"long"})}</h3><div class="minigrid">`; for(let d=1;d<=31;d++){let day=cur.getFullYear()+"-"+String(m+1).padStart(2,"0")+"-"+String(d).padStart(2,"0");html+=`<span class="dot ${items.some(a=>a.date===day)?"on":""}"></span>`} html+=`</div></section>`} el.innerHTML=html+`</div>`}
 bindEdits();
}
function movePeriod(n){if(view==="day")cur=addDays(cur,n);else if(view==="week")cur=addDays(cur,7*n);else if(view==="month")cur=new Date(cur.getFullYear(),cur.getMonth()+n,1);else cur=new Date(cur.getFullYear()+n,0,1);renderAgenda()}
function bindAgenda(){
 if(!$("#agendaCanvas"))return; $all("[data-view]").forEach(b=>b.onclick=()=>{$all("[data-view]").forEach(x=>x.classList.remove("active"));b.classList.add("active");view=b.dataset.view;renderAgenda()});
 $("#prevPeriod").onclick=()=>movePeriod(-1);$("#nextPeriod").onclick=()=>movePeriod(1);["agendaSearch","artistFilter","statusFilter","serviceFilter"].forEach(id=>{$("#"+id).oninput=renderAgenda});renderAgenda();
}
function drawBars(sel,vals){let el=$(sel);if(!el)return;el.innerHTML=vals.map(v=>`<div class="barrow"><span>${v[0]}</span><div class="track"><div class="fill" style="width:${Math.min(100,v[1])}%"></div></div><b>${percent(v[1])}</b></div>`).join("")}
function chart(sel,vals){let el=$(sel);if(!el)return;let max=Math.max(...vals.map(v=>v[1]),1);el.innerHTML=`<div class="chart">${vals.map(v=>`<div class="bar ${v[2]||""}" style="height:${Math.max(16,v[1]/max*150)}px"><span>${v[0]}<br>${euro(v[1])}</span></div>`).join("")}</div>`}
function renderPayments(){
 if(!$("#paymentsTable"))return;let q=($("#paymentSearch").value||"").toLowerCase(),st=$("#paymentStatus").value,rows=state.payments.filter(p=>(!st||p.status===st)&&(!q||(p.client+" "+p.concept+" "+p.status).toLowerCase().includes(q)));
 let rec=sumPay("Recibido"), pen=state.payments.filter(p=>["Pendiente","Vencido"].includes(p.status)).reduce((s,p)=>s+Number(p.amount),0), env=sumPay("Enviado"), ven=sumPay("Vencido");
 $("#paymentKpis").innerHTML=kpi("Recibido",euro(rec),"caja confirmada")+kpi("Pendiente",euro(pen),"accionar")+kpi("Enviado",euro(env),"seguimiento")+kpi("Vencido",euro(ven),"urgente");
 $("#paymentsTable").innerHTML=rows.map(p=>`<tr><td>${p.client}</td><td>${p.concept}</td><td>${euro(p.amount)}</td><td><span class="pill ${cls(p.status)}">${p.status}</span></td><td>${fmt(p.date)}</td><td><a class="btn cta pay" href="${p.link}">Pago</a></td></tr>`).join("");
 $("#payDecision").innerHTML=`<div class="decision ${ven>0?"bad":pen>120?"warn":"ok"}"><b>${ven>0?"Urgente":pen>120?"Seguimiento":"Correcto"}:</b> ${ven>0?"enviar WhatsApp y mail a pagos vencidos.":"enviar recordatorio con enlace de pago a señales pendientes."}</div>`;
 drawBars("#payBars",[["Recibido",rec/5],["Pendiente",pen/3],["Enviado",env/2],["Vencido",ven*2]]); chart("#payChart",[["Recibido",rec,"ok"],["Pendiente",pen,"warn"],["Vencido",ven,"bad"]]); renderHourHeatmap("#payHeatmap");
}
function sumPay(s){return state.payments.filter(p=>p.status===s).reduce((a,p)=>a+Number(p.amount),0)}
function bindPayments(){if(!$("#paymentsTable"))return;$("#paymentSearch").oninput=renderPayments;$("#paymentStatus").oninput=renderPayments;$("#simulatePayment").onclick=()=>{state.payments.unshift({id:"p"+Date.now(),client:"Cliente nuevo",concept:"Señal simulada",amount:90,status:"Pendiente",date:iso(new Date()),link:"https://pago.ejemplo.com/inklab/demo"});save();renderPayments();toast("Pago creado")};renderPayments()}
function renderLevers(){
 if(!$("#leverKpis"))return;let rev=state.appointments.reduce((s,a)=>s+Number(a.price||0),0),hours=state.appointments.reduce((s,a)=>s+Number(a.duration||0),0)/60,occ=Math.round(hours/48*100),pending=state.payments.filter(p=>["Pendiente","Vencido"].includes(p.status)).reduce((s,p)=>s+Number(p.amount),0),confirmed=state.appointments.filter(a=>a.status==="Confirmada").length;
 $("#leverKpis").innerHTML=kpi("Facturación agendada",euro(rev),"objetivo 2.400 €")+kpi("Ocupación",percent(occ),"48 h semanales")+kpi("Señales pendientes",euro(pending),"recuperable")+kpi("Confirmadas",confirmed+"/"+state.appointments.length,"calidad agenda");
 drawBars("#breakEven",[["Ingresos",rev/24],["Equilibrio",1450/24]]); $("#breakDecision").innerHTML=`<div class="decision ${rev<1450?"bad":rev<1900?"warn":"ok"}">${rev<1450?"No ampliar costes; llenar agenda.":"Costes cubiertos; optimizar margen."}</div>`;
 chart("#revGoal",[["Actual",rev,"warn"],["Objetivo",2400,"ok"]]); drawBars("#marginServices",[["Realismo",74],["Floral",68],["Piercing",42],["Retoque",31]]);
 renderFunnel(); drawBars("#costClient",[["CPA",32],["Límite",50]]); drawBars("#capacityLever",[["Ocupación",occ]]);
 chart("#newRecurring",[["Nuevos",380,"warn"],["Recurrentes",620,"ok"]]); chart("#cashForecast",[["S1",420,"ok"],["S2",510,"ok"],["S3",260,"warn"],["S4",180,"bad"],["S5",390,"warn"]]); renderTrafficMap();
}

function renderTrafficMap(){
 let el=$("#trafficMap"); if(!el)return;
 let rev=state.appointments.reduce((s,a)=>s+Number(a.price||0),0), pending=state.payments.filter(p=>["Pendiente","Vencido"].includes(p.status)).reduce((s,p)=>s+Number(p.amount),0), hours=state.appointments.reduce((s,a)=>s+Number(a.duration||0),0)/60, occ=Math.round(hours/48*100), ven=sumPay("Vencido");
 let rows=[
  {name:"Caja",note:ven>0?"vencidos activos":"sin vencidos",value:ven>0?45:86,label:ven>0?euro(ven):"OK",state:ven>0?"bad":"ok"},
  {name:"Señales",note:"cobro recuperable",value:Math.max(18,100-Math.min(100,pending/3)),label:euro(pending),state:pending>180?"bad":pending>80?"warn":"ok"},
  {name:"Agenda",note:"ocupación semanal",value:Math.min(100,occ),label:percent(occ),state:occ<55?"bad":occ<78?"warn":"ok"},
  {name:"Objetivo",note:"facturación agendada",value:Math.min(100,rev/2400*100),label:euro(rev),state:rev<1500?"bad":rev<2200?"warn":"ok"},
  {name:"Margen",note:"servicios rentables",value:74,label:"74%",state:"ok"},
  {name:"Captación",note:"presupuesto → señal",value:58,label:"58%",state:"warn"}
 ];
 el.innerHTML=rows.map(r=>`<div class="traffic-row"><div><b>${r.name}</b><small>${r.note}</small></div><div class="traffic-track"><div class="traffic-fill ${r.state}" style="width:${Math.max(8,Math.min(100,r.value))}%"></div></div><div class="traffic-value">${r.label}</div></div>`).join("");
}

function renderFunnel(){let el=$("#funnel");if(!el)return;let vals=[["Consultas",62],["Brief",41],["Presupuesto",26],["Señal",14],["Cita",10]],max=62;el.innerHTML=`<div class="funnel">${vals.map(v=>`<div style="width:${Math.max(28,v[1]/max*100)}%">${v[0]} · ${v[1]}</div>`).join("")}</div><div class="decision warn">Mayor fuga: presupuesto → señal. Enviar link de pago por WhatsApp.</div>`}
function renderTemplates(){if(!$("#templateList"))return;if(!selectedTemplate)selectedTemplate=state.templates[0].id;$("#templateList").innerHTML=state.templates.map(t=>`<button class="card ${t.id===selectedTemplate?"active":""}" data-template="${t.id}" style="text-align:left;width:100%"><span class="pill">${t.type}</span><h3>${t.title}</h3><p class="muted">${t.body.slice(0,90)}...</p></button>`).join("");$all("[data-template]").forEach(b=>b.onclick=()=>{selectedTemplate=b.dataset.template;renderTemplates()});let t=state.templates.find(x=>x.id===selectedTemplate),f=$("#templateForm");if(!t||!f)return;$("#templateTitle").textContent=t.title;$("#templateType").textContent=t.type;f.subject.value=t.subject;f.body.value=t.body;f.paymentLink.value=t.paymentLink;updatePreview()}
function bindTemplates(){if(!$("#templateForm"))return;$("#templateForm").oninput=updatePreview;$("#templateForm").onsubmit=e=>{e.preventDefault();let t=state.templates.find(x=>x.id===selectedTemplate);if(t){t.subject=e.target.subject.value;t.body=e.target.body.value;t.paymentLink=e.target.paymentLink.value;save();toast("Plantilla guardada");renderTemplates()}};$("#copyTemplate").onclick=()=>{navigator.clipboard&&navigator.clipboard.writeText($("#templatePreview").textContent);toast("Mensaje copiado")};renderTemplates()}
function updatePreview(){let f=$("#templateForm"),a=state.appointments[0];if(!f||!a)return;$("#templatePreview").textContent=f.body.value.replaceAll("{{cliente}}",a.client).replaceAll("{{fecha}}",fmt(a.date)).replaceAll("{{hora}}",a.time).replaceAll("{{servicio}}",a.service).replaceAll("{{enlace_pago}}",f.paymentLink.value)}
function renderClients(){if(!$("#clientList"))return;if(!selectedClient)selectedClient=state.clients[0].id;let q=($("#clientSearch").value||"").toLowerCase(),list=state.clients.filter(c=>!q||(c.name+" "+c.phone+" "+c.email+" "+c.preference).toLowerCase().includes(q));$("#clientList").innerHTML=list.map(c=>`<button class="card ${c.id===selectedClient?"active":""}" data-client="${c.id}" style="text-align:left;width:100%"><div class="cardtop"><div><h3>${c.name}</h3><p class="muted">${c.preference}</p></div><span class="pill ${cls(c.risk)}">${c.risk}</span></div></button>`).join("");$all("[data-client]").forEach(b=>b.onclick=()=>{selectedClient=b.dataset.client;renderClients()});let c=state.clients.find(x=>x.id===selectedClient)||state.clients[0];let wa=normPhone(c.whatsapp).replace("+","");$("#clientName").textContent=c.name;$("#clientProfile").innerHTML=`<div class="kpis" style="grid-template-columns:repeat(2,1fr)">${kpi("Teléfono",c.phone)+kpi("Email",c.email)+kpi("Valor",euro(c.value))+kpi("Última visita",fmt(c.last))}</div><div class="card" style="margin-top:10px"><h3>${c.preference}</h3><p class="muted">${c.notes}</p></div><div class="ctarow"><a class="cta call" href="tel:${normPhone(c.phone)}">Llamar</a><a class="cta mail" href="mailto:${c.email}">Mail</a><a class="cta wa" href="https://wa.me/${wa}">WhatsApp</a><button data-new>Nueva cita</button></div>`;$all("[data-new]").forEach(b=>b.onclick=()=>openModal())}
function bindClients(){if(!$("#clientList"))return;$("#clientSearch").oninput=renderClients;renderClients()}

function bindOCR(){
 if(!$("#openCamera") && !$("#startCamera"))return;
 let cameraBlob=null, stream=null;
 const video=$("#cameraStream"), canvas=$("#cameraCanvas"), preview=$("#ocrPreview"), status=$("#ocrStatus"), openBtn=$("#openCamera"), startBtn=$("#startCamera"), captureBtn=$("#capturePhoto");

 async function startCamera(){
   if(!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia){
     status.textContent="Este navegador no permite abrir la cámara desde la web.";
     return;
   }
   try{
     if(stream) stream.getTracks().forEach(t=>t.stop());
     stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:{ideal:"environment"}},audio:false});
     video.srcObject=stream;
     video.hidden=false;
     if(openBtn) openBtn.hidden=true;
     if(preview) preview.hidden=true;
     captureBtn.disabled=false;
     status.textContent="Cámara abierta. Encuadra el cuaderno y pulsa Capturar.";
   }catch(e){
     status.textContent="No se pudo abrir la cámara. Revisa permisos del navegador.";
   }
 }

 function capture(){
   if(!video || !video.videoWidth){toast("Abre la cámara primero");return}
   canvas.width=video.videoWidth;
   canvas.height=video.videoHeight;
   canvas.getContext("2d").drawImage(video,0,0,canvas.width,canvas.height);
   canvas.toBlob(blob=>{
     cameraBlob=blob;
     preview.src=URL.createObjectURL(blob);
     preview.hidden=false;
     video.hidden=true;
     if(stream){stream.getTracks().forEach(t=>t.stop());stream=null}
     if(openBtn) openBtn.hidden=false;
     captureBtn.disabled=true;
     status.textContent="Foto capturada. Pulsa Extraer texto.";
   },"image/jpeg",0.92);
 }

 if(openBtn) openBtn.onclick=startCamera;
 if(startBtn) startBtn.onclick=startCamera;
 if(captureBtn) captureBtn.onclick=capture;

 if($("#sampleText")) $("#sampleText").onclick=()=>{$("#ocrText").value=`Laura Medina 25/05/2026 10:00 Alicia Tatuaje 180min +34600111222 floral antebrazo 420€
Carlos Vela 25/05/2026 14:30 Diego Diseño 90min +34600333444 blackwork pecho 160€`; parseOCR()};

 $("#runOCR").onclick=async()=>{
   if(!cameraBlob){toast("Haz y captura una foto del cuaderno");return}
   status.textContent="Intentando OCR local del navegador...";
   try{
     if("TextDetector" in window){
       let det=new TextDetector();
       let bmp=await createImageBitmap(cameraBlob);
       let res=await det.detect(bmp);
       $("#ocrText").value=res.map(x=>x.rawValue||x.text||"").join("\n");
       status.textContent="Texto extraído con OCR local.";
     }else{
       status.textContent="Este navegador no ofrece OCR local. Escribe o pega el texto reconocido y convierte.";
     }
   }catch(e){
     status.textContent="No se pudo extraer OCR local. Revisa el texto y convierte.";
   }
 };
 $("#parseOCR").onclick=parseOCR;
 $("#importOCR").onclick=importOCR;
 $("#ocrText").oninput=()=>{if($("#ocrText").value.trim())parseOCR(false)};
}

function parseOCR(showToast=true){
 let text=$("#ocrText").value.trim(); parsedOCR=[]; if(!text){$("#parsedOCR").innerHTML=`<div class="card">Sin texto para convertir.</div>`;return}
 let lines=text.split(/\n+/).map(x=>x.trim()).filter(Boolean);
 parsedOCR=lines.map((line,i)=>{
  let dateMatch=line.match(/(\d{1,2})[\/\-](\d{1,2})(?:[\/\-](\d{2,4}))?/), timeMatch=line.match(/(\d{1,2})[:\.](\d{2})/), phoneMatch=line.match(/(\+?\d[\d\s]{7,})/), durMatch=line.match(/(\d{2,3})\s?min/i), priceMatch=line.match(/(\d{2,4})\s?€/);
  let clean=line.replace(dateMatch?.[0]||"","").replace(timeMatch?.[0]||"","").replace(phoneMatch?.[0]||"").replace(durMatch?.[0]||"").replace(priceMatch?.[0]||"").trim();
  let parts=clean.split(/\s+/); let client=(parts.slice(0,2).join(" ")||"Cliente OCR "+(i+1)).replace(/\b\w/g,c=>c.toUpperCase());
  let year=dateMatch?(dateMatch[3]?(dateMatch[3].length===2?"20"+dateMatch[3]:dateMatch[3]):"2026"):"2026";
  let dt=dateMatch?`${year}-${String(dateMatch[2]).padStart(2,"0")}-${String(dateMatch[1]).padStart(2,"0")}`:iso(new Date());
  return {id:"ocr"+Date.now()+i,client,phone:phoneMatch?phoneMatch[1].replace(/\s/g,""):"",email:"",whatsapp:phoneMatch?phoneMatch[1].replace(/\s/g,""):"",date:dt,time:timeMatch?`${String(timeMatch[1]).padStart(2,"0")}:${timeMatch[2]}`:"10:00",duration:durMatch?durMatch[1]:120,artist:["Alicia","Diego","Nora"].find(a=>line.toLowerCase().includes(a.toLowerCase()))||"Equipo INKLAB",service:["Diseño","Retoque","Piercing","Consulta"].find(s=>line.toLowerCase().includes(s.toLowerCase()))||"Tatuaje",status:"Pendiente",detail:clean,notes:"Importada desde cuaderno por OCR.",price:priceMatch?priceMatch[1]:180};
 });
 $("#parsedOCR").innerHTML=parsedOCR.map((a,i)=>`<div class="appointment"><div class="cardtop"><div><div class="event-title">${a.date} · ${a.time} · ${a.client}</div><div class="event-meta">${a.artist} · ${a.service} · ${a.detail}</div></div><span class="pill warn">Nueva</span></div></div>`).join("");
 if(showToast)toast("Texto convertido a citas");
}
function importOCR(){if(!parsedOCR.length)parseOCR(false); if(!parsedOCR.length){toast("No hay citas detectadas");return} state.appointments=state.appointments.concat(parsedOCR); save(); toast(parsedOCR.length+" citas importadas"); parsedOCR=[]; $("#parsedOCR").innerHTML=`<div class="card">Citas importadas.</div>`}
function renderAll(){renderIndex();renderAgenda();renderPayments();renderLevers();renderTemplates();renderClients()}
function init(){initBase();bindHamburgerMenu();bindAgenda();bindPayments();bindTemplates();bindClients();bindOCR();renderIndex();renderLevers()}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);else init();
})();
}
