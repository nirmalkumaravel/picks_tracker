import { useEffect, useState } from "react";
import { Ticket, Leg } from "../lib/models";

const SPORTS = ["NBA","NFL","MLB","NHL","NCAA Football","NCAA Basketball","Soccer","Tennis","Cricket","Volleyball","MMA","Boxing","Golf","F1","NASCAR","Rugby","Table Tennis","Esports","Other/Custom"];
const MARKETS = ["ML","Total","Spread","Alternate","Other"];
const STATUS = ["Pending","Win","Loss","Push"];

export default function Pending({ tickets, updateTicket }:{
  tickets:Ticket[]; updateTicket:(id:string, patch:Partial<Ticket>)=>void;
}){
  const pending = tickets.filter(t => t.status==="Pending").sort((a,b)=> (a.event_dt||"").localeCompare(b.event_dt||""));
  const [sel, setSel] = useState(pending[0]?.id || "");

  useEffect(()=>{ if(pending.length && !pending.find(p=>p.id===sel)) setSel(pending[0].id); }, [tickets]); // eslint-disable-line
  if (!pending.length) return <div className="card info">No pending tickets. 🎉</div>;

  const t = pending.find(x=>x.id===sel)!;
  return (
    <div className="card">
      <label>Choose a ticket</label>
      <select value={sel} onChange={e=>setSel(e.target.value)}>
        {pending.map(p => (
          <option key={p.id} value={p.id}>
            #{p.id.slice(0,6)} • {p.event_dt} • {p.ticket_type} • {p.sport} • {p.title || ""}
          </option>
        ))}
      </select>

      <TicketEditor ticket={t} onChange={(patch)=>updateTicket(t.id, patch)} />
    </div>
  );
}

function TicketEditor({ ticket, onChange }:{ ticket:Ticket; onChange:(patch:Partial<Ticket>)=>void; }){
  const [stake, setStake] = useState(ticket.stake);
  const [status, setStatus] = useState(ticket.status);
  const [sportSel, setSportSel] = useState(SPORTS.includes(ticket.sport) ? ticket.sport : "Other/Custom");
  const [sportCustom, setSportCustom] = useState(SPORTS.includes(ticket.sport) ? "" : ticket.sport);
  const [market, setMarket] = useState(ticket.market || "ML");
  const [notes, setNotes] = useState(ticket.notes || "");
  const [dec, setDec] = useState(ticket.decimal_odds || 1.0); // for Single or Multi (combined)
  const [legs, setLegs] = useState<Leg[]>(ticket.legs || []);

  const sport = sportSel==="Other/Custom" ? (sportCustom || "Unlabeled") : sportSel;

  const allResolved = legs.length ? legs.every(l => l.leg_result==="Win" || l.leg_result==="Push") : true;
  const preview = ticket.ticket_type==="Single"
    ? (status==="Win" ? stake*dec : status==="Push" ? stake : 0)
    : (allResolved ? stake*dec : 0); // Multi uses combined decimal in ticket.decimal_odds

  const save = () => {
    onChange({
      stake:Number(stake||0),
      status, sport, market, notes,
      decimal_odds:Number(dec||1),
      legs:[...legs]
    });
  };

  return (
    <>
      <div className="grid2">
        <div>
          <label>Stake</label>
          <input type="number" step="0.01" value={stake} onChange={e=>setStake(Number(e.target.value))} />

          <label>Status</label>
          <select value={status} onChange={e=>setStatus(e.target.value as any)}>
            {STATUS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>

          <label>Sport</label>
          <select value={sportSel} onChange={e=>setSportSel(e.target.value)}>
            {SPORTS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          {sportSel==="Other/Custom" && <input placeholder="Custom sport…" value={sportCustom} onChange={e=>setSportCustom(e.target.value)} />}

          <label>Category</label>
          <select value={market} onChange={e=>setMarket(e.target.value as any)}>
            {MARKETS.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>

        <div>
          <label>{ticket.ticket_type==="Single" ? "Decimal Odds" : "Combined Decimal Odds"}</label>
          <input type="number" step="0.0001" value={dec} onChange={e=>setDec(Number(e.target.value))} />

          {ticket.ticket_type==="Multi" && (
            <>
              <label>Legs</label>
              <div className="table legs">
                <div className="thead"><div>Leg Name</div><div>Result</div><div>—</div></div>
                {legs.map((lg, idx)=>(
                  <div className="trow" key={idx}>
                    <div>{lg.leg_name}</div>
                    <select value={lg.leg_result||"Pending"} onChange={e=>patchLeg(idx,{leg_result:e.target.value as any})}>
                      {STATUS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <div />
                  </div>
                ))}
              </div>
            </>
          )}

          <div className="info">Projected Return: <b>${preview.toFixed(2)}</b> • Net: <b>${(preview - Number(stake||0)).toFixed(2)}</b></div>
        </div>
      </div>

      <div className="grid3">
        <button className="primary" onClick={save}>💾 Save Update</button>
        <button className="ok" onClick={()=>{ setStatus("Win"); setTimeout(save, 0); }}>🏆 Mark Win</button>
        <button className="danger" onClick={()=>{ setStatus("Loss"); setTimeout(save, 0); }}>❌ Mark Loss</button>
      </div>
    </>
  );

  function patchLeg(i:number, patch:Partial<Leg>){
    const copy=[...legs]; copy[i] = { ...copy[i], ...patch }; setLegs(copy);
  }
}
