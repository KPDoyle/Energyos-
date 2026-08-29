import React, { useEffect, useMemo, useState } from 'react';
import {
  Activity,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  BatteryCharging,
  Bell,
  Building2,
  Check,
  ChevronDown,
  CircleDollarSign,
  CloudSun,
  Cpu,
  Gauge,
  Grid2X2,
  Home,
  HousePlug,
  Leaf,
  Lightbulb,
  Menu,
  PlugZap,
  RefreshCw,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  Sun,
  ThermometerSun,
  Users,
  WalletCards,
  X,
  Zap,
} from 'lucide-react';

const profiles = {
  home: {
    name: 'Willow House',
    type: 'Home',
    subtitle: '4 bed • Oxfordshire',
    score: 88,
    monthly: '£61',
    monthlyDelta: '£74',
    generation: '612',
    generationPct: 96,
    selfUse: 71,
    export: '£34.20',
    carbon: '184',
  },
  studio: {
    name: 'Northbank Studio',
    type: 'SME',
    subtitle: 'Light commercial • Reading',
    score: 82,
    monthly: '£1,146',
    monthlyDelta: '£392',
    generation: '4,820',
    generationPct: 91,
    selfUse: 78,
    export: '£186',
    carbon: '1,310',
  },
  portfolio: {
    name: 'Greenway Portfolio',
    type: 'Portfolio',
    subtitle: '24 properties • Midlands',
    score: 79,
    monthly: '£3,940',
    monthlyDelta: '£1,214',
    generation: '18,640',
    generationPct: 89,
    selfUse: 73,
    export: '£714',
    carbon: '5,880',
  },
};

const customerNavItems = [
  { id: 'overview', label: 'Home', icon: Grid2X2 },
  { id: 'lifetime', label: 'My Value', icon: CircleDollarSign },
  { id: 'optimise', label: 'Optimise', icon: Sparkles },
  { id: 'assets', label: 'Assets', icon: BatteryCharging },
  { id: 'tariffs', label: 'Tariffs', icon: WalletCards },
  { id: 'engineer', label: 'Support', icon: Cpu },
];

const installerNavItems = [
  { id: 'installer', label: 'Portfolio', icon: Grid2X2 },
  { id: 'customers', label: 'Customers', icon: Users },
  { id: 'opportunities', label: 'Opportunities', icon: Sparkles },
  { id: 'engineer', label: 'Service', icon: Cpu },
  { id: 'insights', label: 'Analytics', icon: Activity },
];

const chart = {
  consumption: [62, 58, 71, 68, 76, 74, 83, 79, 91, 86, 72, 65, 61, 56, 68, 73, 78, 84, 92, 88, 80, 74, 69, 64],
  generation: [0, 0, 0, 0, 2, 8, 22, 41, 58, 73, 84, 91, 96, 92, 80, 63, 41, 20, 7, 1, 0, 0, 0, 0],
};

const tariffOptions = [
  {name:'Current Flex 24', supplier:'Current supplier', import:'26.8p', export:'8.0p', cost:'£1,612', net:'£1,296', current:true},
  {name:'Smart Day/Night', supplier:'Provider A', import:'8.5–31.2p', export:'15.0p', cost:'£1,374', net:'£962', best:true},
  {name:'Dynamic Saver', supplier:'Provider B', import:'5.4–37.1p', export:'12.0p', cost:'£1,421', net:'£1,078'},
  {name:'Fixed Solar Plus', supplier:'Provider C', import:'24.4p', export:'16.5p', cost:'£1,544', net:'£1,104'},
];

const defaultCustomers = [
  {name:'Willow House', system:'8.4 kWp + 10.4 kWh', score:88, issue:'Optimised', value:'£684'},
  {name:'The Old Mill', system:'12.2 kWp + 13.5 kWh', score:72, issue:'2 actions', value:'£1,142'},
  {name:'Arden Dental', system:'34 kWp + 26 kWh', score:81, issue:'Tariff review', value:'£2,840'},
  {name:'Moorland Farm', system:'24 kWp solar', score:64, issue:'Service due', value:'£1,390'},
  {name:'Parkview House', system:'6.8 kWp + EV', score:91, issue:'Optimised', value:'£412'},
  {name:'Kingsway Offices', system:'48 kWp + 40 kWh', score:76, issue:'1 action', value:'£3,210'},
  {name:'Rosebank Farm', system:'18 kWp + 13.5 kWh', score:83, issue:'Optimised', value:'£1,020'},
  {name:'Wren Court', system:'10.2 kWp + EV', score:69, issue:'Service due', value:'£890'},
];

function usePersistentState(key, initialValue) {
  const [value, setValueState] = useState(() => {
    try {
      const saved = localStorage.getItem(key);
      return saved !== null ? JSON.parse(saved) : initialValue;
    } catch {
      return initialValue;
    }
  });
  const setValue = (next) => {
    setValueState((current) => {
      const resolved = typeof next === 'function' ? next(current) : next;
      try { localStorage.setItem(key, JSON.stringify(resolved)); } catch {}
      return resolved;
    });
  };
  return [value, setValue];
}

function downloadFile(filename, content, type='text/plain;charset=utf-8') {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function Modal({ title, subtitle, onClose, children }) {
  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <div className="app-modal" role="dialog" aria-modal="true" aria-label={title} onMouseDown={(e)=>e.stopPropagation()}>
        <div className="modal-head">
          <div><span className="eyebrow green">Headroom · EnergyOS</span><h2>{title}</h2>{subtitle && <p>{subtitle}</p>}</div>
          <button className="icon-button" onClick={onClose} aria-label="Close"><X size={18}/></button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}

function FormField({ label, children }) {
  return <label className="form-field"><span>{label}</span>{children}</label>;
}

function Logo() {
  return (
    <div className="brand headroom-brand">
      <img
        className="headroom-logo"
        src="https://headroom.technology/headroom-logo.png"
        alt="Headroom"
      />
      <div className="headroom-product">
        <span>Platform</span>
        <strong>EnergyOS</strong>
      </div>
    </div>
  );
}

function Sidebar({ active, setActive, open, setOpen, role, setRole }) {
  const navItems = role === 'installer' ? installerNavItems : customerNavItems;
  const switchRole = (nextRole) => {
    setRole(nextRole);
    setActive(nextRole === 'installer' ? 'installer' : 'overview');
    setOpen(false);
  };
  return (
    <>
      <aside className={"sidebar " + (open ? 'open' : '')}>
        <div className="sidebar-top">
          <Logo />
          <button className="icon-button sidebar-close" onClick={() => setOpen(false)} aria-label="Close menu"><X size={19} /></button>
        </div>

        <div className="role-switcher" aria-label="EnergyOS workspace">
          <button className={role==='customer'?'active':''} onClick={()=>switchRole('customer')}>
            <Home size={14}/><span>Customer</span>
          </button>
          <button className={role==='installer'?'active':''} onClick={()=>switchRole('installer')}>
            <Users size={14}/><span>EnergyOS Pro</span>
          </button>
        </div>

        <nav className="nav">
          <div className="nav-caption">{role === 'installer' ? 'Installer workspace' : 'Customer workspace'}</div>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => { setActive(item.id); setOpen(false); }}
                className={"nav-item " + (active === item.id ? 'active' : '')}
              >
                <Icon size={18} strokeWidth={1.8} />
                <span>{item.label}</span>
                {role==='customer' && item.id === 'optimise' && <span className="nav-badge">3</span>}
              </button>
            );
          })}
        </nav>
        <div className="sidebar-spacer" />
        <div className="assurance-card">
          <div className="assurance-icon"><ShieldCheck size={18} /></div>
          <div>
            <strong>{role==='installer'?'EnergyOS Pro':'Headroom EnergyOS'}</strong>
            <p>{role==='installer'?'Manage customers, service and lifetime opportunities.':'Independent lifetime energy intelligence for your property.'}</p>
          </div>
        </div>
        <div className="profile-mini">
          <div className="avatar">KD</div>
          <div>
            <strong>Kevin Doyle</strong>
            <span>{role==='installer'?'Installer workspace':'Customer workspace'}</span>
          </div>
          <Settings size={17} />
        </div>
      </aside>
      {open && <button className="sidebar-scrim" onClick={() => setOpen(false)} aria-label="Close menu" />}
    </>
  );
}

