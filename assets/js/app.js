
(() => {
  "use strict";

  const STORE = "inklab-agenda-stable-v1";
  const THEME = "inklab-theme-stable";
  const BASE_DATE = new Date("2026-05-25T12:00:00");

  const seed = {
    appointments: [
      {id:"a1",client:"Laura Medina",phone:"+34600111222",email:"laura@example.com",whatsapp:"+34600111222",date:"2026-05-25",time:"10:00",duration:180,artist:"Alicia",service:"Tatuaje",status:"Confirmada",detail:"Floral antebrazo · línea fina",notes:"Señal pagada.",price:420},
      {id:"a2",client:"Carlos Vela",phone:"+34600333444",email:"carlos@example.com",whatsapp:"+34600333444",date:"2026-05-25",time:"14:30",duration:90,artist:"Diego",service:"Diseño",status:"Pendiente",detail:"Blackwork pecho",notes:"Enviar propuesta.",price:160},
      {id:"a3",client:"Marta Ruiz",phone:"+34600555666",email:"marta@example.com",whatsapp:"+34600555666",date:"2026-05-26",time:"11:30",duration:120,artist:"Nora",service:"Retoque",status:"Señal pendiente",detail:"Lettering costillas",notes:"Avisar preparación.",price:130},
      {id:"a4",client:"Sergio León",phone:"+34600777888",email:"sergio@example.com",whatsapp:"+34600777888",date:"2026-05-27",time:"16:00",duration:240,artist:"Alicia",service:"Tatuaje",status:"Confirmada",detail:"Realismo brazo",notes:"Sesión larga.",price:690},
      {id:"a5",client:"Elena Torres",phone:"+34600999000",email:"elena@example.com",whatsapp:"+34600999000",date:"2026-05-29",time:"12:00",duration:60,artist:"Equipo INKLAB",service:"Piercing",status:"Confirmada",detail:"Oreja",notes:"Consentimiento listo.",price:60},
      {id:"a6",client:"Javier Sanz",phone:"+34600123456",email:"javier@example.com",whatsapp:"+34600123456",date:"2026-05-30",time:"17:30",duration:150,artist:"Diego",service:"Tatuaje",status:"Pendiente",detail:"Tradicional pierna",notes:"Pendiente señal.",price:310}
    ],
    payments: [
      {id:"p1",client:"Laura Medina",concept:"Señal floral",amount:120,status:"Recibido",date:"2026-05-20",link:"https://pago.ejemplo.com/inklab/p1"},
      {id:"p2",client:"Carlos Vela",concept:"Señal blackwork",amount:80,status:"Pendiente",date:"2026-05-25",link:"https://pago.ejemplo.com/inklab/p2"},
      {id:"p3",client:"Marta Ruiz",concept:"Retoque lettering",amount:60,status:"Enviado",date:"2026-05-24",link:"https://pago.ejemplo.com/inklab/p3"},
      {id:"p4",client:"Sergio León",concept:"Sesión realismo",amount:350,status:"Recibido",date:"2026-05-22",link:"https://pago.ejemplo.com/inklab/p4"},
      {id:"p5",client:"Elena Torres",concept:"Piercing",amount:45,status:"Vencido",date:"2026-05-18",link:"https://pago.ejemplo.com/inklab/p5"},
      {id:"p6",client:"Javier Sanz",concept:"Señal tradicional",amount:90,status:"Pendiente",date:"2026-05-26",link:"https://pago.ejemplo.com/inklab/p6"}
    ],
    templates: [
      {id:"t1",type:"WhatsApp",title:"Confirmación con señal",subject:"",paymentLink:"https://pago.ejemplo.com/inklab/senal",body:"Hola {{cliente}}, tu cita en INKLAB queda reservada para el {{fecha}} a las {{hora}}.\n\nPara confirmar, completa la señal aquí:\n{{enlace_pago}}\n\nGracias."},
      {id:"t2",type:"WhatsApp",title:"Recordatorio 24h",subject:"",paymentLink:"https://pago.ejemplo.com/inklab/pendiente",body:"Hola {{cliente}}, te recordamos tu cita de mañana en INKLAB.\n\nServicio: {{servicio}}\nHora: {{hora}}\n\nResponde a este WhatsApp si necesitas ajustar algo."},
      {id:"t3",type:"Email",title:"Presupuesto",subject:"Tu presupuesto INKLAB",paymentLink:"https://pago.ejemplo.com/inklab/presupuesto",body:"Hola {{cliente}},\n\nTe enviamos el presupuesto de tu proyecto. Para reservar fecha, puedes completar la señal aquí:\n{{enlace_pago}}\n\nINKLAB Madrid"},
      {id:"t4",type:"Email",title:"Pago pendiente",subject:"Pago pendiente de confirmación",paymentLink:"https://pago.ejemplo.com/inklab/recordatorio",body:"Hola {{cliente}},\n\nTenemos pendiente la confirmación del pago asociado a tu cita.\n\nPuedes realizarlo aquí:\n{{enlace_pago}}\n\nGracias."}
    ],
    clients: [
      {id:"c1",name:"Laura Medina",phone:"+34600111222",email:"laura@example.com",whatsapp:"+34600111222",last:"2026-05-20",value:620,preference:"Floral, línea fina",risk:"Bajo",notes:"Alta probabilidad de repetir."},
      {id:"c2",name:"Carlos Vela",phone:"+34600333444",email:"carlos@example.com",whatsapp:"+34600333444",last:"2026-05-15",value:240,preference:"Blackwork",risk:"Medio",notes:"Necesita seguimiento para cerrar señal."},
      {id:"c3",name:"Marta Ruiz",phone:"+34600555666",email:"marta@example.com",whatsapp:"+34600555666",last:"2026-05-05",value:180,preference:"Lettering",risk:"Bajo",notes:"Cliente recurrente."},
      {id:"c4",name:"Sergio León",phone:"+34600777888",email:"sergio@example.com",whatsapp:"+34600777888",last:"2026-05-10",value:920,preference:"Realismo",risk:"Bajo",notes:"Cliente alto valor."},
      {id:"c5",name:"Elena Torres",phone:"+34600999000",email:"elena@example.com",whatsapp:"+34600999000",last:"2026-05-12",value:95,preference:"Piercing",risk:"Medio",notes:"Interesada en segundo piercing."}
    ]
  };

  let state = loadState();
  let currentDate = new Date(BASE_DATE);
  let currentView = "day";
  let selectedTemplate = null;
  let selectedClient = null;
  let parsedOCR = [];
  let imageBlob = null;
  let cameraStream = null;

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  function clone(v){ return JSON.parse(JSON.stringify(v)); }
  function loadState(){
    try{
      const stored = JSON.parse(localStorage.getItem(STORE) || "{}");
      return {
        appointments: Array.isArray(stored.appointments) ? stored.appointments : clone(seed.appointments),
        payments: Array.isArray(stored.payments) ? stored.payments : clone(seed.payments),
        templates: Array.isArray(stored.templates) ? stored.templates : clone(seed.templates),
        clients: Array.isArray(stored.clients) ? stored.clients : clone(seed.clients)
      };
    }catch(e){
      return clone(seed);
    }
  }
  function saveState(){
    try{ localStorage.setItem(STORE, JSON.stringify(state)); }catch(e){}
  }
  function iso(d){ return new Date(d).toISOString().slice(0,10); }
  function addDays(d,n){ const x = new Date(d); x.setDate(x.getDate()+n); return x; }
  function startWeek(d){ const x = new Date(d); x.setDate(x.getDate()-((x.getDay()+6)%7)); return x; }
  function fmt(v){ return new Date(v+"T12:00:00").toLocaleDateString("es-ES",{day:"2-digit",month:"short",year:"numeric"}); }
  function euro(v){ return Number(v||0).toLocaleString("es-ES",{maximumFractionDigits:0})+" €"; }
  function percent(v){ return Number(v||0).toLocaleString("es-ES",{maximumFractionDigits:0})+"%"; }
  function cleanPhone(v){ return String(v||"").replace(/[^\d+]/g,""); }
  function pillClass(v){
    if(["Confirmada","Recibido","Finalizada","Bajo"].includes(v)) return "ok";
    if(["Cancelada","Vencido","Alto"].includes(v)) return "bad";
    return "warn";
  }
  function toast(msg){
    let old = $(".toast");
    if(old) old.remove();
    const node = document.createElement("div");
    node.className = "toast";
    node.textContent = msg;
    node.style.cssText = "position:fixed;left:50%;bottom:calc(18px + env(safe-area-inset-bottom,0px));transform:translateX(-50%);z-index:500;background:#111;color:#fff;border-radius:999px;padding:11px 15px;font-weight:700;box-shadow:0 16px 50px rgba(0,0,0,.26);max-width:calc(100vw - 24px);text-align:center";
    document.body.appendChild(node);
    setTimeout(()=>node.remove(),2200);
  }

  function setTheme(){
    const mode = localStorage.getItem(THEME) || "day";
    document.documentElement.dataset.theme = mode === "night" ? "dark" : "day";
    const btn = $("#themeToggle");
    if(btn) btn.textContent = mode === "night" ? "Noche" : "Día";
  }

  function kpi(label,value,note=""){
    return `<article class="kpi"><span>${label}</span><strong>${value}</strong>${note?`<p>${note}</p>`:""}</article>`;
  }

  function appointmentCard(a){
    const tel = cleanPhone(a.phone);
    const wa = cleanPhone(a.whatsapp || a.phone).replace("+","");
    return `<article class="appointment">
      <div class="cardtop">
        <div><div class="event-title">${a.time} · ${a.client}</div><div class="event-meta">${a.service} · ${a.artist} · ${a.detail || ""}</div></div>
        <span class="pill ${pillClass(a.status)}">${a.status}</span>
      </div>
      <div class="ctarow">
        <a class="cta call" href="tel:${tel}">Llamar</a>
        <a class="cta mail" href="mailto:${a.email || ""}?subject=Cita%20INKLAB">Mail</a>
        <a class="cta wa" href="https://wa.me/${wa}">WhatsApp</a>
        <button type="button" data-edit="${a.id}">Editar</button>
      </div>
    </article>`;
  }

  function openModal(id){
    const modal = $("#appointmentModal");
    const form = $("#appointmentForm");
    if(!modal || !form) return;

    form.reset();
    form.elements.id.value = "";
    const a = state.appointments.find(x => x.id === id);
    const deleteBtn = $("#deleteAppointment");
    const title = $("#modalTitle");

    if(a){
      if(title) title.textContent = "Editar cita";
      if(deleteBtn) deleteBtn.style.display = "inline-flex";
      Object.keys(a).forEach(k => { if(form.elements[k]) form.elements[k].value = a[k]; });
    }else{
      if(title) title.textContent = "Nueva cita";
      if(deleteBtn) deleteBtn.style.display = "none";
      if(form.elements.date) form.elements.date.value = iso(new Date());
      if(form.elements.time) form.elements.time.value = "10:00";
      if(form.elements.duration) form.elements.duration.value = 120;
      if(form.elements.price) form.elements.price.value = 180;
      if(form.elements.service) form.elements.service.value = "Tatuaje";
      if(form.elements.status) form.elements.status.value = "Pendiente";
    }

    modal.classList.add("open");
    modal.setAttribute("aria-hidden","false");
  }

  function closeModal(){
    const modal = $("#appointmentModal");
    if(!modal) return;
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden","true");
  }

  function saveAppointment(evt){
    evt.preventDefault();
    const form = evt.currentTarget;
    const a = {};
    ["id","client","phone","email","whatsapp","date","time","duration","artist","service","status","detail","notes","price"].forEach(k => {
      a[k] = form.elements[k] ? form.elements[k].value : "";
    });
    if(!a.id) a.id = "a" + Date.now();
    const idx = state.appointments.findIndex(x => x.id === a.id);
    if(idx >= 0) state.appointments[idx] = a;
    else state.appointments.push(a);
    saveState();
    closeModal();
    renderAll();
    toast("Cita guardada");
  }

  function deleteAppointment(){
    const form = $("#appointmentForm");
    if(!form || !form.elements.id.value) return;
    state.appointments = state.appointments.filter(a => a.id !== form.elements.id.value);
    saveState();
    closeModal();
    renderAll();
    toast("Cita eliminada");
  }

  function renderIndex(){
    if(!$("#homeKpis")) return;

    const today = iso(BASE_DATE);
    const todayApps = state.appointments.filter(a => a.date === today).sort((a,b)=>(a.time||"").localeCompare(b.time||""));
    const pending = state.payments.filter(p => ["Pendiente","Vencido"].includes(p.status)).reduce((s,p)=>s+Number(p.amount||0),0);
    const revenue = state.appointments.reduce((s,a)=>s+Number(a.price||0),0);
    const hours = Math.round(state.appointments.reduce((s,a)=>s+Number(a.duration||0),0)/60);

    $("#homeKpis").innerHTML =
      kpi("Citas hoy", todayApps.length, "agenda") +
      kpi("Reservado", euro(revenue), "trabajo previsto") +
      kpi("Pendiente", euro(pending), "cobros") +
      kpi("Horas", hours+" h", "ocupación");

    const dateStrip = $("#dateStrip");
    if(dateStrip){
      const start = startWeek(BASE_DATE);
      dateStrip.innerHTML = Array.from({length:7},(_,i)=>{
        const d = addDays(start,i);
        const key = iso(d);
        const count = state.appointments.filter(a=>a.date===key).length;
        return `<button type="button" class="date-card ${key===today?"active":""}" data-jump="${key}"><span>${d.toLocaleDateString("es-ES",{weekday:"short"})}</span><b>${d.getDate()}</b><small>${count} citas</small></button>`;
      }).join("");
    }

    const todaySchedule = $("#todaySchedule");
    if(todaySchedule){
      todaySchedule.innerHTML = `<div class="day-layout"><div class="hours">${[9,11,13,15,17,19].map(h=>`<div class="hour-label">${h}:00</div>`).join("")}</div><div class="timeline">${
        [9,11,13,15,17,19].map(h=>{
          const arr = todayApps.filter(a => Number((a.time||"0").split(":")[0]) === h);
          return `<div class="slot">${arr.length?arr.map(a=>`<div class="event"><div class="event-title">${a.time} · ${a.client}</div><div class="event-meta">${a.service} · ${a.artist}</div><div class="ctarow"><button type="button" data-edit="${a.id}">Editar</button></div></div>`).join(""):`<span class="muted">Hueco libre</span>`}</div>`;
        }).join("")
      }</div></div>`;
    }

    const homeNext = $("#homeNext");
    if(homeNext){
      homeNext.innerHTML = state.appointments
        .slice()
        .sort((a,b)=>(a.date+a.time).localeCompare(b.date+b.time))
        .slice(0,4)
        .map(appointmentCard)
        .join("");
    }

    renderHourHeatmap("#hourHeatmap");
    drawBars("#homeOccupancy",[["Lun",84],["Mar",62],["Mié",92],["Jue",54],["Vie",76],["Sáb",46]]);
  }

  function renderHourHeatmap(sel){
    const el = $(sel);
    if(!el) return;
    const days = ["L","M","X","J","V","S","D"];
    const hours = [9,11,13,15,17,19];
    el.innerHTML = days.map((d,di)=>{
      const cells = hours.map((h,hi)=>{
        const level = ((di+1)*(hi+2)) % 5;
        return `<div class="heat-cell h${level}">${h}</div>`;
      }).join("");
      return `<div class="heat-col"><div class="heat-head">${d}</div>${cells}</div>`;
    }).join("");
  }

  function drawBars(sel,vals){
    const el = $(sel);
    if(!el) return;
    el.innerHTML = vals.map(v => `<div class="barrow"><span>${v[0]}</span><div class="track"><div class="fill" style="width:${Math.max(0,Math.min(100,v[1]))}%"></div></div><b>${percent(v[1])}</b></div>`).join("");
  }

  function drawChart(sel,vals){
    const el = $(sel);
    if(!el) return;
    const max = Math.max(...vals.map(v=>Number(v[1])||0),1);
    el.innerHTML = `<div class="chart">${vals.map(v => `<div class="bar ${v[2]||""}" style="height:${Math.max(16,(Number(v[1])||0)/max*150)}px"><span>${v[0]}<br>${euro(v[1])}</span></div>`).join("")}</div>`;
  }

  function filteredAppointments(){
    const q = ($("#agendaSearch")?.value || "").toLowerCase();
    const artist = $("#artistFilter")?.value || "";
    const status = $("#statusFilter")?.value || "";
    const service = $("#serviceFilter")?.value || "";
    return state.appointments.filter(a => {
      const hay = `${a.client} ${a.phone} ${a.email} ${a.detail} ${a.artist} ${a.service}`.toLowerCase();
      return (!q || hay.includes(q)) && (!artist || a.artist === artist) && (!status || a.status === status) && (!service || a.service === service);
    }).sort((a,b)=>(a.date+a.time).localeCompare(b.date+b.time));
  }

  function periodLabel(){
    if(currentView === "day") return currentDate.toLocaleDateString("es-ES",{weekday:"long",day:"2-digit",month:"long"});
    if(currentView === "week"){
      const s = startWeek(currentDate);
      const e = addDays(s,6);
      return `${fmt(iso(s))} — ${fmt(iso(e))}`;
    }
    if(currentView === "month") return currentDate.toLocaleDateString("es-ES",{month:"long",year:"numeric"});
    return String(currentDate.getFullYear());
  }

  function renderAgenda(){
    const canvas = $("#agendaCanvas");
    if(!canvas) return;

    const label = $("#periodLabel");
    if(label) label.textContent = periodLabel();
    const items = filteredAppointments();

    if(currentView === "day"){
      const key = iso(currentDate);
      const arr = items.filter(a=>a.date===key);
      canvas.innerHTML = `<div class="timeline">${arr.map(appointmentCard).join("") || `<article class="card">Sin citas para este día.</article>`}</div>`;
    }

    if(currentView === "week"){
      const start = startWeek(currentDate);
      canvas.innerHTML = `<div class="week">${
        Array.from({length:7},(_,i)=>{
          const d = addDays(start,i);
          const key = iso(d);
          const arr = items.filter(a=>a.date===key);
          return `<section class="weekcol"><div class="muted">${d.toLocaleDateString("es-ES",{weekday:"short",day:"2-digit"})}</div>${arr.map(appointmentCard).join("")}</section>`;
        }).join("")
      }</div>`;
    }

    if(currentView === "month"){
      const first = new Date(currentDate.getFullYear(),currentDate.getMonth(),1);
      const start = addDays(first,-((first.getDay()+6)%7));
      canvas.innerHTML = `<div class="calendar">${
        Array.from({length:42},(_,i)=>{
          const d = addDays(start,i);
          const key = iso(d);
          const arr = items.filter(a=>a.date===key);
          return `<section class="daycell ${d.getMonth()!==currentDate.getMonth()?"muted":""}"><div class="muted">${d.getDate()}</div>${arr.map(a=>`<button type="button" class="chip" data-edit="${a.id}">${a.time} ${a.client}</button>`).join("")}</section>`;
        }).join("")
      }</div>`;
    }

    if(currentView === "year"){
      canvas.innerHTML = `<div class="year">${
        Array.from({length:12},(_,m)=>{
          const name = new Date(currentDate.getFullYear(),m,1).toLocaleDateString("es-ES",{month:"long"});
          const dots = Array.from({length:31},(_,d)=>{
            const key = `${currentDate.getFullYear()}-${String(m+1).padStart(2,"0")}-${String(d+1).padStart(2,"0")}`;
            return `<span class="dot ${items.some(a=>a.date===key)?"on":""}"></span>`;
          }).join("");
          return `<section class="month"><h3>${name}</h3><div class="minigrid">${dots}</div></section>`;
        }).join("")
      }</div>`;
    }
  }

  function movePeriod(n){
    if(currentView === "day") currentDate = addDays(currentDate,n);
    else if(currentView === "week") currentDate = addDays(currentDate,7*n);
    else if(currentView === "month") currentDate = new Date(currentDate.getFullYear(),currentDate.getMonth()+n,1);
    else currentDate = new Date(currentDate.getFullYear()+n,0,1);
    renderAgenda();
  }

  function renderPayments(){
    if(!$("#paymentsTable")) return;
    const q = ($("#paymentSearch")?.value || "").toLowerCase();
    const st = $("#paymentStatus")?.value || "";
    const rows = state.payments.filter(p => (!st || p.status === st) && (!q || `${p.client} ${p.concept} ${p.status}`.toLowerCase().includes(q)));
    const rec = sumPay("Recibido");
    const env = sumPay("Enviado");
    const ven = sumPay("Vencido");
    const pen = state.payments.filter(p=>["Pendiente","Vencido"].includes(p.status)).reduce((s,p)=>s+Number(p.amount||0),0);

    $("#paymentKpis").innerHTML =
      kpi("Recibido",euro(rec),"caja") +
      kpi("Pendiente",euro(pen),"accionar") +
      kpi("Enviado",euro(env),"seguimiento") +
      kpi("Vencido",euro(ven),"urgente");

    $("#paymentsTable").innerHTML = rows.map(p => `<tr><td>${p.client}</td><td>${p.concept}</td><td>${euro(p.amount)}</td><td><span class="pill ${pillClass(p.status)}">${p.status}</span></td><td>${fmt(p.date)}</td><td><a class="btn cta pay" href="${p.link}">Pago</a></td></tr>`).join("");

    const decision = $("#payDecision");
    if(decision) decision.innerHTML = `<div class="decision ${ven>0?"bad":pen>120?"warn":"ok"}"><b>${ven>0?"Urgente":pen>120?"Seguimiento":"Correcto"}:</b> ${ven>0?"enviar WhatsApp y mail a pagos vencidos.":"enviar recordatorio con enlace de pago."}</div>`;

    drawBars("#payBars",[["Recibido",rec/5],["Pendiente",pen/3],["Enviado",env/2],["Vencido",ven*2]]);
    drawChart("#payChart",[["Recibido",rec,"ok"],["Pendiente",pen,"warn"],["Vencido",ven,"bad"]]);
    renderHourHeatmap("#payHeatmap");
  }

  function sumPay(status){
    return state.payments.filter(p=>p.status===status).reduce((s,p)=>s+Number(p.amount||0),0);
  }

  function renderLevers(){
    if(!$("#leverKpis")) return;
    const rev = state.appointments.reduce((s,a)=>s+Number(a.price||0),0);
    const hours = state.appointments.reduce((s,a)=>s+Number(a.duration||0),0)/60;
    const occ = Math.round(hours/48*100);
    const pending = state.payments.filter(p=>["Pendiente","Vencido"].includes(p.status)).reduce((s,p)=>s+Number(p.amount||0),0);
    const confirmed = state.appointments.filter(a=>a.status==="Confirmada").length;

    $("#leverKpis").innerHTML =
      kpi("Facturación",euro(rev),"objetivo 2.400 €") +
      kpi("Ocupación",percent(occ),"48 h semanales") +
      kpi("Pendiente",euro(pending),"recuperable") +
      kpi("Confirmadas",`${confirmed}/${state.appointments.length}`,"calidad agenda");

    drawBars("#breakEven",[["Ingresos",rev/24],["Equilibrio",1450/24]]);
    const breakDecision = $("#breakDecision");
    if(breakDecision) breakDecision.innerHTML = `<div class="decision ${rev<1450?"bad":rev<1900?"warn":"ok"}">${rev<1450?"No ampliar costes; llenar agenda.":"Costes cubiertos; optimizar margen."}</div>`;
    drawChart("#revGoal",[["Actual",rev,"warn"],["Objetivo",2400,"ok"]]);
    drawBars("#marginServices",[["Realismo",74],["Floral",68],["Piercing",42],["Retoque",31]]);
    renderTrafficMap();
    renderFunnel();
    drawBars("#costClient",[["CPA",32],["Límite",50]]);
    drawBars("#capacityLever",[["Ocupación",occ]]);
    drawChart("#newRecurring",[["Nuevos",380,"warn"],["Recurrentes",620,"ok"]]);
    drawChart("#cashForecast",[["S1",420,"ok"],["S2",510,"ok"],["S3",260,"warn"],["S4",180,"bad"],["S5",390,"warn"]]);
  }

  function renderTrafficMap(){
    const el = $("#trafficMap");
    if(!el) return;
    const ven = sumPay("Vencido");
    const pending = state.payments.filter(p=>["Pendiente","Vencido"].includes(p.status)).reduce((s,p)=>s+Number(p.amount||0),0);
    const rev = state.appointments.reduce((s,a)=>s+Number(a.price||0),0);
    const hours = state.appointments.reduce((s,a)=>s+Number(a.duration||0),0)/60;
    const occ = Math.round(hours/48*100);
    const rows = [
      {name:"Caja",note:ven>0?"vencidos activos":"sin vencidos",value:ven>0?45:86,label:ven>0?euro(ven):"OK",state:ven>0?"bad":"ok"},
      {name:"Señales",note:"cobro recuperable",value:Math.max(18,100-Math.min(100,pending/3)),label:euro(pending),state:pending>180?"bad":pending>80?"warn":"ok"},
      {name:"Agenda",note:"ocupación semanal",value:Math.min(100,occ),label:percent(occ),state:occ<55?"bad":occ<78?"warn":"ok"},
      {name:"Objetivo",note:"facturación agendada",value:Math.min(100,rev/2400*100),label:euro(rev),state:rev<1500?"bad":rev<2200?"warn":"ok"},
      {name:"Margen",note:"servicios rentables",value:74,label:"74%",state:"ok"},
      {name:"Captación",note:"presupuesto → señal",value:58,label:"58%",state:"warn"}
    ];
    el.innerHTML = rows.map(r => `<div class="traffic-row"><div><b>${r.name}</b><small>${r.note}</small></div><div class="traffic-track"><div class="traffic-fill ${r.state}" style="width:${Math.max(8,Math.min(100,r.value))}%"></div></div><div class="traffic-value">${r.label}</div></div>`).join("");
  }

  function renderFunnel(){
    const el = $("#funnel");
    if(!el) return;
    const vals = [["Consultas",62],["Brief",41],["Presupuesto",26],["Señal",14],["Cita",10]];
    const max = vals[0][1];
    el.innerHTML = `<div class="funnel">${vals.map(v=>`<div style="width:${Math.max(28,v[1]/max*100)}%">${v[0]} · ${v[1]}</div>`).join("")}</div><div class="decision warn">Mayor fuga: presupuesto → señal. Enviar link de pago por WhatsApp.</div>`;
  }

  function renderTemplates(){
    if(!$("#templateList")) return;
    if(!selectedTemplate) selectedTemplate = state.templates[0]?.id;
    $("#templateList").innerHTML = state.templates.map(t => `<button type="button" class="card ${t.id===selectedTemplate?"active":""}" data-template="${t.id}" style="text-align:left;width:100%"><span class="pill">${t.type}</span><h3>${t.title}</h3><p class="muted">${t.body.slice(0,90)}...</p></button>`).join("");
    const t = state.templates.find(x=>x.id===selectedTemplate) || state.templates[0];
    const form = $("#templateForm");
    if(!t || !form) return;
    $("#templateTitle").textContent = t.title;
    $("#templateType").textContent = t.type;
    form.elements.subject.value = t.subject || "";
    form.elements.body.value = t.body || "";
    form.elements.paymentLink.value = t.paymentLink || "";
    updateTemplatePreview();
  }

  function updateTemplatePreview(){
    const form = $("#templateForm");
    const out = $("#templatePreview");
    if(!form || !out) return;
    const sample = state.appointments[0];
    out.textContent = form.elements.body.value
      .replaceAll("{{cliente}}", sample.client)
      .replaceAll("{{fecha}}", fmt(sample.date))
      .replaceAll("{{hora}}", sample.time)
      .replaceAll("{{servicio}}", sample.service)
      .replaceAll("{{enlace_pago}}", form.elements.paymentLink.value);
  }

  function saveTemplate(evt){
    evt.preventDefault();
    const form = evt.currentTarget;
    const t = state.templates.find(x=>x.id===selectedTemplate);
    if(!t) return;
    t.subject = form.elements.subject.value;
    t.body = form.elements.body.value;
    t.paymentLink = form.elements.paymentLink.value;
    saveState();
    renderTemplates();
    toast("Plantilla guardada");
  }

  function renderClients(){
    if(!$("#clientList")) return;
    if(!selectedClient) selectedClient = state.clients[0]?.id;
    const q = ($("#clientSearch")?.value || "").toLowerCase();
    const list = state.clients.filter(c => !q || `${c.name} ${c.phone} ${c.email} ${c.preference}`.toLowerCase().includes(q));
    $("#clientList").innerHTML = list.map(c => `<button type="button" class="card ${c.id===selectedClient?"active":""}" data-client="${c.id}" style="text-align:left;width:100%"><div class="cardtop"><div><h3>${c.name}</h3><p class="muted">${c.preference}</p></div><span class="pill ${pillClass(c.risk)}">${c.risk}</span></div></button>`).join("");
    const c = state.clients.find(x=>x.id===selectedClient) || state.clients[0];
    if(!c) return;
    const wa = cleanPhone(c.whatsapp).replace("+","");
    $("#clientName").textContent = c.name;
    $("#clientProfile").innerHTML = `<div class="kpis" style="grid-template-columns:repeat(2,1fr)">${kpi("Teléfono",c.phone)+kpi("Email",c.email)+kpi("Valor",euro(c.value))+kpi("Última visita",fmt(c.last))}</div><div class="card" style="margin-top:10px"><h3>${c.preference}</h3><p class="muted">${c.notes}</p></div><div class="ctarow"><a class="cta call" href="tel:${cleanPhone(c.phone)}">Llamar</a><a class="cta mail" href="mailto:${c.email}">Mail</a><a class="cta wa" href="https://wa.me/${wa}">WhatsApp</a><button type="button" data-new>Nueva cita</button></div>`;
  }

  async function startCamera(){
    const status = $("#ocrStatus");
    const video = $("#cameraStream");
    const preview = $("#ocrPreview");
    const capture = $("#capturePhoto");
    const open = $("#openCamera");
    if(!video || !navigator.mediaDevices?.getUserMedia){
      if(status) status.textContent = "Este navegador no permite abrir la cámara. Usa Subir foto.";
      return;
    }
    try{
      stopCamera();
      cameraStream = await navigator.mediaDevices.getUserMedia({video:{facingMode:{ideal:"environment"}}, audio:false});
      video.srcObject = cameraStream;
      video.hidden = false;
      if(preview) preview.hidden = true;
      if(open) open.hidden = true;
      if(capture) capture.disabled = false;
      if(status) status.textContent = "Cámara abierta. Encuadra el cuaderno y pulsa Capturar.";
    }catch(e){
      if(status) status.textContent = "No se pudo abrir la cámara. Usa Subir foto o revisa permisos.";
    }
  }

  function stopCamera(){
    if(cameraStream){
      cameraStream.getTracks().forEach(t=>t.stop());
      cameraStream = null;
    }
  }

  function capturePhoto(){
    const video = $("#cameraStream");
    const canvas = $("#cameraCanvas");
    const preview = $("#ocrPreview");
    const status = $("#ocrStatus");
    const capture = $("#capturePhoto");
    const open = $("#openCamera");
    if(!video || !canvas || !video.videoWidth){
      toast("Abre la cámara primero");
      return;
    }
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video,0,0,canvas.width,canvas.height);
    canvas.toBlob(blob => {
      imageBlob = blob;
      preview.src = URL.createObjectURL(blob);
      preview.hidden = false;
      video.hidden = true;
      stopCamera();
      if(open) open.hidden = false;
      if(capture) capture.disabled = true;
      if(status) status.textContent = "Foto capturada. Pulsa Extraer texto.";
    },"image/jpeg",0.92);
  }

  function uploadPhoto(file){
    const preview = $("#ocrPreview");
    const video = $("#cameraStream");
    const status = $("#ocrStatus");
    const capture = $("#capturePhoto");
    const open = $("#openCamera");
    if(!file) return;
    stopCamera();
    imageBlob = file;
    if(preview){
      preview.src = URL.createObjectURL(file);
      preview.hidden = false;
    }
    if(video) video.hidden = true;
    if(open) open.hidden = false;
    if(capture) capture.disabled = true;
    if(status) status.textContent = "Imagen cargada. Pulsa Extraer texto.";
  }

  async function runOCR(){
    const status = $("#ocrStatus");
    if(!imageBlob){
      toast("Haz una foto o sube una imagen del cuaderno");
      return;
    }
    if(status) status.textContent = "Intentando OCR local del navegador...";
    try{
      if("TextDetector" in window){
        const detector = new TextDetector();
        const bitmap = await createImageBitmap(imageBlob);
        const result = await detector.detect(bitmap);
        $("#ocrText").value = result.map(x=>x.rawValue || x.text || "").join("\n");
        if(status) status.textContent = "Texto extraído con OCR local.";
        parseOCR(false);
      }else{
        if(status) status.textContent = "Este navegador no ofrece OCR local. Escribe o pega el texto reconocido y convierte.";
      }
    }catch(e){
      if(status) status.textContent = "No se pudo extraer OCR local. Revisa el texto y convierte.";
    }
  }

  function parseOCR(show = true){
    const input = $("#ocrText");
    const output = $("#parsedOCR");
    if(!input || !output) return;
    const text = input.value.trim();
    parsedOCR = [];
    if(!text){
      output.innerHTML = `<div class="card">Sin texto para convertir.</div>`;
      return;
    }
    const lines = text.split(/\n+/).map(x=>x.trim()).filter(Boolean);
    parsedOCR = lines.map((line,i)=>{
      const dateMatch = line.match(/(\d{1,2})[\/\-](\d{1,2})(?:[\/\-](\d{2,4}))?/);
      const timeMatch = line.match(/(\d{1,2})[:\.](\d{2})/);
      const phoneMatch = line.match(/(\+?\d[\d\s]{7,})/);
      const durMatch = line.match(/(\d{2,3})\s?min/i);
      const priceMatch = line.match(/(\d{2,4})\s?€/);
      const clean = line
        .replace(dateMatch?.[0] || "", "")
        .replace(timeMatch?.[0] || "", "")
        .replace(phoneMatch?.[0] || "", "")
        .replace(durMatch?.[0] || "", "")
        .replace(priceMatch?.[0] || "", "")
        .trim();
      const words = clean.split(/\s+/).filter(Boolean);
      const client = (words.slice(0,2).join(" ") || `Cliente ${i+1}`).replace(/\b\w/g,c=>c.toUpperCase());
      const year = dateMatch ? (dateMatch[3] ? (dateMatch[3].length===2 ? "20"+dateMatch[3] : dateMatch[3]) : "2026") : "2026";
      const dateValue = dateMatch ? `${year}-${String(dateMatch[2]).padStart(2,"0")}-${String(dateMatch[1]).padStart(2,"0")}` : iso(new Date());
      const artist = ["Alicia","Diego","Nora"].find(a=>line.toLowerCase().includes(a.toLowerCase())) || "Equipo INKLAB";
      const service = ["Diseño","Retoque","Piercing","Consulta"].find(s=>line.toLowerCase().includes(s.toLowerCase())) || "Tatuaje";
      return {
        id:"ocr"+Date.now()+i,
        client,
        phone:phoneMatch ? phoneMatch[1].replace(/\s/g,"") : "",
        email:"",
        whatsapp:phoneMatch ? phoneMatch[1].replace(/\s/g,"") : "",
        date:dateValue,
        time:timeMatch ? `${String(timeMatch[1]).padStart(2,"0")}:${timeMatch[2]}` : "10:00",
        duration:durMatch ? durMatch[1] : 120,
        artist,
        service,
        status:"Pendiente",
        detail:clean,
        notes:"Importada desde Scanner.",
        price:priceMatch ? priceMatch[1] : 180
      };
    });
    output.innerHTML = parsedOCR.map(a=>`<div class="appointment"><div class="cardtop"><div><div class="event-title">${a.date} · ${a.time} · ${a.client}</div><div class="event-meta">${a.artist} · ${a.service} · ${a.detail}</div></div><span class="pill warn">Nueva</span></div></div>`).join("");
    if(show) toast("Texto convertido a citas");
  }

  function importOCR(){
    if(!parsedOCR.length) parseOCR(false);
    if(!parsedOCR.length){
      toast("No hay citas detectadas");
      return;
    }
    state.appointments = state.appointments.concat(parsedOCR);
    saveState();
    $("#parsedOCR").innerHTML = `<div class="card">Citas importadas.</div>`;
    parsedOCR = [];
    toast("Citas importadas");
  }

  function bindBase(){
    setTheme();

    $$("[data-nav]").forEach(a=>{
      if(a.dataset.nav === document.documentElement.dataset.page) a.classList.add("active");
      else a.classList.remove("active");
    });

    const theme = $("#themeToggle");
    if(theme){
      theme.addEventListener("click",()=>{
        localStorage.setItem(THEME, localStorage.getItem(THEME)==="night" ? "day" : "night");
        setTheme();
      });
    }

    const menu = $("#menuToggle");
    const nav = $("#mainNav");
    const scrim = $("#navScrim");
    function closeMenu(){
      document.body.classList.remove("menu-open");
      if(nav) nav.classList.remove("open");
      if(menu) menu.setAttribute("aria-expanded","false");
    }
    function openMenu(){
      document.body.classList.add("menu-open");
      if(nav) nav.classList.add("open");
      if(menu) menu.setAttribute("aria-expanded","true");
    }
    if(menu && nav){
      menu.addEventListener("click",()=>nav.classList.contains("open") ? closeMenu() : openMenu());
      if(scrim) scrim.addEventListener("click",closeMenu);
      $$("a",nav).forEach(a=>a.addEventListener("click",closeMenu));
      document.addEventListener("keydown",e=>{ if(e.key === "Escape") closeMenu(); });
    }

    document.addEventListener("click",e=>{
      const newBtn = e.target.closest("[data-new]");
      if(newBtn){ e.preventDefault(); openModal(); return; }

      const editBtn = e.target.closest("[data-edit]");
      if(editBtn){ e.preventDefault(); openModal(editBtn.dataset.edit); return; }

      const templateBtn = e.target.closest("[data-template]");
      if(templateBtn){ e.preventDefault(); selectedTemplate = templateBtn.dataset.template; renderTemplates(); return; }

      const clientBtn = e.target.closest("[data-client]");
      if(clientBtn){ e.preventDefault(); selectedClient = clientBtn.dataset.client; renderClients(); return; }

      const jump = e.target.closest("[data-jump]");
      if(jump){ e.preventDefault(); currentDate = new Date(jump.dataset.jump+"T12:00:00"); currentView = "day"; renderAgenda(); return; }

      if(e.target.closest("[data-close]")){ e.preventDefault(); closeModal(); }
    });

    const form = $("#appointmentForm");
    if(form) form.addEventListener("submit",saveAppointment);
    const del = $("#deleteAppointment");
    if(del) del.addEventListener("click",deleteAppointment);

    const voiceNotes = $("#voiceNotes");
    if(voiceNotes) voiceNotes.addEventListener("click",()=>toast("Dictado preparado según soporte del navegador"));
    const voiceFill = $("#voiceFill");
    if(voiceFill) voiceFill.addEventListener("click",()=>toast("Dictado preparado según soporte del navegador"));
  }

  function bindPage(){
    $$("[data-view]").forEach(btn=>{
      btn.addEventListener("click",()=>{
        $$("[data-view]").forEach(b=>b.classList.remove("active"));
        btn.classList.add("active");
        currentView = btn.dataset.view || "day";
        renderAgenda();
      });
    });

    const prev = $("#prevPeriod");
    const next = $("#nextPeriod");
    if(prev) prev.addEventListener("click",()=>movePeriod(-1));
    if(next) next.addEventListener("click",()=>movePeriod(1));
    ["agendaSearch","artistFilter","statusFilter","serviceFilter"].forEach(id=>{
      const el = $("#"+id);
      if(el) el.addEventListener("input",renderAgenda);
    });

    const paymentSearch = $("#paymentSearch");
    const paymentStatus = $("#paymentStatus");
    if(paymentSearch) paymentSearch.addEventListener("input",renderPayments);
    if(paymentStatus) paymentStatus.addEventListener("input",renderPayments);
    const simulate = $("#simulatePayment");
    if(simulate) simulate.addEventListener("click",()=>{
      state.payments.unshift({id:"p"+Date.now(),client:"Cliente nuevo",concept:"Señal simulada",amount:90,status:"Pendiente",date:iso(new Date()),link:"https://pago.ejemplo.com/inklab/demo"});
      saveState();
      renderPayments();
      toast("Pago creado");
    });

    const templateForm = $("#templateForm");
    if(templateForm){
      templateForm.addEventListener("input",updateTemplatePreview);
      templateForm.addEventListener("submit",saveTemplate);
    }
    const copy = $("#copyTemplate");
    if(copy) copy.addEventListener("click",()=>{
      const text = $("#templatePreview")?.textContent || "";
      if(navigator.clipboard) navigator.clipboard.writeText(text);
      toast("Mensaje copiado");
    });

    const clientSearch = $("#clientSearch");
    if(clientSearch) clientSearch.addEventListener("input",renderClients);

    const openCamera = $("#openCamera");
    const startCameraBtn = $("#startCamera");
    const captureBtn = $("#capturePhoto");
    const uploadBtn = $("#uploadPhotoBtn");
    const uploadInput = $("#uploadPhoto");
    const run = $("#runOCR");
    const parse = $("#parseOCR");
    const imp = $("#importOCR");
    const ocrText = $("#ocrText");

    if(openCamera) openCamera.addEventListener("click",startCamera);
    if(startCameraBtn) startCameraBtn.addEventListener("click",startCamera);
    if(captureBtn) captureBtn.addEventListener("click",capturePhoto);
    if(uploadBtn && uploadInput) uploadBtn.addEventListener("click",()=>uploadInput.click());
    if(uploadInput) uploadInput.addEventListener("change",e=>uploadPhoto(e.target.files && e.target.files[0]));
    if(run) run.addEventListener("click",runOCR);
    if(parse) parse.addEventListener("click",()=>parseOCR(true));
    if(imp) imp.addEventListener("click",importOCR);
    if(ocrText) ocrText.addEventListener("input",()=>{ if(ocrText.value.trim()) parseOCR(false); });
  }

  function renderAll(){
    renderIndex();
    renderAgenda();
    renderPayments();
    renderLevers();
    renderTemplates();
    renderClients();
  }

  function init(){
    bindBase();
    bindPage();
    renderAll();
  }

  if(document.readyState === "loading") document.addEventListener("DOMContentLoaded",init);
  else init();
})();
