import { useEffect, useMemo, useState } from "react";
import { Ticket, Leg } from "../lib/models";
import { fnum } from "../lib/math";
import { format } from "date-fns";
import { FiPlusSquare } from "react-icons/fi";

const SPORTS = [
  "NBA","NFL","MLB","NHL","NCAA Football","NCAA Basketball","Soccer","Tennis","Cricket","Volleyball",
  "MMA","Boxing","Golf","F1","NASCAR","Rugby","Table Tennis","Esports","Other/Custom"
];
const MARKETS = ["ML","Total","Spread","Alternate","Other"];
const STATUS = ["Pending","Win","Loss","Push"] as const;

type LegUX = { leg_sport: string; leg_desc: string; leg_result: "Pending"|"Win"|"Loss"|"Push" };

export default function AddTicket({ onSave }:{ onSave:(t:Ticket)=>void }){
  const [eventDate, setEventDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [sportSel, setSportSel] = useState("NBA");
  const [sportCustom, setSportCustom] = useState("");
  const [market, setMarket] = useState("ML");
  const [ticketType, setTicketType] = useState<"Single"|"Multi">("Single");

  const [title, setTitle] = useState("");
  const [stake, setStake] = useState("");                  // keep as string for the input
  const [status, setStatus] = useState<(typeof STATUS)[number]>("Pending");
  const [notes, setNotes] = useState("");

  // odds
  const [decimalOdds, setDecimalOdds] = useState("");      // used for Single
  const [combinedOdds, setCombinedOdds] = useState("2.50");// used for Multi

  // legs (no per-leg odds)
  const [legsCnt, setLegsCnt] = useState(2);
  const [legsUX, setLegsUX] = useState<LegUX[]>([
    { leg_sport:"Tennis", leg_desc:"First leg",  leg_result:"Pending" },
    { leg_sport:"NBA",    leg_desc:"Second leg", leg_result:"Pending" },
  ]);

  // keep legsUX length in sync when Multi + legsCnt changes
  useEffect(()=>{
    if (ticketType !== "Multi") return;
    const n = Math.max(2, Number(legsCnt) || 2);
    if (legsUX.length !== n){
      setLegsUX(Array.from({length:n}, (_,i)=> legsUX[i] || { leg_sport:"NBA", leg_desc:"", leg_result:"Pending" }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ticketType, legsCnt]);

  const parentSport = sportSel==="Other/Custom" ? (sportCustom.trim() || "Unlabeled") : sportSel;

  const previewReturn = useMemo(()=>{
    const s = fnum(stake);
    if (ticketType==="Single"){
      if (status==="Win")  return s * fnum(decimalOdds);
      if (status==="Push") return s;
      return 0;
    }
    // Multi: if any Loss or Pending -> 0; otherwise stake * combinedOdds
    const hasLoss = legsUX.some(l => l.leg_result==="Loss");
    const hasPend = legsUX.some(l => l.leg_result==="Pending");
    if (hasLoss || hasPend) return 0;
    return s * fnum(combinedOdds);
  }, [stake, status, decimalOdds, ticketType, legsUX, combinedOdds]);

  const save = () => {
    // Build Leg[] exactly as your model expects
    const legs: Leg[] =
      ticketType==="Multi"
        ? legsUX.map((l, i) => ({
            idx: i + 1,
            sport: l.leg_sport,
            leg_name: `[${l.leg_sport}] ${l.leg_desc?.trim() || `Leg ${i+1}`}`,
            leg_result: l.leg_result
          }))
        : [];

    const t: Ticket = {
      id: "NEW",
      event_dt: eventDate,
      sport: parentSport,
      market: market as Ticket["market"],
      title,
      ticket_type: ticketType,
      stake: Number.isFinite(Number(stake)) ? Number(stake) : 0,
      decimal_odds:
        ticketType==="Single"
          ? (Number.isFinite(Number(decimalOdds)) ? Number(decimalOdds) : 0)
          : (Number.isFinite(Number(combinedOdds)) ? Number(combinedOdds) : 0),
      status,
      payout: 0, // actual payout will be set later when resolved
      notes,
      legs
    };

    onSave(t);

    // reset some fields
    setTitle("");
    setStake("");
    setDecimalOdds("");
    setNotes("");
    if (ticketType==="Multi"){
      setLegsCnt(2);
      setCombinedOdds("2.50");
      setLegsUX([
        { leg_sport:"Tennis", leg_desc:"First leg",  leg_result:"Pending" },
        { leg_sport:"NBA",    leg_desc:"Second leg", leg_result:"Pending" },
      ]);
    }
  };

  return (
    <div className="card">
      {/* Header row */}
      <div className="grid3">
        <div>
          <label>Event Date</label>
          <input type="date" value={eventDate} onChange={e=>setEventDate(e.target.value)} />
        </div>

        <div>
          <label>Sport (overall)</label>
          <div className="row" style={{gap:8}}>
            <select value={sportSel} onChange={e=>setSportSel(e.target.value)}>
              {SPORTS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            {sportSel==="Other/Custom" && (
              <input placeholder="Custom…" value={sportCustom} onChange={e=>setSportCustom(e.target.value)} />
            )}
          </div>
        </div>

        <div>
          <label>Category</label>
          <select value={market} onChange={e=>setMarket(e.target.value)}>
            {MARKETS.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
      </div>

      {/* Second row */}
      <div className="grid3">
        <div>
          <label>Ticket Type</label>
          <div className="seg">
            {["Single","Multi"].map(t => (
              <button
                key={t}
                className={`segbtn ${ticketType===t ? "active":""}`}
                onClick={()=>setTicketType(t as "Single"|"Multi")}
                type="button"
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label>Stake</label>
          <input type="number" step="0.01" value={stake} onChange={e=>setStake(e.target.value)} />
        </div>

        <div>
          <label>Status</label>
          <select value={status} onChange={e=>setStatus(e.target.value as (typeof STATUS)[number])}>
            {STATUS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {/* Notes + Title */}
      <div className="grid2">
        <div>
          <label>Title (optional)</label>
          <input placeholder="Brief label" value={title} onChange={e=>setTitle(e.target.value)} />
        </div>
        <div>
          <label>Notes</label>
          <input placeholder="Anything to remember…" value={notes} onChange={e=>setNotes(e.target.value)} />
        </div>
      </div>

      {/* Odds */}
      {ticketType==="Single" ? (
        <div className="grid2">
          <div>
            <label>Decimal Odds</label>
            <input type="number" step="0.01" value={decimalOdds} onChange={e=>setDecimalOdds(e.target.value)} />
          </div>
        </div>
      ) : (
        <>
          <div className="grid3">
            <div>
              <label>How many legs?</label>
              <input
                type="number"
                min={2}
                max={20}
                value={legsCnt}
                onChange={e=>setLegsCnt(Number(e.target.value))}
              />
            </div>
            <div>
              <label>Combined Decimal Odds</label>
              <input
                type="number"
                step="0.0001"
                value={combinedOdds}
                onChange={e=>setCombinedOdds(e.target.value)}
              />
            </div>
            <div className="info" style={{alignSelf:"end"}}>
              Projected Return (if all Win/Push): <b>${(previewReturn||0).toFixed(2)}</b>
            </div>
          </div>

          <div className="table legs">
            <div className="thead"><div>Leg Sport</div><div>Description</div><div>Result</div></div>
            {legsUX.map((lg, i)=>(
              <div key={i} className="trow">
                <select value={lg.leg_sport} onChange={e=>patchLeg(i,{leg_sport:e.target.value})}>
                  {SPORTS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <input
                  value={lg.leg_desc}
                  onChange={e=>patchLeg(i,{leg_desc:e.target.value})}
                  placeholder="e.g., Tennis - Player A"
                />
                <select
                  value={lg.leg_result}
                  onChange={e=>patchLeg(i,{leg_result:e.target.value as LegUX["leg_result"]})}
                >
                  {STATUS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            ))}
          </div>
        </>
      )}

      <div className="info">
        Projected Return: <b>${(previewReturn||0).toFixed(2)}</b> • Net:{" "}
        <b>${((previewReturn||0) - fnum(stake)).toFixed(2)}</b>
      </div>

      <button className="primary" onClick={save} type="button">
        <FiPlusSquare style={{verticalAlign:"-2px", marginRight:6}}/> Save Ticket
      </button>
    </div>
  );

  function patchLeg(i:number, patch:Partial<LegUX>){
    setLegsUX(prev => {
      const copy = [...prev];
      copy[i] = { ...copy[i], ...patch };
      return copy;
    });
  }
}