function Header({ profileKey, setProfileKey, onMenu, onSearch, onNotifications, unread, role }) {
  const [open, setOpen] = useState(false);
  const p = profiles[profileKey];
  return (
    <header className="topbar">
      <button className="icon-button menu-button" onClick={onMenu} aria-label="Open menu"><Menu size={20} /></button>
      {role === 'installer' ? (
        <div className="workspace-identity">
          <span className="eyebrow">Headroom</span>
          <strong>EnergyOS Pro</strong>
          <small>Installer portfolio</small>
        </div>
      ) : (
        <div className="property-select-wrap">
          <span className="eyebrow">Energy estate</span>
          <button className="property-select" onClick={() => setOpen(!open)}>
            <div className="property-dot"><Home size={15} /></div>
            <div><strong>{p.name}</strong><span>{p.subtitle}</span></div>
            <ChevronDown size={17} />
          </button>
          {open && (
            <div className="property-menu">
              {Object.entries(profiles).map(([key, item]) => (
                <button key={key} onClick={() => { setProfileKey(key); setOpen(false); }}>
                  <div className="property-menu-icon">{item.type === 'Home' ? <Home size={17}/> : item.type === 'SME' ? <Building2 size={17}/> : <HousePlug size={17}/>}</div>
                  <div><strong>{item.name}</strong><span>{item.subtitle}</span></div>
                  {key === profileKey && <Check size={16} />}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
      <div className="topbar-actions">
        <button className="search-button" onClick={onSearch}><Search size={17}/><span>Search</span><kbd>⌘K</kbd></button>
        <button className="icon-button notification" onClick={onNotifications} aria-label="Notifications"><Bell size={19}/>{unread > 0 && <span />}</button>
      </div>
    </header>
  );
}

function ScoreRing({ score }) {
  const r = 46;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (score / 100) * circumference;
  return (
    <div className="score-ring">
      <svg viewBox="0 0 112 112">
        <circle className="score-track" cx="56" cy="56" r={r} />
        <circle className="score-progress" cx="56" cy="56" r={r} strokeDasharray={circumference} strokeDashoffset={offset} />
      </svg>
      <div><strong>{score}</strong><span>/100</span></div>
    </div>
  );
}

function MiniChart({ type = 'generation' }) {
  const values = chart[type];
  const max = Math.max(...values);
  const pts = values.map((v, i) => `${(i / (values.length - 1)) * 100},${44 - (v / max) * 38}`).join(' ');
  return (
    <svg className={"mini-chart " + type} viewBox="0 0 100 46" preserveAspectRatio="none">
      <defs>
        <linearGradient id={type + "Fill"} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="currentColor" stopOpacity=".22" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={"0,46 " + pts + " 100,46"} fill={"url(#" + type + "Fill)"} />
      <polyline points={pts} fill="none" stroke="currentColor" strokeWidth="1.6" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

function Overview({ profile, setActive }) {
  return (
    <div className="page">
      <section className="page-heading">
        <div>
          <span className="eyebrow green">Headroom · EnergyOS</span>
          <h1>Your energy asset operating system.</h1>
          <p>EnergyOS protects the lifetime financial performance of the whole energy estate — not just today's battery schedule.</p>
        </div>
        <div className="status-pill"><span /> All systems connected</div>
      </section>

      <section className="lifetime-banner">
        <div><span>Original 20-year value</span><strong>£38,400</strong></div>
        <ArrowRight size={18}/>
        <div><span>Current forecast</span><strong>£35,940</strong></div>
        <div className="lifetime-gap"><span>Recoverable value</span><strong>£1,940</strong><small>of £2,460 drift</small></div>
        <button className="secondary-button" onClick={()=>setActive('lifetime')}>Open lifetime account</button>
      </section>

      <section className="hero-grid">
        <div className="card score-card">
          <div className="card-kicker">EnergyOS score</div>
          <div className="score-row">
            <ScoreRing score={profile.score} />
            <div className="score-copy">
              <div className="grade">Excellent</div>
              <p>Your estate is performing well. Three actions could improve annual value by <strong>£684</strong>.</p>
              <button className="text-link" onClick={() => setActive('optimise')}>See optimisation plan <ArrowRight size={15}/></button>
            </div>
          </div>
        </div>

        <div className="card value-card">
          <div className="metric-top">
            <span>Estimated energy cost</span>
            <div className="trend down"><ArrowDownRight size={14}/> £{profile.monthlyDelta.replace('£','')} better</div>
          </div>
          <strong className="big-metric">{profile.monthly}<small>/mo</small></strong>
          <div className="baseline"><span>Without optimisation</span><strong>£{(Number(profile.monthly.replace(/[£,]/g,'')) + Number(profile.monthlyDelta.replace(/[£,]/g,''))).toLocaleString()}</strong></div>
          <div className="saving-strip"><Sparkles size={14}/> EnergyOS is protecting <strong>£{profile.monthlyDelta.replace('£','')}</strong> this month</div>
        </div>

        <div className="card live-card">
          <div className="card-header">
            <div><span className="live-dot" /> Live energy flow</div>
            <span>Now</span>
          </div>
          <div className="energy-flow">
            <div className="flow-node solar"><Sun size={19}/><span>Solar</span><strong>3.8 kW</strong></div>
            <div className="flow-lines"><span/><span/><span/></div>
            <div className="flow-center"><Zap size={23}/><strong>1.6</strong><span>kW home</span></div>
            <div className="flow-lines reverse"><span/><span/><span/></div>
            <div className="flow-stack">
              <div className="flow-node compact"><BatteryCharging size={17}/><span>Battery</span><strong>+1.4 kW</strong></div>
              <div className="flow-node compact"><PlugZap size={17}/><span>Grid</span><strong>+0.8 kW</strong></div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-heading">
        <div><span className="eyebrow">The four pillars</span><h2>One view of the whole energy system</h2></div>
        <button className="ghost-button" onClick={() => setActive('insights')}>View full analysis <ArrowRight size={15}/></button>
      </section>

      <section className="pillar-grid">
        <div className="card pillar-card consumption">
          <div className="pillar-icon"><Gauge size={20}/></div>
          <div className="pillar-title"><div><span>Consumption</span><strong>12.4 kWh</strong></div><span className="good">8% below baseline</span></div>
          <MiniChart type="consumption"/>
          <div className="pillar-footer"><span>Today</span><span>Peak 18:30–20:00</span></div>
        </div>
        <div className="card pillar-card generation">
          <div className="pillar-icon"><Sun size={20}/></div>
          <div className="pillar-title"><div><span>Generation</span><strong>{profile.generation} kWh</strong></div><span className="good">{profile.generationPct}% expected</span></div>
          <MiniChart type="generation"/>
          <div className="pillar-footer"><span>This month</span><span>{profile.selfUse}% self-used</span></div>
        </div>
        <div className="card pillar-card market">
          <div className="pillar-icon"><CircleDollarSign size={20}/></div>
          <div className="pillar-title"><div><span>Grid & tariff</span><strong>18.6p</strong></div><span className="neutral">effective import</span></div>
          <div className="tariff-bars">
            <span style={{height:'28%'}}/><span style={{height:'24%'}}/><span style={{height:'31%'}}/><span style={{height:'38%'}}/><span style={{height:'84%'}}/><span style={{height:'92%'}}/><span style={{height:'58%'}}/><span style={{height:'35%'}}/>
          </div>
          <div className="pillar-footer"><span>Export earned {profile.export}</span><span>Smart window 00:30</span></div>
        </div>
        <div className="card pillar-card health">
          <div className="pillar-icon"><Cpu size={20}/></div>
          <div className="pillar-title"><div><span>Asset health</span><strong>94%</strong></div><span className="good">All operational</span></div>
          <div className="health-assets">
            <div><span>Solar array</span><i><b style={{width:'97%'}}/></i><strong>97</strong></div>
            <div><span>Battery</span><i><b style={{width:'92%'}}/></i><strong>92</strong></div>
            <div><span>Inverter</span><i><b style={{width:'95%'}}/></i><strong>95</strong></div>
          </div>
          <div className="pillar-footer"><span>Warranty protected</span><span>Last check 4m ago</span></div>
        </div>
      </section>

      <section className="recommendation-layout">
        <div>
          <div className="section-heading compact">
            <div><span className="eyebrow green">Recommended for you</span><h2>Three actions. £684 annual upside.</h2></div>
          </div>
          <div className="action-list">
            <ActionCard
              priority="Do now"
              title="Shift battery charging to the low-rate window"
              copy="Your battery is currently topping up before the cheapest import period begins."
              saving="£286/yr"
              effort="2 min"
              icon={<BatteryCharging size={19}/>}
            />
            <ActionCard
              priority="Review"
              title="Your export tariff is no longer competitive"
              copy="Based on your actual export profile, two available tariffs would increase annual export value."
              saving="£238/yr"
              effort="8 min"
              icon={<WalletCards size={19}/>}
            />
            <ActionCard
              priority="Plan"
              title="Panel cleaning becomes economic in October"
              copy="Current soiling loss is too small to justify a visit. EnergyOS will keep watching the payback."
              saving="£160/yr"
              effort="No action"
              icon={<CloudSun size={19}/>}
            />
          </div>
        </div>

        <aside className="card forecast-card">
          <div className="card-header">
            <div>Tomorrow's opportunity</div><CloudSun size={18}/>
          </div>
          <div className="weather-big"><span>18°</span><div><strong>Mostly sunny</strong><p>High generation expected</p></div></div>
          <div className="forecast-stat"><span>Expected solar</span><strong>24.8 kWh</strong></div>
          <div className="forecast-stat"><span>Best battery strategy</span><strong>Hold 22%</strong></div>
          <div className="forecast-stat"><span>Best EV window</span><strong>00:30–05:30</strong></div>
          <div className="forecast-callout"><Lightbulb size={16}/><p>Charge the EV overnight and preserve daytime battery capacity for the evening peak.</p></div>
        </aside>
      </section>
    </div>
  );
}

function ActionCard({ priority, title, copy, saving, effort, icon }) {
  const [done, setDone] = usePersistentState('energyos-action-' + title, false);
  return (
    <div className={"card action-card " + (done ? 'completed' : '')}>
      <div className="action-icon">{done ? <Check size={19}/> : icon}</div>
      <div className="action-main">
        <div className="action-meta"><span>{priority}</span><span>Potential value <strong>{saving}</strong></span></div>
        <h3>{done ? 'Action queued' : title}</h3>
        <p>{done ? 'EnergyOS has added this to your optimisation plan.' : copy}</p>
      </div>
      <div className="action-side"><span>{effort}</span><button onClick={() => setDone(!done)}>{done ? 'Undo' : 'Review'} <ArrowRight size={14}/></button></div>
    </div>
  );
}

function Optimise() {
  const [mode, setMode] = usePersistentState('energyos-optimise-mode', 'value');
  const [applied, setApplied] = usePersistentState('energyos-queue', []);
  const [minSaving, setMinSaving] = usePersistentState('energyos-min-saving', 75);
  const [maxPayback, setMaxPayback] = usePersistentState('energyos-max-payback', 6);
  const [protectWarranty, setProtectWarranty] = usePersistentState('energyos-protect-warranty', true);
  const [autoSchedule, setAutoSchedule] = usePersistentState('energyos-auto-schedule', true);
  const actions = [
    { id:1, title:'Move battery top-up to 00:30', value:'£286', payback:'Immediate', confidence:96, tag:'Battery strategy' },
    { id:2, title:'Switch export tariff at next renewal', value:'£238', payback:'Immediate', confidence:92, tag:'Tariff' },
    { id:3, title:'Schedule array clean in October', value:'£160', payback:'7 months', confidence:84, tag:'Maintenance' },
    { id:4, title:'Add 5.2 kWh battery capacity', value:'£312', payback:'5.8 years', confidence:78, tag:'Upgrade' },
  ];
  const queuedValue = actions.filter(a=>applied.includes(a.id)).reduce((sum,a)=>sum+Number(a.value.replace(/[^0-9]/g,'')),0);
  return (
    <div className="page">
      <section className="page-heading">
        <div><span className="eyebrow green">Optimisation engine</span><h1>What should I do?</h1><p>Every recommendation is ranked by financial value, confidence and impact on asset life.</p></div>
        <div className="segmented"><button className={mode==='value'?'active':''} onClick={()=>setMode('value')}>Maximise value</button><button className={mode==='carbon'?'active':''} onClick={()=>setMode('carbon')}>Reduce carbon</button></div>
      </section>
      <div className="optimise-summary">
        <div><span>Identified annual upside</span><strong>£996</strong><small>across 4 actions</small></div>
        <div><span>Queued annual value</span><strong>£{queuedValue}</strong><small>{applied.length} action{applied.length===1?'':'s'} selected</small></div>
        <div><span>Forecast confidence</span><strong>91%</strong><small>12 months of data</small></div>
      </div>
      <div className="optimise-grid">
        <div className="card decision-card">
          <div className="decision-head"><Sparkles size={20}/><div><span>EnergyOS recommendation</span><h2>{mode==='carbon'?'Prioritise self-consumption and low-carbon windows.':'Make two changes now. Defer two.'}</h2></div></div>
          <p>{mode==='carbon'?'EnergyOS will favour solar self-use, avoid peak-grid periods and preserve battery health while keeping your financial thresholds in view.':'Your tariff and battery settings are the highest-confidence opportunities. Panel cleaning does not yet clear your minimum payback threshold, while extra battery capacity is useful but not urgent.'}</p>
          <div className="decision-answer"><span>Best next action</span><strong>Shift battery charging window tonight</strong><b>+£286/year</b></div>
        </div>
        <div className="card threshold-card">
          <div className="card-header"><div>Your decision rules</div><Settings size={17}/></div>
          <label><span>Minimum annual saving</span><strong>£{minSaving}</strong></label><input type="range" min="0" max="300" value={minSaving} onChange={e=>setMinSaving(Number(e.target.value))}/>
          <label><span>Maximum upgrade payback</span><strong>{maxPayback} years</strong></label><input type="range" min="1" max="12" value={maxPayback} onChange={e=>setMaxPayback(Number(e.target.value))}/>
          <button className="toggle-row toggle-button" onClick={()=>setProtectWarranty(!protectWarranty)}><span>Protect equipment warranty</span><i className={'toggle '+(protectWarranty?'on':'')}><b/></i></button>
          <button className="toggle-row toggle-button" onClick={()=>setAutoSchedule(!autoSchedule)}><span>Allow automatic schedule changes</span><i className={'toggle '+(autoSchedule?'on':'')}><b/></i></button>
        </div>
      </div>
      <div className="section-heading"><div><span className="eyebrow">Prioritised plan</span><h2>Optimisation queue</h2></div></div>
      <div className="optimise-table">
        <div className="table-head"><span>Recommendation</span><span>Annual value</span><span>Payback</span><span>Confidence</span><span></span></div>
        {actions.map(a => (
          <div className={"table-row " + (applied.includes(a.id)?'applied':'')} key={a.id}>
            <span><i className="small-icon"><Zap size={15}/></i><div><strong>{a.title}</strong><small>{a.tag}</small></div></span>
            <strong>{a.value}</strong><span>{a.payback}</span>
            <span><i className="confidence"><b style={{width:a.confidence+'%'}}/></i>{a.confidence}%</span>
            <button onClick={()=>setApplied(current=>current.includes(a.id)?current.filter(x=>x!==a.id):[...current,a.id])}>{applied.includes(a.id)?'Queued':'Queue'}</button>
          </div>
        ))}
      </div>
    </div>
  );
}

const assets = [
  { name:'Solar PV Array', model:'8.4 kWp • 21 panels', icon:Sun, health:97, status:'Optimal', meta:'6,420 kWh lifetime', warranty:'18y 4m' },
  { name:'Home Battery', model:'10.4 kWh usable', icon:BatteryCharging, health:92, status:'Optimal', meta:'312 cycles • 97% SOH', warranty:'7y 8m' },
  { name:'Hybrid Inverter', model:'8 kW • 2 MPPT', icon:Cpu, health:95, status:'Optimal', meta:'99.2% availability', warranty:'8y 4m' },
  { name:'EV Charger', model:'7.4 kW smart charger', icon:PlugZap, health:89, status:'Connected', meta:'1,840 kWh delivered', warranty:'2y 1m' },
  { name:'Heat Pump', model:'8 kW air source', icon:ThermometerSun, health:86, status:'Watch', meta:'SCOP 3.4 • +2% drift', warranty:'4y 6m' },
];

function Assets() {
  const [selected, setSelected] = useState(assets[1]);
  const [diagnosticsOpen, setDiagnosticsOpen] = useState(false);
  const [lastRefresh, setLastRefresh] = usePersistentState('energyos-last-refresh', '34 sec ago');
  const [syncing, setSyncing] = useState(false);
  const warrantyPack = () => {
    const content = [
      'HEADROOM ENERGYOS — WARRANTY EVIDENCE PACK',
      '',
      'Asset: ' + selected.name,
      'Model: ' + selected.model,
      'Health score: ' + selected.health + '/100',
      'Status: ' + selected.status,
      'Performance: ' + selected.meta,
      'Warranty remaining: ' + selected.warranty,
      'Last telemetry: ' + lastRefresh,
      'Fault codes: ' + (selected.status==='Watch' ? '1 advisory' : 'None'),
      '',
      'EnergyOS assessment:',
      selected.status==='Watch'
        ? 'Small performance drift detected. No evidence of operation outside the recorded warranty-safe envelope.'
        : 'Telemetry remains within expected operating limits and the recorded warranty-safe envelope.',
    ].join('\n');
    downloadFile(selected.name.replaceAll(' ','-') + '-warranty-evidence.txt', content);
  };
  const refresh = () => {
    setSyncing(true);
    setTimeout(()=>{ setLastRefresh(new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})); setSyncing(false); }, 650);
  };
  return (
    <div className="page">
      <section className="page-heading"><div><span className="eyebrow green">Equipment health</span><h1>Your energy assets</h1><p>One health view across manufacturers, warranties and operating data.</p></div><button className="primary-button" onClick={refresh} disabled={syncing}><RefreshCw size={16} className={syncing?'spin':''}/> {syncing?'Syncing…':'Refresh data'}</button></section>
      <div className="asset-layout">
        <div className="asset-list">
          {assets.map((a)=>{ const Icon=a.icon; return <button key={a.name} className={"card asset-row "+(selected.name===a.name?'selected':'')} onClick={()=>setSelected(a)}>
            <div className="asset-icon"><Icon size={20}/></div><div className="asset-name"><strong>{a.name}</strong><span>{a.model}</span></div>
            <div className="asset-health"><i><b style={{width:a.health+'%'}}/></i><strong>{a.health}%</strong></div>
            <span className={"asset-status "+(a.status==='Watch'?'watch':'')}>{a.status}</span><ArrowRight size={16}/>
          </button>})}
        </div>
        <aside className="card asset-detail">
          <div className="asset-detail-top"><div className="asset-icon large"><selected.icon size={24}/></div><div><span>Selected asset</span><h2>{selected.name}</h2><p>{selected.model}</p></div></div>
          <div className="health-score"><span>Health score</span><strong>{selected.health}<small>/100</small></strong><i><b style={{width:selected.health+'%'}}/></i></div>
          <div className="detail-stats"><div><span>Performance</span><strong>{selected.meta}</strong></div><div><span>Warranty remaining</span><strong>{selected.warranty}</strong></div><div><span>Last telemetry</span><strong>{lastRefresh}</strong></div><div><span>Fault codes</span><strong>{selected.status==='Watch'?'1 advisory':'None'}</strong></div></div>
          <div className="warranty-card"><ShieldCheck size={18}/><div><strong>Warranty conditions protected</strong><p>Current operating strategy stays within recorded manufacturer thresholds.</p></div></div>
          <button className="secondary-button full" onClick={()=>setDiagnosticsOpen(true)}>View diagnostics <ArrowRight size={15}/></button>
        </aside>
      </div>
      {diagnosticsOpen && <Modal title={selected.name+' diagnostics'} subtitle="Read-only diagnostic summary from the EnergyOS asset model." onClose={()=>setDiagnosticsOpen(false)}>
        <div className="diagnostic-grid">
          <div><span>Health</span><strong>{selected.health}/100</strong></div><div><span>Status</span><strong>{selected.status}</strong></div>
          <div><span>Performance</span><strong>{selected.meta}</strong></div><div><span>Warranty</span><strong>{selected.warranty}</strong></div>
        </div>
        <div className="diagnostic-note"><ShieldCheck size={18}/><div><strong>No critical intervention required.</strong><p>{selected.status==='Watch'?'EnergyOS has detected a small performance drift. Continue monitoring and schedule service only if the economic threshold is reached.':'Telemetry is within expected operating limits and warranty-safe thresholds.'}</p></div></div>
        <div className="modal-actions"><button className="secondary-button" onClick={warrantyPack}>Download warranty evidence</button><button className="primary-button" onClick={()=>setDiagnosticsOpen(false)}>Close diagnostics</button></div>
      </Modal>}
    </div>
  );
}

function Tariffs() {
  const [review, setReview] = useState(null);
  const [plannedTariff, setPlannedTariff] = usePersistentState('energyos-planned-tariff', null);
  return (
    <div className="page">
      <section className="page-heading"><div><span className="eyebrow green">Independent tariff modelling</span><h1>Tariffs, based on your actual life.</h1><p>Not a headline rate comparison. EnergyOS models your usage, generation, battery, export and exit costs together.</p></div><span className="independent-chip"><ShieldCheck size={16}/> No supplier commission</span></section>
      <div className="card tariff-answer">
        <div className="answer-icon"><Sparkles size={22}/></div><div><span>EnergyOS answer</span><h2>{plannedTariff?'Tariff review scheduled.':'Do not switch today.'}</h2><p>{plannedTariff?plannedTariff+' is saved as your next tariff review candidate. EnergyOS will keep comparing it against your current whole-system cost.':'Your current fixed import deal remains valuable. Review on 18 January, when the exit cost falls below the projected saving from Smart Day/Night.'}</p></div><div className="answer-value"><span>Projected upside</span><strong>£334/yr</strong><small>after exit costs</small></div>
      </div>
      <div className="tariff-table">
        <div className="tariff-head"><span>Tariff</span><span>Import</span><span>Export</span><span>Annual import</span><span>Net energy cost</span></div>
        {tariffOptions.map(t => <div key={t.name} className={"card tariff-row "+(t.best?'best':'')}>
          <span><div><strong>{t.name}</strong><small>{t.supplier}</small></div>{t.current&&<b className="current-pill">Current</b>}{t.best&&<b className="best-pill">Best modelled</b>}</span>
          <strong>{t.import}</strong><strong>{t.export}</strong><span>{t.cost}</span>
          <span className="tariff-cost"><strong>{t.net}</strong>{t.best&&<small className="save-text">Save £334</small>}{!t.current&&<button className="inline-action" onClick={()=>setReview(t)}>Review</button>}</span>
        </div>)}
      </div>
      <div className="card assumptions">
        <div><span className="eyebrow">What EnergyOS included</span><h3>A whole-system comparison</h3></div>
        <div className="assumption-grid"><span><Check/>12 months consumption</span><span><Check/>Solar generation curve</span><span><Check/>Battery charge limits</span><span><Check/>Actual export profile</span><span><Check/>EV charging demand</span><span><Check/>Exit / standing charges</span></div>
      </div>
      {review && <Modal title={'Review '+review.name} subtitle="EnergyOS remains advisory only and will not switch your supplier automatically." onClose={()=>setReview(null)}>
        <div className="review-summary"><div><span>Import</span><strong>{review.import}</strong></div><div><span>Export</span><strong>{review.export}</strong></div><div><span>Modelled net cost</span><strong>{review.net}</strong></div></div>
        <p className="modal-copy">Based on the current estate model, this tariff is worth keeping under review. Saving it does not instruct a supplier or create an energy contract.</p>
        <div className="modal-actions"><button className="secondary-button" onClick={()=>setReview(null)}>Cancel</button><button className="primary-button" onClick={()=>{setPlannedTariff(review.name);setReview(null)}}>Save for review</button></div>
      </Modal>}
    </div>
  );
}

function Insights() {
  const [lastReport, setLastReport] = usePersistentState('energyos-last-report', null);
  const generateReport = () => {
    const rows = [
      ['Metric','Value','Comment'],
      ['Estimated value protected','£812','12-month EnergyOS estimate'],
      ['Energy independence','68%','Up 9 percentage points'],
      ['Carbon avoided','2.2 t','Estimated this year'],
      ['Battery scheduling value','£386','Largest optimisation contribution'],
      ['Tariff decisions value','£284','Independent tariff modelling'],
      ['Self-consumption value','£142','Solar self-use improvement'],
    ];
    const csv = rows.map(r=>r.map(x=>'"'+String(x).replaceAll('"','""')+'"').join(',')).join('\n');
    downloadFile('Headroom-EnergyOS-quarterly-report.csv', csv, 'text/csv;charset=utf-8');
    setLastReport(new Date().toISOString());
  };
  return (
    <div className="page">
      <section className="page-heading"><div><span className="eyebrow green">Energy intelligence</span><h1>Understand the why.</h1><p>Quarterly reporting without the consultant's spreadsheet. Clear evidence, assumptions and actions.</p></div><button className="primary-button" onClick={generateReport}>Generate quarterly report</button></section>
      {lastReport && <div className="report-status"><Check size={14}/> Latest report generated {new Date(lastReport).toLocaleString()}</div>}
      <div className="insight-grid">
        <div className="card insight-hero">
          <span className="eyebrow">12-month performance</span><h2>EnergyOS has improved estimated asset value by <em>£812</em></h2><p>Most of the gain came from battery scheduling, followed by export tariff improvements and higher solar self-consumption.</p>
          <div className="value-bars"><div><span>Battery scheduling</span><i><b style={{width:'83%'}}/></i><strong>£386</strong></div><div><span>Tariff decisions</span><i><b style={{width:'61%'}}/></i><strong>£284</strong></div><div><span>Self-consumption</span><i><b style={{width:'31%'}}/></i><strong>£142</strong></div></div>
        </div>
        <div className="card metric-panel"><span>Energy independence</span><strong>68%</strong><small><ArrowUpRight size={14}/> +9 pts year on year</small><div className="donut"><b/><span>68%</span></div></div>
        <div className="card metric-panel"><span>Carbon avoided</span><strong>2.2 t</strong><small><Leaf size={14}/> this year</small><div className="leaf-stat"><Leaf size={48}/></div></div>
      </div>
      <div className="section-heading"><div><span className="eyebrow">Analysis</span><h2>What changed</h2></div></div>
      <div className="insight-list">
        <div className="card"><i><BatteryCharging/></i><div><span>Battery</span><h3>Round-trip efficiency is stable at 92.4%</h3><p>No degradation intervention is justified. Current cycle depth remains within the warranty-safe operating envelope.</p></div><strong className="positive">Healthy</strong></div>
        <div className="card"><i><Sun/></i><div><span>Solar</span><h3>Generation is 4.1% below weather-adjusted expectation</h3><p>Electrical telemetry is normal. The pattern is consistent with gradual soiling rather than equipment degradation.</p></div><strong className="watch-text">Watch</strong></div>
        <div className="card"><i><WalletCards/></i><div><span>Market</span><h3>Your export opportunity improved this quarter</h3><p>Available export pricing has moved faster than your import economics. Review independently rather than switching both together.</p></div><strong>£238/yr</strong></div>
      </div>
    </div>
  );
}

function Installer({ section='portfolio', onViewCustomer }) {
  const [customers, setCustomers] = usePersistentState('energyos-customers', defaultCustomers);
  const [showAll, setShowAll] = useState(false);
  const [adding, setAdding] = useState(false);
  const [campaignOpen, setCampaignOpen] = useState(false);
  const [campaigns, setCampaigns] = usePersistentState('energyos-campaigns', []);
  const [form, setForm] = useState({name:'',system:'',value:'£0'});
  const addCustomer = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.system.trim()) return;
    setCustomers(current=>[{name:form.name.trim(),system:form.system.trim(),score:75,issue:'New',value:form.value||'£0'},...current]);
    setForm({name:'',system:'',value:'£0'});
    setAdding(false);
  };
  const createCampaign = () => {
    setCampaigns(current=>[{name:'Battery-ready customer campaign',created:new Date().toISOString(),audience:412},...current]);
    setCampaignOpen(false);
  };
  const visible = showAll ? customers : customers.slice(0,5);
  const heading = section==='customers'
    ? ['Customer estate','Customers','Open any site to see performance, value, assets and service history.']
    : section==='opportunities'
      ? ['Commercial intelligence','Opportunities','Turn installed systems into qualified upgrade and service opportunities.']
      : ['EnergyOS Pro','Installer portfolio','Manage the installed estate, service workload and lifetime customer value from one place.'];
  return (
    <div className="page">
      <section className="page-heading"><div><span className="eyebrow green">{heading[0]}</span><h1>{heading[1]}</h1><p>{heading[2]}</p></div><button className="primary-button" onClick={()=>setAdding(true)}><Users size={16}/> Add customer</button></section>
      {section!=='customers' && <div className="fleet-kpis">
        <div className="card"><span>Customers monitored</span><strong>{(3276+customers.length).toLocaleString()}</strong><small><ArrowUpRight/> live portfolio</small></div>
        <div className="card"><span>Recurring service value</span><strong>£68.4k</strong><small>annualised</small></div>
        <div className="card"><span>Qualified opportunities</span><strong>£412k</strong><small>estimated 12-month pipeline</small></div>
        <div className="card"><span>Open service cases</span><strong>18</strong><small>7 remotely resolved</small></div>
      </div>}
      {campaigns.length>0 && <div className="report-status"><Check size={14}/> {campaigns.length} campaign{campaigns.length===1?'':'s'} created in this workspace</div>}
      <div className="installer-layout">
        <div className="card fleet-table">
          <div className="card-header"><div><span className="eyebrow">Customer fleet</span><h3>Priority accounts</h3></div><button className="ghost-button" onClick={()=>setShowAll(!showAll)}>{showAll?'Show priority':'View all'}</button></div>
          <div className="fleet-head"><span>Customer</span><span>EnergyOS</span><span>Status</span><span>Upside</span></div>
          {visible.map((customer,index)=><div className="fleet-row actionable" key={customer.name+'-'+index}><span><strong>{customer.name}</strong><small>{customer.system}</small></span><span><b>{customer.score}</b>/100</span><span className={customer.issue==='Optimised'?'positive':''}>{customer.issue}</span><span className="fleet-value"><strong>{customer.value}</strong>{customer.name==='Willow House'&&<button onClick={()=>onViewCustomer('home')}>View customer</button>}</span></div>)}
        </div>
        {section!=='customers' && <aside className="installer-side">
          <div className="card opportunity-card"><div className="card-header"><div>Next best opportunity</div><Sparkles size={18}/></div><span className="eyebrow green">Upgrade trigger</span><h2>412 customers are battery-ready</h2><p>They have sufficient export, suitable inverter configurations and modelled payback below 7 years.</p><strong>£1.16m</strong><span>estimated install revenue</span><button className="secondary-button full" onClick={()=>setCampaignOpen(true)}>Create campaign <ArrowRight size={15}/></button></div>
          <div className="card service-card"><div className="card-header"><div>Service triage</div><Activity size={18}/></div><div><span>Resolved remotely</span><strong>39%</strong></div><div><span>Engineer visits avoided</span><strong>14</strong></div><div><span>Avg. diagnostic time</span><strong>6m 18s</strong></div></div>
        </aside>}
      </div>
      {adding && <Modal title="Add customer" subtitle="Create a customer record in the local EnergyOS installer workspace." onClose={()=>setAdding(false)}>
        <form className="app-form" onSubmit={addCustomer}>
          <FormField label="Customer / site name"><input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="e.g. Red Lion Farm" autoFocus/></FormField>
          <FormField label="Installed system"><input value={form.system} onChange={e=>setForm({...form,system:e.target.value})} placeholder="e.g. 18 kWp + 13.5 kWh"/></FormField>
          <FormField label="Estimated annual upside"><input value={form.value} onChange={e=>setForm({...form,value:e.target.value})} placeholder="£0"/></FormField>
          <div className="modal-actions"><button type="button" className="secondary-button" onClick={()=>setAdding(false)}>Cancel</button><button className="primary-button" type="submit">Add customer</button></div>
        </form>
      </Modal>}
      {campaignOpen && <Modal title="Create battery campaign" subtitle="Build a campaign from the 412 battery-ready customers identified by EnergyOS." onClose={()=>setCampaignOpen(false)}>
        <div className="campaign-preview"><span>Audience</span><strong>412 customers</strong><p>Suitable export profile, compatible inverter configuration and modelled payback below seven years.</p></div>
        <div className="modal-actions"><button className="secondary-button" onClick={()=>setCampaignOpen(false)}>Cancel</button><button className="primary-button" onClick={createCampaign}>Create campaign</button></div>
      </Modal>}
    </div>
  );
}


function LifetimeValue({ profile }) {
  const [scenario, setScenario] = usePersistentState('energyos-lifetime-scenario', 'current');
  const base = profile.type === 'Home'
    ? {design:38400,current:35940,recoverable:1940,drift:2460}
    : profile.type === 'SME'
      ? {design:286000,current:258400,recoverable:22100,drift:27600}
      : {design:1120000,current:1013000,recoverable:88400,drift:107000};
  const recovered = scenario==='recovered' ? base.current + base.recoverable : base.current;
  const breakdown = profile.type === 'Home'
    ? [['Tariff drift',610],['Solar soiling',380],['Lower self-consumption',520],['Battery degradation',350],['Scheduling loss',600]]
    : profile.type === 'SME'
      ? [['Tariff drift',8200],['Generation underperformance',5100],['Demand profile drift',6400],['Asset degradation',3300],['Scheduling loss',4600]]
      : [['Tariff drift',31000],['Generation underperformance',21800],['Demand profile drift',17600],['Asset degradation',14200],['Scheduling loss',22400]];
  return (
    <div className="page">
      <section className="page-heading">
        <div><span className="eyebrow green">Lifetime energy account</span><h1>Are you getting the value you were promised?</h1><p>EnergyOS keeps a financial record of design intent, actual performance, degradation, tariffs, maintenance and recoverable value across the asset life.</p></div>
        <div className="segmented"><button className={scenario==='current'?'active':''} onClick={()=>setScenario('current')}>Current</button><button className={scenario==='recovered'?'active':''} onClick={()=>setScenario('recovered')}>After actions</button></div>
      </section>

      <section className="lifetime-hero card">
        <div className="lifetime-number"><span>Original design value</span><strong>£{base.design.toLocaleString()}</strong><small>20-year model</small></div>
        <ArrowRight size={22}/>
        <div className="lifetime-number"><span>{scenario==='recovered'?'Recovered forecast':'Current forecast'}</span><strong>£{recovered.toLocaleString()}</strong><small>{scenario==='recovered'?'after queued actions':'based on observed performance'}</small></div>
        <div className="lifetime-recovery"><span>Recoverable now</span><strong>£{base.recoverable.toLocaleString()}</strong><small>{Math.round(base.recoverable/base.drift*100)}% of identified drift</small></div>
      </section>

      <div className="lifetime-grid">
        <div className="card lifetime-breakdown">
          <div className="card-header"><div>Where value has drifted</div><Activity size={18}/></div>
          {breakdown.map(([label,value])=><div className="drift-row" key={label}><span>{label}</span><i><b style={{width:Math.min(100,(value/base.drift)*220)+'%'}}/></i><strong>£{value.toLocaleString()}</strong></div>)}
        </div>
        <div className="card lifecycle-card">
          <span className="eyebrow">Asset lifecycle</span>
          <h2>EnergyOS remembers what changed.</h2>
          <div className="lifecycle-list">
            <div><b>01</b><span><strong>Design</strong><small>Expected output, savings and payback captured</small></span><Check size={16}/></div>
            <div><b>02</b><span><strong>Commission</strong><small>Installed assets and warranty conditions recorded</small></span><Check size={16}/></div>
            <div><b>03</b><span><strong>Operate</strong><small>Actual generation, consumption and tariffs compared</small></span><Activity size={16}/></div>
            <div><b>04</b><span><strong>Maintain</strong><small>Economic service triggers and evidence packs</small></span><ShieldCheck size={16}/></div>
            <div><b>05</b><span><strong>Upgrade</strong><small>Battery, EV and heat-pump opportunities ranked by ROI</small></span><Sparkles size={16}/></div>
          </div>
        </div>
      </div>

      <div className="section-heading"><div><span className="eyebrow green">Next best actions</span><h2>Recover £{base.recoverable.toLocaleString()} of lifetime value</h2></div></div>
      <div className="lifetime-actions">
        <div className="card"><span>01</span><div><strong>Battery scheduling</strong><p>Move charging to the lowest-cost import window without breaching warranty rules.</p></div><b>£286/yr</b></div>
        <div className="card"><span>02</span><div><strong>Export tariff review</strong><p>Keep import and export economics separate and review at the right date.</p></div><b>£238/yr</b></div>
        <div className="card"><span>03</span><div><strong>Condition-led maintenance</strong><p>Delay panel cleaning until the predicted energy recovery exceeds service cost.</p></div><b>£160/yr</b></div>
      </div>
    </div>
  );
}

function EngineerAI() {
  const [caseStatus, setCaseStatus] = usePersistentState('energyos-engineer-case', 'Monitoring');
  const [briefGenerated, setBriefGenerated] = usePersistentState('energyos-engineer-brief', false);
  const createBrief = () => {
    const brief = [
      'HEADROOM ENERGYOS — ENGINEER BRIEF',
      '',
      'Site: Willow House',
      'Asset: Hybrid inverter',
      'Issue: Repeated grid over-voltage between 11:30 and 14:00',
      'Likely cause: Local grid voltage excursion',
      'Equipment failure probability: Low',
      'Estimated revenue impact: £1.84/day',
      'Recommended action: Continue monitoring for 7 days; engineer visit only if threshold persists',
      'Skills required if dispatched: Qualified electrician',
      'Parts expected: None',
      'Expected visit duration: 45 minutes',
      '',
      'Evidence: telemetry trend, event history, warranty-safe operating record.'
    ].join('\n');
    downloadFile('EnergyOS-engineer-brief-Willow-House.txt', brief);
    setBriefGenerated(true);
    setCaseStatus('Brief ready');
  };
  return (
    <div className="page">
      <section className="page-heading"><div><span className="eyebrow green">Energy Engineer AI</span><h1>Diagnose before you dispatch.</h1><p>EnergyOS combines telemetry, manuals, warranty constraints and economic impact to decide whether a site needs intervention — and scopes the job when it does.</p></div><span className="status-pill"><span/> AI triage active</span></section>

      <div className="engineer-grid">
        <div className="card engineer-case">
          <div className="card-header"><div>Live diagnostic case</div><Cpu size={18}/></div>
          <span className="eyebrow green">Willow House · Hybrid inverter</span>
          <h2>Repeated grid over-voltage</h2>
          <p>Events cluster between 11:30 and 14:00 while array output is high. Inverter electrical telemetry is otherwise normal.</p>
          <div className="engineer-answer">
            <div><span>Likely cause</span><strong>Local grid voltage excursion</strong></div>
            <div><span>Failure probability</span><strong>Low</strong></div>
            <div><span>Revenue impact</span><strong>£1.84/day</strong></div>
            <div><span>Visit required</span><strong>Not yet</strong></div>
          </div>
          <div className="diagnostic-note"><ShieldCheck size={18}/><div><strong>Warranty-safe operation confirmed.</strong><p>No evidence currently suggests the inverter itself has failed. Continue monitoring for seven days before dispatch.</p></div></div>
          <div className="modal-actions"><button className="secondary-button" onClick={()=>setCaseStatus('7-day watch')}>Start 7-day watch</button><button className="primary-button" onClick={createBrief}>Generate engineer brief</button></div>
          <div className="case-status"><span>Case status</span><strong>{caseStatus}</strong>{briefGenerated&&<Check size={15}/>}</div>
        </div>

        <aside className="engineer-side">
          <div className="card"><span className="eyebrow">Triage economics</span><strong className="engineer-metric">39%</strong><p>of service cases resolved remotely in the current installer fleet.</p></div>
          <div className="card"><span className="eyebrow">Avoided dispatch</span><strong className="engineer-metric">14</strong><p>engineer visits avoided this month through evidence-led diagnosis.</p></div>
          <div className="card"><span className="eyebrow">Average diagnosis</span><strong className="engineer-metric">6m 18s</strong><p>from alert to scoped recommendation.</p></div>
        </aside>
      </div>

      <div className="section-heading"><div><span className="eyebrow">AI service workflow</span><h2>From telemetry to technician instruction</h2></div></div>
      <div className="service-flow">
        {['Detect anomaly','Diagnose cause','Check warranty','Calculate impact','Decide intervention','Scope technician'].map((x,i)=><div className="card" key={x}><b>{String(i+1).padStart(2,'0')}</b><span>{x}</span>{i<5&&<ArrowRight size={14}/>}</div>)}
      </div>
    </div>
  );
}

function EmptyPage({ title }) {
  return <div className="page"><section className="page-heading"><div><span className="eyebrow green">EnergyOS</span><h1>{title}</h1></div></section></div>;
}

export default function App() {
  const [role, setRole] = usePersistentState('energyos-role', 'customer');
  const [active, setActive] = usePersistentState('energyos-active-view', 'overview');
  const [profileKey, setProfileKey] = usePersistentState('energyos-profile', 'home');
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [notifications, setNotifications] = usePersistentState('energyos-notifications', [
    {id:1,title:'Tariff review opportunity',detail:'Export pricing has improved for Willow House.',read:false,view:'tariffs'},
    {id:2,title:'Battery strategy ready',detail:'A lower-cost overnight charging window is available.',read:false,view:'optimise'},
    {id:3,title:'Asset health check complete',detail:'No critical faults detected across connected assets.',read:true,view:'assets'},
  ]);
  const profile = profiles[profileKey];

  const installerAlerts = [
    {id:'i1',title:'18 open service cases',detail:'7 have been resolved remotely.',read:false,view:'engineer'},
    {id:'i2',title:'412 battery-ready customers',detail:'Qualified upgrade audience is ready to review.',read:false,view:'opportunities'},
    {id:'i3',title:'Fleet performance updated',detail:'Portfolio analytics have been refreshed.',read:true,view:'insights'},
  ];
  const currentNotifications = role==='installer' ? installerAlerts : notifications;
  const unread = currentNotifications.filter(n=>!n.read).length;

  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase()==='k') {
        e.preventDefault(); setSearchOpen(true);
      }
      if (e.key==='Escape') { setSearchOpen(false); setNotificationsOpen(false); }
    };
    window.addEventListener('keydown', handler);
    return ()=>window.removeEventListener('keydown', handler);
  }, []);

  const viewCustomer = (key='home') => {
    setProfileKey(key);
    setRole('customer');
    setActive('overview');
  };

  const content = useMemo(() => {
    if (role==='installer') {
      if (active === 'customers') return <Installer section="customers" onViewCustomer={viewCustomer}/>;
      if (active === 'opportunities') return <Installer section="opportunities" onViewCustomer={viewCustomer}/>;
      if (active === 'engineer') return <EngineerAI />;
      if (active === 'insights') return <Insights />;
      return <Installer section="portfolio" onViewCustomer={viewCustomer}/>;
    }
    if (active === 'overview') return <Overview profile={profile} setActive={setActive}/>;
    if (active === 'lifetime') return <LifetimeValue profile={profile} />;
    if (active === 'optimise') return <Optimise />;
    if (active === 'assets') return <Assets />;
    if (active === 'engineer') return <EngineerAI />;
    if (active === 'tariffs') return <Tariffs />;
    return <Overview profile={profile} setActive={setActive}/>;
  }, [active, profile, role]);

  const roleNav = role==='installer' ? installerNavItems : customerNavItems;
  const searchItems = [
    ...roleNav.map(n=>({label:n.label,detail:'Open '+n.label,view:n.id})),
    ...(role==='customer' ? [
      ...assets.map(a=>({label:a.name,detail:a.model,view:'assets'})),
      ...tariffOptions.map(t=>({label:t.name,detail:t.supplier,view:'tariffs'}))
    ] : defaultCustomers.map(x=>({label:x.name,detail:x.system,view:'customers'}))),
  ].filter(item => (item.label+' '+item.detail).toLowerCase().includes(query.toLowerCase()));

  const openNotification = (n) => {
    if (role==='customer') setNotifications(current=>current.map(x=>x.id===n.id?{...x,read:true}:x));
    setNotificationsOpen(false);
    setActive(n.view);
  };

  return (
    <div className="app-shell">
      <Sidebar active={active} setActive={setActive} open={menuOpen} setOpen={setMenuOpen} role={role} setRole={setRole}/>
      <main className="main-shell">
        <Header profileKey={profileKey} setProfileKey={setProfileKey} onMenu={()=>setMenuOpen(true)} onSearch={()=>setSearchOpen(true)} onNotifications={()=>setNotificationsOpen(true)} unread={unread} role={role}/>
        {content}
      </main>
      <nav className="mobile-nav">
        {roleNav.slice(0,5).map(item => { const Icon=item.icon; return <button key={item.id} className={active===item.id?'active':''} onClick={()=>setActive(item.id)}><Icon size={18}/><span>{item.label}</span></button> })}
      </nav>

      {searchOpen && <Modal title={role==='installer'?'Search EnergyOS Pro':'Search EnergyOS'} subtitle={role==='installer'?'Find a customer, service area or installer workspace.':'Jump to a workspace, asset or tariff.'} onClose={()=>{setSearchOpen(false);setQuery('')}}>
        <div className="modal-search"><Search size={18}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search…" autoFocus/></div>
        <div className="search-results">
          {searchItems.slice(0,10).map((item,index)=><button key={item.label+'-'+index} onClick={()=>{setActive(item.view);setSearchOpen(false);setQuery('')}}><div><strong>{item.label}</strong><span>{item.detail}</span></div><ArrowRight size={15}/></button>)}
          {searchItems.length===0 && <p className="empty-state">No matching records.</p>}
        </div>
      </Modal>}

      {notificationsOpen && <Modal title="Notifications" subtitle={unread+' unread'} onClose={()=>setNotificationsOpen(false)}>
        <div className="notification-list">
          {currentNotifications.map(n=><button key={n.id} className={n.read?'read':''} onClick={()=>openNotification(n)}><span className="notification-dot"/><div><strong>{n.title}</strong><p>{n.detail}</p></div><ArrowRight size={15}/></button>)}
        </div>
        {role==='customer' && <button className="secondary-button full" onClick={()=>setNotifications(current=>current.map(n=>({...n,read:true})))}>Mark all as read</button>}
      </Modal>}
    </div>
  );
}
