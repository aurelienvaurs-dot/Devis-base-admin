import { useState, useEffect } from "react";

// ─── CONFIG ───────────────────────────────────────────────────────────────────
const SUPA_URL = "https://yzmcqjtepybifjbyxfer.supabase.co";
const SUPA_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl6bWNxanRlcHliaWZqYnl4ZmVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY4NjYyMDQsImV4cCI6MjA5MjQ0MjIwNH0.ZwvmDp89d0OhlxgiaPL-eIQdLuDvz34P5uh9CRSOUJs";
const ADMIN_EMAIL = "aurelien.vaurs@gmail.com";

// ─── COLORS ───────────────────────────────────────────────────────────────────
const C = { 
  bg:"#0a0c1a", card:"#0f1225", border:"#1a2040",
  text:"#e2e8f0", muted:"#64748b", blue:"#3b82f6",
  green:"#22c55e", amber:"#f59e0b", red:"#ef4444",
  purple:"#8b5cf6"
};

// ─── SUPA CLIENT ──────────────────────────────────────────────────────────────
let token = null;
const supa = {
  get h(){ return { "apikey":SUPA_KEY, "Authorization":`Bearer ${token||SUPA_KEY}`, "Content-Type":"application/json" }; },
  async signIn(email, password){
    const r = await fetch(`${SUPA_URL}/auth/v1/token?grant_type=password`,{
      method:"POST", headers:{"apikey":SUPA_KEY,"Content-Type":"application/json"},
      body:JSON.stringify({email,password})
    });
    const d = await r.json();
    if(d.error_description) throw new Error(d.error_description);
    token = d.access_token;
    localStorage.setItem("admin_token", d.access_token);
    return d.user;
  },
  async signOut(){ token=null; localStorage.removeItem("admin_token"); },
  restoreSession(){
    const t = localStorage.getItem("admin_token");
    if(t){ token=t; return true; }
    return false;
  },
  async get(table, query=""){
    const r = await fetch(`${SUPA_URL}/rest/v1/${table}${query?"?"+query:""}`,{headers:this.h});
    return r.json();
  },
  async patch(table, id, data){
    await fetch(`${SUPA_URL}/rest/v1/${table}?id=eq.${id}`,{
      method:"PATCH", headers:this.h, body:JSON.stringify(data)
    });
  },
  async delete_(table, id){
    await fetch(`${SUPA_URL}/rest/v1/${table}?id=eq.${id}`,{
      method:"DELETE", headers:this.h
    });
  }
};

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const fmtDate = d => d ? new Date(d).toLocaleDateString("fr-FR",{day:"2-digit",month:"2-digit",year:"numeric"}) : "—";
const fmtDateTime = d => d ? new Date(d).toLocaleString("fr-FR",{day:"2-digit",month:"2-digit",hour:"2-digit",minute:"2-digit"}) : "—";
const fmtEur = n => n ? `${n}€/mois` : "Gratuit";

const PLAN_COLORS = {
  free:     { bg:"#1e293b", color:"#94a3b8", label:"Free" },
  pro:      { bg:"#1e3a5f", color:C.blue,    label:"Pro" },
  enterprise:{ bg:"#2d1b69", color:C.purple, label:"Enterprise" },
};

function PlanBadge({plan}){
  const p = PLAN_COLORS[plan||"free"] || PLAN_COLORS.free;
  return <span style={{padding:"2px 10px",borderRadius:10,fontSize:"0.68rem",fontWeight:700,
    background:p.bg,color:p.color,textTransform:"uppercase",letterSpacing:"0.06em"}}>{p.label}</span>;
}

function Stat({label,value,color,sub}){
  return(
    <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:"18px 20px"}}>
      <div style={{color:color||C.blue,fontWeight:800,fontSize:"1.8rem",fontFamily:"monospace",lineHeight:1}}>{value}</div>
      <div style={{color:C.text,fontSize:"0.82rem",fontWeight:600,marginTop:6}}>{label}</div>
      {sub&&<div style={{color:C.muted,fontSize:"0.72rem",marginTop:3}}>{sub}</div>}
    </div>
  );
}

