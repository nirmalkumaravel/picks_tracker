import { useMemo, useState } from "react";
import { Ticket } from "../lib/models";
import { fmtISO, addDays } from "../lib/group";

type Filter = {
  start: string;
  end: string;
  sport: string;
  market: string;
  status: string;
  q: string;
};

const SPORTS = ["(All)","NBA","NFL","MLB","NHL","NCAA Football","NCAA Basketball","Soccer","Tennis","Cricket","Volleyball","MMA","Boxing","Golf","F1","NASCAR","Rugby","Table Tennis","Esports","Other/Custom"];
const MARKETS = ["(All)","ML","Total","Spread","Alternate","Other"];
const STATUSES = ["(All)","Pending","Win","Loss","Push"];

export default function DataTab({ tickets, setTickets }:{
  tickets:Ticket[]; setTickets:(t:Ticket[])=>void;
}){
  const [filters, setFilters] = useState<Filter>({
    start: fmtISO(addDays(new Date(), -60)),
    end: fmtISO(new Date()),
    sport: "(All)",
    market: "(All)",
    status: "(All)",
    q: ""
  });

  const filtered = useMemo(()=>{
    const s = new Date(filters.start);
    const e = new Date(filters.end);
    return tickets.filter(t => {
      const d = new Date(t.event_dt);
      if (isNaN(+d) || d < s || d > e) return false;
      if (filters.sport !== "(All)"  && (t.sport||"")  !== filters.sport)  return false;
      if (filters.market!== "(All)"  && (t.market||"") !== filters.market) return false;
      if (filters.status!== "(All)"  && (t.status||"") !== filters.status) return false;
      if (filters.q) {
        const q = filters.q.toLowerCase();
        const blob = `${t.title||""} ${t.notes||""} ${t.sport||""} ${t.market||""}`.toLowerCase();
        if (!blob.includes(q)) return false;
      }
      return true;
    }).sort((a,b)=> (a.event_dt||"").localeCompare(b.event_dt||""));
  }, [tickets, filters]);

  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(filtered, null, 2)], {type:"application/json"});
    const url = URL.createObjectURL(blob); const a = document.createElement("a");
    a.href = url; a.download = "picks_filtered.json"; a.click(); URL.revokeObjectURL(url);
  };
  const importJSON = async (file: File | null) => {
    if (!file) return;
    const text = await file.text();
    try {
      const data = JSON.parse(text);
      if (Array.isArray(data)) setTickets(data);
      else alert("Invalid JSON");
    } catch { alert("Invalid JSON"); }
  };

  return (
    <div className="card">
      {/* Header with background image/gradient */}
      <div className="data-header">
        <div>
          <h3>📦 All Records</h3>
          <p>Power filters + sticky header + export/import</p>
        </div>
        <div className="row" style={{gap:8}}>
          <button className="ghost" onClick={exportJSON}>Download JSON</button>
          <label className="ghost">Import JSON
            <input type="file" accept="application/json" style={{display:"none"}} onChange={e=>importJSON(e.target.files?.[0] || null)} />
          </label>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-bar">
        <div>
          <label>From</label>
          <input type="date" value={filters.start} onChange={e=>setFilters(f=>({...f, start:e.target.value}))}/>
        </div>
        <div>
          <label>To</label>
          <input type="date" value={filters.end} onChange={e=>setFilters(f=>({...f, end:e.target.value}))}/>
        </div>
        <div>
          <label>Sport</label>
          <select value={filters.sport} onChange={e=>setFilters(f=>({...f, sport:e.target.value}))}>
            {SPORTS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label>Category</label>
          <select value={filters.market} onChange={e=>setFilters(f=>({...f, market:e.target.value}))}>
            {MARKETS.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
        <div>
          <label>Status</label>
          <select value={filters.status} onChange={e=>setFilters(f=>({...f, status:e.target.value}))}>
            {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div className="wide">
          <label>Search</label>
          <input placeholder="Title / notes / sport / category" value={filters.q} onChange={e=>setFilters(f=>({...f, q:e.target.value}))}/>
        </div>
      </div>

      {/* Rich data table */}
      <div className="datatable">
        <div className="thead sticky">
          <div>Date</div>
          <div>Sport</div>
          <div>Category</div>
          <div>Type</div>
          <div className="right">Stake</div>
          <div className="right">Decimal</div>
          <div>Status</div>
          <div className="right">Return</div>
          <div className="right">Net</div>
        </div>

        {filtered.length === 0 && (
          <div className="empty">
            <div className="empty-card">
              <div className="empty-emoji">🔎</div>
              <div>No records match your filters.</div>
            </div>
          </div>
        )}

        {filtered.map((t, i) => (
          <div className={`trow fancy ${i % 2 ? "odd":""}`} key={t.id}>
            <div className="mono">{t.event_dt}</div>
            <div><span className="badge">{t.sport}</span></div>
            <div><span className="badge alt">{t.market}</span></div>
            <div className="dim">{t.ticket_type}</div>
            <div className="right">${Number(t.stake||0).toFixed(2)}</div>
            <div className="right">{Number(t.decimal_odds||0).toFixed(3)}</div>
            <div><span className={`pill ${pillClass(t.status)}`}>{t.status}</span></div>
            <div className="right">${Number(t.payout||0).toFixed(2)}</div>
            <div className={`right ${((t.payout||0)-(t.stake||0))>=0 ? "pos":"neg"}`}>
              ${Number((t.payout||0)-(t.stake||0)).toFixed(2)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function pillClass(s: string){
  if (s==="Win") return "ok";
  if (s==="Loss") return "bad";
  if (s==="Push") return "muted";
  return "wait";
}
