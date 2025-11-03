import { parseISO, startOfWeek, startOfMonth, format } from "date-fns";
import { fnum, netVal, roiPct } from "./math";
export const fmtISO = (d) => format(d, "yyyy-MM-dd");
export const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
export const sum = (arr) => arr.reduce((a, b) => a + (b || 0), 0);
export const winRate = (df) => {
    const r = df.filter(x => x.status !== "Pending");
    return !r.length ? 0 : (r.filter(x => x.status === "Win").length / r.length) * 100;
};
export function groupByTime(df, freq) {
    const map = new Map();
    for (const t of df) {
        const d = parseISO(t.event_dt);
        let key;
        if (freq === "Weekly")
            key = fmtISO(startOfWeek(d, { weekStartsOn: 1 }));
        else if (freq === "Monthly")
            key = fmtISO(startOfMonth(d));
        else
            key = fmtISO(d);
        const cur = map.get(key) || { x: key, stake: 0, payout: 0, net: 0 };
        cur.stake += fnum(t.stake);
        cur.payout += fnum(t.payout);
        cur.net += fnum(netVal(t.payout, t.stake));
        map.set(key, cur);
    }
    return Array.from(map.values()).sort((a, b) => a.x > b.x ? 1 : -1);
}
export function aggregateBy(df, key) {
    const map = new Map();
    for (const t of df) {
        const k = t[key] || "Unlabeled";
        const cur = map.get(k) || { label: k, stake: 0, payout: 0, net: 0, count: 0 };
        cur.stake += fnum(t.stake);
        cur.payout += fnum(t.payout);
        cur.net += fnum(netVal(t.payout, t.stake));
        cur.count += 1;
        map.set(k, cur);
    }
    const arr = Array.from(map.values());
    arr.forEach((r) => r.roi = roiPct(r.stake, r.net));
    return arr.sort((a, b) => b.net - a.net);
}
export function countBy(df, key) {
    const map = { Win: 0, Loss: 0, Push: 0, Pending: 0 };
    for (const t of df) {
        map[t[key]] = (map[t[key]] || 0) + 1;
    }
    return map;
}
export function crossCount(df, rowKey, colKey) {
    const map = new Map();
    for (const t of df) {
        const r = t[rowKey] || "Unlabeled";
        const c = t[colKey] || "Pending";
        const row = map.get(r) || { label: r, Win: 0, Loss: 0, Push: 0, Pending: 0 };
        row[c] = (row[c] || 0) + 1;
        map.set(r, row);
    }
    return Array.from(map.values());
}
