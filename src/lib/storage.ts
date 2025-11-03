import { Ticket } from "./models";
import { v4 as uuidv4 } from "uuid";
import { ticketPayout, netVal } from "./math";

const LS_KEY = "picks.tracker.v1";

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
