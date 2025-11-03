import { v4 as uuidv4 } from "uuid";
import { ticketPayout } from "./math";
const LS_KEY = "picks.tracker.v1";
export function normalizeLegs(raw) {
    if (!Array.isArray(raw))
        return [];
    return raw.map((l, i) => ({
        idx: typeof l?.idx === "number" ? l.idx : i + 1,
        sport: l?.sport,
        leg_name: String(l?.leg_name ?? l?.name ?? l?.title ?? `Leg ${i + 1}`),
        leg_result: l?.leg_result ?? l?.result,
    }));
}
export function loadTickets() {
    try {
        const raw = localStorage.getItem(LS_KEY);
        return raw ? JSON.parse(raw) : [];
    }
    catch {
        return [];
    }
}
export function saveTickets(t) {
    localStorage.setItem(LS_KEY, JSON.stringify(t));
}
/** Recompute payout (and keep the object type-safe as Ticket). */
export function withComputed(t) {
    const payout = ticketPayout(t);
    return { ...t, payout }; // do NOT add extra fields (e.g., 'net') not in Ticket
}
export function newId() { return uuidv4(); }
