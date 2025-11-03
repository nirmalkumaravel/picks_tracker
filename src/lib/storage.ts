import { Ticket } from "./models";
import { v4 as uuidv4 } from "uuid";
import { ticketPayout, netVal } from "./math";

const LS_KEY = "picks.tracker.v1";
export function normalizeLegs(raw: any): import("./models").Leg[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((l: any, i: number) => ({
    idx: typeof l?.idx === "number" ? l.idx : i + 1,
    sport: l?.sport,
    leg_name: String(l?.leg_name ?? l?.name ?? l?.title ?? `Leg ${i + 1}`),
    leg_result: l?.leg_result ?? l?.result,
  }));
}
export function loadTickets(): Ticket[] {
  try { const raw = localStorage.getItem(LS_KEY); return raw ? JSON.parse(raw) : []; }
  catch { return []; }
}
export function saveTickets(t: Ticket[]) { localStorage.setItem(LS_KEY, JSON.stringify(t)); }

export function withComputed(t: Ticket): Ticket {
  const payout = ticketPayout(t);
  return { ...t, payout, net: netVal(payout, t.stake) };
}

export function newId(){ return uuidv4(); }
