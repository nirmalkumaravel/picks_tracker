import { useMemo, useState } from "react";
import { Ticket } from "../lib/models";
import { addDays, aggregateBy, countBy, crossCount, fmtISO, groupByTime, sum, winRate } from "../lib/group";
import { niceDomain, roiPct } from "../lib/math";
import ChartLine from "./charts/ChartLine";
import ChartArea2 from "./charts/ChartArea2";
import ChartBarCounts from "./charts/ChartBarCounts";
import ChartBarSeries from "./charts/ChartBarSeries";
import ChartBarStacked from "./charts/ChartBarStacked";

function KPI({ label, value }:{label:string; value:string}){ return <div className="kpi"><b>{label}</b><h3>{value}</h3></div>; }
function Table({ rows, columns }:{ rows:any[]; columns:{key:string; name:string; fmt?:(v:any)=>string}[] }){
  return (
    <div className="table">
      <div className="thead">{columns.map(c => <div key={c.key}>{c.name}</div>)}</div>
      {rows.map((r,i)=>(
        <div className="trow" key={i}>
          {columns.map(c => <div key={c.key}>{c.fmt ? c.fmt(r[c.key]) : r[c.key]}</div>)}
        </div>
      ))}
    </div>
  );
}

export default function Reports({
  tickets, globalDomains
}:{
  tickets:Ticket[];
  globalDomains:{ net:[number,number]; money:[number,number]; count:[number,number]; };
}){
  const [range, setRange] = useState({ start: fmtISO(addDays(new Date(), -30)), end: fmtISO(new Date()) });
  const [freq, setFreq] = useState<"Daily"|"Weekly"|"Monthly">("Daily");
  const [hidePending, setHidePending] = useState(false);

  const df = useMemo(()=>{
    const s = new Date(range.start); const e = new Date(range.end);
    let arr = tickets.filter(t => {
      const d = new Date(t.event_dt);
      return d >= s && d <= e;
    });
    if (hidePending) arr = arr.filter(t => t.status!=="Pending");
    return arr;
  }, [tickets, range, hidePending]);

  if (!df.length) return <div className="card info">No records for this selection.</div>;

  const totalStake = sum(df.map(x=>x.stake));
  const totalPayout = sum(df.map(x=>x.payout));
  const netAll = sum(df.map(x=> (x.payout||0)-(x.stake||0)));
  const roi = roiPct(totalStake, netAll);
  const wr = winRate(df);

  const grouped = groupByTime(df, freq);
  const bySport = aggregateBy(df, "sport").map(r=>({ ...r, label:r.label }));
  const byMarket = aggregateBy(df, "market").map(r=>({ ...r, label:r.label }));
  const outcomesOverall = countBy(df, "status");
  const outcomesBySport = crossCount(df, "sport", "status");
  const outcomesByMarket = crossCount(df, "market", "status");

  return (
    <>
      <div className="card report-header">
        <div className="grid3">
          <div>
            <label>Range (start)</label>
            <input type="date" value={range.start} onChange={(e)=>setRange(r=>({...r, start:e.target.value}))} />
          </div>
          <div>
            <label>Range (end)</label>
            <input type="date" value={range.end} onChange={(e)=>setRange(r=>({...r, end:e.target.value}))} />
          </div>
          <div>
            <label>Time Group</label>
            <select value={freq} onChange={e=>setFreq(e.target.value as any)}>
              {["Daily","Weekly","Monthly"].map(x=><option key={x} value={x}>{x}</option>)}
            </select>
            <div className="row mt6">
              <input id="hidep" type="checkbox" checked={hidePending} onChange={e=>setHidePending(e.target.checked)} />
              <label htmlFor="hidep" style={{marginLeft:8}}>Hide Pending</label>
            </div>
          </div>
        </div>

        <div className="kpirow">
          <KPI label="Total Stake" value={`$${totalStake.toFixed(2)}`} />
          <KPI label="Total Return" value={`$${totalPayout.toFixed(2)}`} />
          <KPI label="Net P/L" value={`$${netAll.toFixed(2)}`} />
          <KPI label="ROI %" value={`${roi.toFixed(2)}%`} />
        </div>
        <div className="muted">Win Rate: <b>{wr.toFixed(1)}%</b></div>
      </div>

      <div className="card chart-card">
        <h4>Net Over Time</h4>
        <ChartLine data={grouped} xKey="x" yKey="net" yDomain={globalDomains.net} color="#7C3AED" />
      </div>

      <div className="card chart-card">
        <h4>Stake vs Return</h4>
        <ChartArea2 data={grouped} xKey="x" y1Key="stake" y2Key="payout" yDomain={globalDomains.money} color1="#7C3AED" color2="#22C55E" />
      </div>

      <div className="card chart-card">
        <h4>Outcomes (Overall)</h4>
        <ChartBarCounts counts={outcomesOverall} yDomain={globalDomains.count} />
      </div>

      <div className="card">
        <h4>By Sport — Net & ROI</h4>
        <ChartBarSeries rows={bySport} xKey="label" yKey="net" yDomain={globalDomains.net} color="#7C3AED" />
        <ChartBarSeries
          rows={bySport}
          xKey="label"
          yKey="roi"
          yDomain={niceDomain(min(bySport,"roi"), max(bySport,"roi")) as [number, number]}
          color="#F59E0B"
          label="ROI %"
          fmt={(v)=>`${v.toFixed(1)}`}
        />
        <h4>Outcomes by Sport</h4>
        <ChartBarStacked rows={outcomesBySport} />
        <Table rows={bySport} columns={[
          {key:"label", name:"Sport"}, {key:"stake", name:"Stake", fmt:v=>`$${(v||0).toFixed(2)}`},
          {key:"payout", name:"Return", fmt:v=>`$${(v||0).toFixed(2)}`}, {key:"net", name:"Net", fmt:v=>`$${(v||0).toFixed(2)}`},
          {key:"roi", name:"ROI %", fmt:v=>`${(v||0).toFixed(2)}%`}, {key:"count", name:"Tickets"}
        ]}/>
      </div>

      <div className="card">
        <h4>By Category — Net & ROI</h4>
        <ChartBarSeries rows={byMarket} xKey="label" yKey="net" yDomain={globalDomains.net} color="#06B6D4" />
        <ChartBarSeries
          rows={byMarket}
          xKey="label"
          yKey="roi"
          yDomain={niceDomain(min(byMarket,"roi"), max(byMarket,"roi")) as [number, number]}
          color="#EF4444"
          label="ROI %"
          fmt={(v)=>`${v.toFixed(1)}`}
        />
        <h4>Outcomes by Category</h4>
        <ChartBarStacked rows={outcomesByMarket} />
        <Table rows={byMarket} columns={[
          {key:"label", name:"Category"}, {key:"stake", name:"Stake", fmt:v=>`$${(v||0).toFixed(2)}`},
          {key:"payout", name:"Return", fmt:v=>`$${(v||0).toFixed(2)}`}, {key:"net", name:"Net", fmt:v=>`$${(v||0).toFixed(2)}`},
          {key:"roi", name:"ROI %", fmt:v=>`${(v||0).toFixed(2)}%`}, {key:"count", name:"Tickets"}
        ]}/>
      </div>
    </>
  );

  function min(arr:any[], key:string){ return arr.length ? Math.min(...arr.map(r=>Number(r[key]||0))) : 0; }
  function max(arr:any[], key:string){ return arr.length ? Math.max(...arr.map(r=>Number(r[key]||0))) : 1; }
}