// ─── LOGIN ────────────────────────────────────────────────────────────────────
function LoginScreen({onLogin}){
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [error,setError]=useState("");
  const [loading,setLoading]=useState(false);

  const submit = async() => {
    if(email !== ADMIN_EMAIL){ setError("Accès non autorisé"); return; }
    setLoading(true); setError("");
    try{
      const user = await supa.signIn(email, password);
      onLogin(user);
    }catch(e){ setError(e.message); }
    setLoading(false);
  };

  return(
    <div style={{minHeight:"100vh",background:C.bg,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Inter',system-ui,sans-serif"}}>
      <div style={{width:380,background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:"32px 28px"}}>
        <div style={{textAlign:"center",marginBottom:28}}>
          <div style={{display:"inline-flex",alignItems:"center",justifyContent:"center",width:48,height:48,
            background:`linear-gradient(135deg,${C.purple},${C.blue})`,borderRadius:12,marginBottom:12}}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
          </div>
          <div style={{color:C.text,fontWeight:800,fontSize:"1.1rem"}}>DEVIS·BASE Admin</div>
          <div style={{color:C.muted,fontSize:"0.75rem",marginTop:4}}>Accès restreint aux administrateurs</div>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          <input type="email" placeholder="Email admin" value={email} onChange={e=>setEmail(e.target.value)}
            style={{padding:"10px 12px",background:C.bg,border:`1px solid ${C.border}`,borderRadius:6,
              color:C.text,fontSize:"0.85rem",outline:"none"}}
            onKeyDown={e=>e.key==="Enter"&&submit()}/>
          <input type="password" placeholder="Mot de passe" value={password} onChange={e=>setPassword(e.target.value)}
            style={{padding:"10px 12px",background:C.bg,border:`1px solid ${C.border}`,borderRadius:6,
              color:C.text,fontSize:"0.85rem",outline:"none"}}
            onKeyDown={e=>e.key==="Enter"&&submit()}/>
          {error&&<div style={{color:C.red,fontSize:"0.77rem",padding:"8px 10px",background:"#1a0608",borderRadius:5}}>{error}</div>}
          <button onClick={submit} disabled={loading}
            style={{padding:"10px",background:C.blue,border:"none",borderRadius:6,
              color:"#fff",fontWeight:700,cursor:"pointer",fontSize:"0.85rem",opacity:loading?.6:1}}>
            {loading?"Connexion…":"Se connecter"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN DASHBOARD ───────────────────────────────────────────────────────────
function Dashboard({user, onLogout}){
  const [tab, setTab] = useState("overview");
  const [orgs, setOrgs] = useState([]);
  const [members, setMembers] = useState([]);
  const [logs, setLogs] = useState([]);
  const [postes, setPostes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState("");

  const showToast = msg => { setToast(msg); setTimeout(()=>setToast(""),3000); };

  const loadAll = async() => {
    setLoading(true);
    try{
      const [o,m,l,p] = await Promise.all([
        supa.get("organisations","select=*&order=created_at.desc"),
        supa.get("org_members","select=*"),
        supa.get("activity_logs","select=*&order=created_at.desc&limit=100"),
        supa.get("postes","select=org_id&limit=1000"),
      ]);
      setOrgs(Array.isArray(o)?o:[]);
      setMembers(Array.isArray(m)?m:[]);
      setLogs(Array.isArray(l)?l:[]);
      setPostes(Array.isArray(p)?p:[]);
    }catch(e){ console.error(e); }
    setLoading(false);
  };

  useEffect(()=>{ loadAll(); },[]);

  const setPlan = async(orgId, plan) => {
    await supa.patch("organisations", orgId, {plan});
    setOrgs(o=>o.map(x=>x.id===orgId?{...x,plan}:x));
    showToast(`Plan mis à jour → ${plan}`);
  };

  const suspendOrg = async(orgId) => {
    if(!window.confirm("Suspendre cette organisation ?")) return;
    await supa.patch("organisations", orgId, {plan:"suspended"});
    setOrgs(o=>o.map(x=>x.id===orgId?{...x,plan:"suspended"}:x));
    showToast("Organisation suspendue");
  };

  // Computed stats
  const totalOrgs = orgs.length;
  const proOrgs = orgs.filter(o=>o.plan==="pro").length;
  const entOrgs = orgs.filter(o=>o.plan==="enterprise").length;
  const freeOrgs = orgs.filter(o=>!o.plan||o.plan==="free").length;
  const mrr = proOrgs*49 + entOrgs*149;
  const totalMembers = members.length;
  const totalPostes = postes.length;

  // Org enrichment
  const enrichedOrgs = orgs.map(o=>({
    ...o,
    memberCount: members.filter(m=>m.org_id===o.id).length,
    postesCount: postes.filter(p=>p.org_id===o.id).length,
    lastActivity: logs.filter(l=>l.org_id===o.id)[0]?.created_at||null,
  }));

  const filteredOrgs = enrichedOrgs.filter(o=>
    o.name?.toLowerCase().includes(search.toLowerCase())
  );

  const tabs = [
    {id:"overview", label:"Vue d'ensemble", icon:"📊"},
    {id:"orgs",     label:"Organisations",  icon:"🏢"},
    {id:"users",    label:"Utilisateurs",   icon:"👥"},
    {id:"logs",     label:"Activité",       icon:"📋"},
    {id:"revenue",  label:"Revenus",        icon:"💰"},
  ];

  const s = {
    layout: {display:"flex",minHeight:"100vh",background:C.bg,fontFamily:"'Inter',system-ui,sans-serif",color:C.text,fontSize:"0.85rem"},
    sidebar: {width:220,background:C.card,borderRight:`1px solid ${C.border}`,display:"flex",flexDirection:"column",flexShrink:0},
    main: {flex:1,display:"flex",flexDirection:"column",overflow:"hidden"},
    header: {background:C.card,borderBottom:`1px solid ${C.border}`,padding:"14px 24px",display:"flex",alignItems:"center",justifyContent:"space-between"},
    content: {flex:1,overflowY:"auto",padding:"24px"},
    navItem: {display:"flex",alignItems:"center",gap:10,padding:"10px 16px",cursor:"pointer",borderRadius:6,margin:"2px 8px",color:C.muted,fontSize:"0.82rem"},
    navActive: {background:`${C.blue}15`,color:C.blue},
    table: {width:"100%",borderCollapse:"collapse"},
    th: {padding:"10px 12px",textAlign:"left",borderBottom:`1px solid ${C.border}`,color:C.muted,fontSize:"0.7rem",textTransform:"uppercase",letterSpacing:"0.08em",background:C.card},
    td: {padding:"10px 12px",borderBottom:`1px solid ${C.border}10`,fontSize:"0.82rem"},
    inp: {padding:"8px 12px",background:C.bg,border:`1px solid ${C.border}`,borderRadius:6,color:C.text,fontSize:"0.82rem",outline:"none"},
    btn: {padding:"6px 14px",background:C.blue,border:"none",borderRadius:5,color:"#fff",fontWeight:600,cursor:"pointer",fontSize:"0.77rem"},
    btnDanger: {padding:"6px 12px",background:"transparent",border:`1px solid ${C.red}60`,borderRadius:5,color:C.red,cursor:"pointer",fontSize:"0.75rem"},
  };

  return(
    <div style={s.layout}>
      {toast&&<div style={{position:"fixed",top:12,right:12,zIndex:9999,padding:"10px 18px",
        background:C.green,borderRadius:6,color:"#fff",fontWeight:600,fontSize:"0.8rem",boxShadow:"0 4px 20px rgba(0,0,0,.4)"}}>
        {toast}
      </div>}

      {/* Sidebar */}
      <div style={s.sidebar}>
        <div style={{padding:"20px 16px",borderBottom:`1px solid ${C.border}`}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:32,height:32,background:`linear-gradient(135deg,${C.purple},${C.blue})`,
              borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center"}}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
            </div>
            <div>
              <div style={{color:C.text,fontWeight:700,fontSize:"0.85rem"}}>DEVIS·BASE</div>
              <div style={{color:C.muted,fontSize:"0.67rem"}}>Super Admin</div>
            </div>
          </div>
        </div>
        <div style={{flex:1,padding:"8px 0"}}>
          {tabs.map(t=>(
            <div key={t.id} style={{...s.navItem,...(tab===t.id?s.navActive:{})}}
              onClick={()=>setTab(t.id)}>
              <span>{t.icon}</span><span>{t.label}</span>
            </div>
          ))}
        </div>
        <div style={{padding:"12px 16px",borderTop:`1px solid ${C.border}`}}>
          <div style={{color:C.muted,fontSize:"0.72rem",marginBottom:6}}>{user?.email}</div>
          <button onClick={onLogout} style={{...s.btnDanger,width:"100%",padding:"7px"}}>
            Déconnexion
          </button>
        </div>
      </div>

      {/* Main */}
      <div style={s.main}>
        <div style={s.header}>
          <div style={{color:C.text,fontWeight:700,fontSize:"0.95rem"}}>
            {tabs.find(t=>t.id===tab)?.icon} {tabs.find(t=>t.id===tab)?.label}
          </div>
          <button onClick={loadAll} style={{...s.btn,background:"transparent",border:`1px solid ${C.border}`,color:C.muted}}>
            ↻ Actualiser
          </button>
        </div>

        <div style={s.content}>
          {loading&&<div style={{color:C.muted,textAlign:"center",padding:40}}>Chargement…</div>}

          {/* ── OVERVIEW ── */}
          {!loading&&tab==="overview"&&(
            <div style={{display:"flex",flexDirection:"column",gap:20}}>
              <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14}}>
                <Stat label="Organisations" value={totalOrgs} color={C.blue}/>
                <Stat label="MRR" value={`${mrr}€`} color={C.green} sub={`${proOrgs} Pro · ${entOrgs} Enterprise`}/>
                <Stat label="Utilisateurs" value={totalMembers} color={C.purple}/>
                <Stat label="Postes en base" value={totalPostes} color={C.amber}/>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14}}>
                <Stat label="Plan Free" value={freeOrgs} color={C.muted}/>
                <Stat label="Plan Pro" value={proOrgs} color={C.blue} sub={`${proOrgs*49}€/mois`}/>
                <Stat label="Plan Enterprise" value={entOrgs} color={C.purple} sub={`${entOrgs*149}€/mois`}/>
              </div>
              {/* Recent orgs */}
              <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10}}>
                <div style={{padding:"14px 18px",borderBottom:`1px solid ${C.border}`,color:C.text,fontWeight:600,fontSize:"0.85rem"}}>
                  Dernières inscriptions
                </div>
                <table style={s.table}>
                  <thead><tr>
                    <th style={s.th}>Organisation</th>
                    <th style={s.th}>Plan</th>
                    <th style={s.th}>Membres</th>
                    <th style={s.th}>Date</th>
                  </tr></thead>
                  <tbody>
                    {enrichedOrgs.slice(0,8).map((o,i)=>(
                      <tr key={o.id} style={{background:i%2===0?"transparent":C.bg+"80"}}>
                        <td style={{...s.td,color:C.text,fontWeight:500}}>{o.name}</td>
                        <td style={s.td}><PlanBadge plan={o.plan}/></td>
                        <td style={{...s.td,color:C.muted}}>{o.memberCount}</td>
                        <td style={{...s.td,color:C.muted,fontSize:"0.75rem"}}>{fmtDate(o.created_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── ORGANISATIONS ── */}
          {!loading&&tab==="orgs"&&(
            <div style={{display:"flex",flexDirection:"column",gap:14}}>
              <div style={{display:"flex",gap:10,alignItems:"center"}}>
                <input style={{...s.inp,flex:1}} placeholder="Rechercher une organisation…"
                  value={search} onChange={e=>setSearch(e.target.value)}/>
                <span style={{color:C.muted,fontSize:"0.78rem"}}>{filteredOrgs.length} résultat{filteredOrgs.length!==1?"s":""}</span>
              </div>
              <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,overflow:"hidden"}}>
                <table style={s.table}>
                  <thead><tr>
                    <th style={s.th}>Organisation</th>
                    <th style={s.th}>Plan</th>
                    <th style={{...s.th,textAlign:"right"}}>Membres</th>
                    <th style={{...s.th,textAlign:"right"}}>Devis</th>
                    <th style={{...s.th,textAlign:"right"}}>Postes</th>
                    <th style={s.th}>Créé le</th>
                    <th style={s.th}>Dernière activité</th>
                    <th style={s.th}>Actions</th>
                  </tr></thead>
                  <tbody>
                    {filteredOrgs.map((o,i)=>(
                      <tr key={o.id} style={{background:i%2===0?"transparent":C.bg+"80"}}>
                        <td style={{...s.td,color:C.text,fontWeight:500}}>{o.name}</td>
                        <td style={s.td}><PlanBadge plan={o.plan}/></td>
                        <td style={{...s.td,textAlign:"right",color:C.muted,fontFamily:"monospace"}}>{o.memberCount}</td>
                        <td style={{...s.td,textAlign:"right",color:C.muted,fontFamily:"monospace"}}>{o.devis_count||0}</td>
                        <td style={{...s.td,textAlign:"right",color:C.muted,fontFamily:"monospace"}}>{o.postesCount}</td>
                        <td style={{...s.td,color:C.muted,fontSize:"0.75rem"}}>{fmtDate(o.created_at)}</td>
                        <td style={{...s.td,color:C.muted,fontSize:"0.75rem"}}>{fmtDate(o.lastActivity)}</td>
                        <td style={{...s.td}}>
                          <div style={{display:"flex",gap:6,alignItems:"center"}}>
                            <select style={{...s.inp,fontSize:"0.73rem",padding:"4px 8px"}}
                              value={o.plan||"free"} onChange={e=>setPlan(o.id,e.target.value)}>
                              <option value="free">Free</option>
                              <option value="pro">Pro</option>
                              <option value="enterprise">Enterprise</option>
                            </select>
                            <button style={s.btnDanger} onClick={()=>suspendOrg(o.id)}>⛔</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── USERS ── */}
          {!loading&&tab==="users"&&(
            <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,overflow:"hidden"}}>
              <div style={{padding:"14px 18px",borderBottom:`1px solid ${C.border}`,color:C.text,fontWeight:600}}>
                {members.length} utilisateurs
              </div>
              <table style={s.table}>
                <thead><tr>
                  <th style={s.th}>Email</th>
                  <th style={s.th}>Organisation</th>
                  <th style={s.th}>Rôle</th>
                  <th style={s.th}>Rejoint le</th>
                </tr></thead>
                <tbody>
                  {members.map((m,i)=>{
                    const org = orgs.find(o=>o.id===m.org_id);
                    return(
                      <tr key={m.id} style={{background:i%2===0?"transparent":C.bg+"80"}}>
                        <td style={{...s.td,color:C.text}}>{m.email||"—"}</td>
                        <td style={{...s.td,color:C.muted}}>{org?.name||"—"}</td>
                        <td style={s.td}>
                          <span style={{padding:"2px 8px",borderRadius:10,fontSize:"0.68rem",fontWeight:700,
                            background:m.role==="admin"?`${C.blue}20`:`${C.muted}20`,
                            color:m.role==="admin"?C.blue:C.muted}}>
                            {m.role==="admin"?"Admin":"Membre"}
                          </span>
                        </td>
                        <td style={{...s.td,color:C.muted,fontSize:"0.75rem"}}>{fmtDate(m.created_at)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* ── LOGS ── */}
          {!loading&&tab==="logs"&&(
            <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,overflow:"hidden"}}>
              <div style={{padding:"14px 18px",borderBottom:`1px solid ${C.border}`,color:C.text,fontWeight:600}}>
                Dernières activités
              </div>
              {logs.length===0?(
                <div style={{padding:30,textAlign:"center",color:C.muted}}>Aucune activité enregistrée</div>
              ):(
                <table style={s.table}>
                  <thead><tr>
                    <th style={s.th}>Date</th>
                    <th style={s.th}>Organisation</th>
                    <th style={s.th}>Action</th>
                    <th style={s.th}>Détails</th>
                  </tr></thead>
                  <tbody>
                    {logs.map((l,i)=>{
                      const org=orgs.find(o=>o.id===l.org_id);
                      return(
                        <tr key={l.id} style={{background:i%2===0?"transparent":C.bg+"80"}}>
                          <td style={{...s.td,color:C.muted,fontSize:"0.75rem",whiteSpace:"nowrap"}}>{fmtDateTime(l.created_at)}</td>
                          <td style={{...s.td,color:C.text}}>{org?.name||"—"}</td>
                          <td style={s.td}>
                            <span style={{padding:"2px 8px",borderRadius:4,fontSize:"0.7rem",
                              background:`${C.blue}15`,color:C.blue}}>{l.action}</span>
                          </td>
                          <td style={{...s.td,color:C.muted,fontSize:"0.75rem"}}>
                            {l.details?JSON.stringify(l.details).slice(0,60):"—"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {/* ── REVENUE ── */}
          {!loading&&tab==="revenue"&&(
            <div style={{display:"flex",flexDirection:"column",gap:14}}>
              <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14}}>
                <Stat label="MRR Total" value={`${mrr}€`} color={C.green} sub="Revenus mensuels récurrents"/>
                <Stat label="ARR Estimé" value={`${mrr*12}€`} color={C.green} sub="Revenus annuels récurrents"/>
                <Stat label="ARPU" value={totalOrgs>0?`${Math.round(mrr/totalOrgs)}€`:"—"} color={C.blue} sub="Revenu moyen par organisation"/>
              </div>
              <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10}}>
                <div style={{padding:"14px 18px",borderBottom:`1px solid ${C.border}`,color:C.text,fontWeight:600}}>
                  Répartition par plan
                </div>
                <div style={{padding:"20px"}}>
                  {[
                    {plan:"Free",count:freeOrgs,rev:0,color:C.muted},
                    {plan:"Pro",count:proOrgs,rev:proOrgs*49,color:C.blue},
                    {plan:"Enterprise",count:entOrgs,rev:entOrgs*149,color:C.purple},
                  ].map(p=>(
                    <div key={p.plan} style={{display:"flex",alignItems:"center",gap:14,marginBottom:14}}>
                      <div style={{width:90,color:p.color,fontWeight:600,fontSize:"0.82rem"}}>{p.plan}</div>
                      <div style={{flex:1,height:8,background:C.border,borderRadius:4,overflow:"hidden"}}>
                        <div style={{height:"100%",width:`${totalOrgs>0?(p.count/totalOrgs*100):0}%`,
                          background:p.color,borderRadius:4,transition:"width .3s"}}/>
                      </div>
                      <div style={{width:60,textAlign:"right",color:C.muted,fontSize:"0.78rem",fontFamily:"monospace"}}>{p.count} org</div>
                      <div style={{width:80,textAlign:"right",color:C.green,fontSize:"0.82rem",fontFamily:"monospace",fontWeight:600}}>
                        {p.rev>0?`${p.rev}€/m`:"—"}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────
export default function App(){
  const [user,setUser]=useState(null);
  const [checked,setChecked]=useState(false);

  useEffect(()=>{
    if(supa.restoreSession()) setUser({email:ADMIN_EMAIL});
    setChecked(true);
  },[]);

  const handleLogout = async() => { await supa.signOut(); setUser(null); };

  if(!checked) return <div style={{minHeight:"100vh",background:"#0a0c1a",display:"flex",alignItems:"center",justifyContent:"center"}}>
    <div style={{width:28,height:28,border:"3px solid #1a2040",borderTop:`3px solid #3b82f6`,borderRadius:"50%",animation:"spin .9s linear infinite"}}/>
    <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
  </div>;

  if(!user) return <LoginScreen onLogin={u=>setUser(u)}/>;
  return <Dashboard user={user} onLogout={handleLogout}/>;
}
