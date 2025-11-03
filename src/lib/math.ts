import { Ticket, Leg } from "./models";

export const fnum = (n: unknown = 0) => Number(n || 0);

// kept for legacy (not used now for Multi math, but harmless to keep)
export function combinedDecimal(legs: Leg[] = []): number {
  if (!legs.length) return 0;
  return legs.reduce((acc, l) => acc * (fnum(l.leg_odds) || 1), 1);
}

export function ticketPayout(t: Ticket): number {
  const s = fnum(t.stake); const dec = fnum(t.decimal_odds);
  if (t.ticket_type === "Single") {
    if (t.status === "Win") return s * dec;
    if (t.status === "Push") return s;
    return 0;
  }
  const legs = t.legs || [];
  if (legs.length) {
    const allResolved = legs.every(l => l.leg_result === "Win" || l.leg_result === "Push");
    if (!allResolved) return 0;
  }
  // Multi: use combined decimal stored in t.decimal_odds
  return s * dec;
}
export const netVal = (payout: number, stake: number) => fnum(payout) - fnum(stake);
export const roiPct = (stake: number, net: number) => stake <= 0 ? 0 : (net/stake)*100;
export const niceDomain = (min: number, max: number) => {
  if (!isFinite(min) || !isFinite(max)) return [0,1] as [number, number];
  if (min===max){ const span=Math.abs(min)*0.2+1; return [min-span, max+span]; }
  const pad=(max-min)*0.05; return [min-pad, max+pad] as [number, number];
};
