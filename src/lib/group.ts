import { parseISO, startOfWeek, startOfMonth, format } from "date-fns";
import { Ticket } from "./models";
import { fnum, netVal, roiPct } from "./math";

export const fmtISO = (d: Date) => format(d, "yyyy-MM-dd");
export const addDays = (d: Date, n: number) => { const x=new Date(d); x.setDate(x.getDate()+n); return x; };
export const sum = (arr: number[]) => arr.reduce((a,b)=>a+(b||0),0);
export const winRate = (df: Ticket[]) => {
  const r = df.filter(x=>x.status!=="Pending");
  return !r.length ? 0 : (r.filter(x=>x.status==="Win").length / r.length) * 100;
};

export function groupByTime(df: Ticket[], freq: "Daily"|"Weekly"|"Monthly"){
  const map = new Map<string, {x:string; stake:number; payout:number; net:number;}>();
  for (const t of df){
    const d = parseISO(t.event_dt);
    let key: string;
    if (freq==="Weekly") key = fmtISO(startOfWeek(d, {weekStartsOn:1}));
    else if (freq==="Monthly") key = fmtISO(startOfMonth(d));
    else key = fmtISO(d);
    const cur = map.get(key) || { x:key, stake:0, payout:0, net:0 };
    cur.stake += fnum(t.stake); cur.payout += fnum(t.payout); cur.net += fnum(netVal(t.payout, t.stake));
    map.set(key, cur);
  }
  return Array.from(map.values()).sort((a,b)=> a.x > b.x ? 1 : -1);
}

export function aggregateBy<T extends "sport"|"market">(df: Ticket[], key: T){
  const map = new Map<string, any>();
  for (const t of df){
    const k = (t[key] as string) || "Unlabeled";
    const cur = map.get(k) || { label:k, stake:0, payout:0, net:0, count:0 };
    cur.stake += fnum(t.stake); cur.payout += fnum(t.payout); cur.net += fnum(netVal(t.payout, t.stake)); cur.count += 1;
    map.set(k, cur);
  }
  const arr = Array.from(map.values());
  arr.forEach((r:any)=> r.roi = roiPct(r.stake, r.net));
  return arr.sort((a:any,b:any)=> b.net - a.net);
}

export function countBy(df: Ticket[], key: "status"){
  const map: Record<string, number> = { Win:0, Loss:0, Push:0, Pending:0 };
  for (const t of df){ map[(t as any)[key]] = (map[(t as any)[key]] || 0) + 1; }
  return map;
}

export function crossCount(df: Ticket[], rowKey: "sport"|"market", colKey: "status"){
  const map = new Map<string, any>();
  for (const t of df){
    const r = (t as any)[rowKey] || "Unlabeled";
    const c = (t as any)[colKey] || "Pending";
    const row = map.get(r) || { label:r, Win:0, Loss:0, Push:0, Pending:0 };
    row[c] = (row[c] || 0) + 1;
    map.set(r, row);
  }
  return Array.from(map.values());
}
