import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useMemo, useState } from "react";
import { addDays, aggregateBy, countBy, crossCount, fmtISO, groupByTime, sum, winRate } from "../lib/group";
import { niceDomain, roiPct } from "../lib/math";
import ChartLine from "./charts/ChartLine";
import ChartArea2 from "./charts/ChartArea2";
import ChartBarCounts from "./charts/ChartBarCounts";
import ChartBarSeries from "./charts/ChartBarSeries";
import ChartBarStacked from "./charts/ChartBarStacked";
function KPI({ label, value }) { return _jsxs("div", { className: "kpi", children: [_jsx("b", { children: label }), _jsx("h3", { children: value })] }); }
function Table({ rows, columns }) {
    return (_jsxs("div", { className: "table", children: [_jsx("div", { className: "thead", children: columns.map(c => _jsx("div", { children: c.name }, c.key)) }), rows.map((r, i) => (_jsx("div", { className: "trow", children: columns.map(c => _jsx("div", { children: c.fmt ? c.fmt(r[c.key]) : r[c.key] }, c.key)) }, i)))] }));
}
export default function Reports({ tickets, globalDomains }) {
    const [range, setRange] = useState({ start: fmtISO(addDays(new Date(), -30)), end: fmtISO(new Date()) });
    const [freq, setFreq] = useState("Daily");
    const [hidePending, setHidePending] = useState(false);
    const df = useMemo(() => {
        const s = new Date(range.start);
        const e = new Date(range.end);
        let arr = tickets.filter(t => {
            const d = new Date(t.event_dt);
            return d >= s && d <= e;
        });
        if (hidePending)
            arr = arr.filter(t => t.status !== "Pending");
        return arr;
    }, [tickets, range, hidePending]);
    if (!df.length)
        return _jsx("div", { className: "card info", children: "No records for this selection." });
    const totalStake = sum(df.map(x => x.stake));
    const totalPayout = sum(df.map(x => x.payout));
    const netAll = sum(df.map(x => (x.payout || 0) - (x.stake || 0)));
    const roi = roiPct(totalStake, netAll);
    const wr = winRate(df);
    const grouped = groupByTime(df, freq);
    const bySport = aggregateBy(df, "sport").map(r => ({ ...r, label: r.label }));
    const byMarket = aggregateBy(df, "market").map(r => ({ ...r, label: r.label }));
    const outcomesOverall = countBy(df, "status");
    const outcomesBySport = crossCount(df, "sport", "status");
    const outcomesByMarket = crossCount(df, "market", "status");
    return (_jsxs(_Fragment, { children: [_jsxs("div", { className: "card report-header", children: [_jsxs("div", { className: "grid3", children: [_jsxs("div", { children: [_jsx("label", { children: "Range (start)" }), _jsx("input", { type: "date", value: range.start, onChange: (e) => setRange(r => ({ ...r, start: e.target.value })) })] }), _jsxs("div", { children: [_jsx("label", { children: "Range (end)" }), _jsx("input", { type: "date", value: range.end, onChange: (e) => setRange(r => ({ ...r, end: e.target.value })) })] }), _jsxs("div", { children: [_jsx("label", { children: "Time Group" }), _jsx("select", { value: freq, onChange: e => setFreq(e.target.value), children: ["Daily", "Weekly", "Monthly"].map(x => _jsx("option", { value: x, children: x }, x)) }), _jsxs("div", { className: "row mt6", children: [_jsx("input", { id: "hidep", type: "checkbox", checked: hidePending, onChange: e => setHidePending(e.target.checked) }), _jsx("label", { htmlFor: "hidep", style: { marginLeft: 8 }, children: "Hide Pending" })] })] })] }), _jsxs("div", { className: "kpirow", children: [_jsx(KPI, { label: "Total Stake", value: `$${totalStake.toFixed(2)}` }), _jsx(KPI, { label: "Total Return", value: `$${totalPayout.toFixed(2)}` }), _jsx(KPI, { label: "Net P/L", value: `$${netAll.toFixed(2)}` }), _jsx(KPI, { label: "ROI %", value: `${roi.toFixed(2)}%` })] }), _jsxs("div", { className: "muted", children: ["Win Rate: ", _jsxs("b", { children: [wr.toFixed(1), "%"] })] })] }), _jsxs("div", { className: "card chart-card", children: [_jsx("h4", { children: "Net Over Time" }), _jsx(ChartLine, { data: grouped, xKey: "x", yKey: "net", yDomain: globalDomains.net, color: "#7C3AED" })] }), _jsxs("div", { className: "card chart-card", children: [_jsx("h4", { children: "Stake vs Return" }), _jsx(ChartArea2, { data: grouped, xKey: "x", y1Key: "stake", y2Key: "payout", yDomain: globalDomains.money, color1: "#7C3AED", color2: "#22C55E" })] }), _jsxs("div", { className: "card chart-card", children: [_jsx("h4", { children: "Outcomes (Overall)" }), _jsx(ChartBarCounts, { counts: outcomesOverall, yDomain: globalDomains.count })] }), _jsxs("div", { className: "card", children: [_jsx("h4", { children: "By Sport \u2014 Net & ROI" }), _jsx(ChartBarSeries, { rows: bySport, xKey: "label", yKey: "net", yDomain: globalDomains.net, color: "#7C3AED" }), _jsx(ChartBarSeries, { rows: bySport, xKey: "label", yKey: "roi", yDomain: niceDomain(min(bySport, "roi"), max(bySport, "roi")), color: "#F59E0B", label: "ROI %", fmt: (v) => `${v.toFixed(1)}` }), _jsx("h4", { children: "Outcomes by Sport" }), _jsx(ChartBarStacked, { rows: outcomesBySport }), _jsx(Table, { rows: bySport, columns: [
                            { key: "label", name: "Sport" }, { key: "stake", name: "Stake", fmt: v => `$${(v || 0).toFixed(2)}` },
                            { key: "payout", name: "Return", fmt: v => `$${(v || 0).toFixed(2)}` }, { key: "net", name: "Net", fmt: v => `$${(v || 0).toFixed(2)}` },
                            { key: "roi", name: "ROI %", fmt: v => `${(v || 0).toFixed(2)}%` }, { key: "count", name: "Tickets" }
                        ] })] }), _jsxs("div", { className: "card", children: [_jsx("h4", { children: "By Category \u2014 Net & ROI" }), _jsx(ChartBarSeries, { rows: byMarket, xKey: "label", yKey: "net", yDomain: globalDomains.net, color: "#06B6D4" }), _jsx(ChartBarSeries, { rows: byMarket, xKey: "label", yKey: "roi", yDomain: niceDomain(min(byMarket, "roi"), max(byMarket, "roi")), color: "#EF4444", label: "ROI %", fmt: (v) => `${v.toFixed(1)}` }), _jsx("h4", { children: "Outcomes by Category" }), _jsx(ChartBarStacked, { rows: outcomesByMarket }), _jsx(Table, { rows: byMarket, columns: [
                            { key: "label", name: "Category" }, { key: "stake", name: "Stake", fmt: v => `$${(v || 0).toFixed(2)}` },
                            { key: "payout", name: "Return", fmt: v => `$${(v || 0).toFixed(2)}` }, { key: "net", name: "Net", fmt: v => `$${(v || 0).toFixed(2)}` },
                            { key: "roi", name: "ROI %", fmt: v => `${(v || 0).toFixed(2)}%` }, { key: "count", name: "Tickets" }
                        ] })] })] }));
    function min(arr, key) { return arr.length ? Math.min(...arr.map(r => Number(r[key] || 0))) : 0; }
    function max(arr, key) { return arr.length ? Math.max(...arr.map(r => Number(r[key] || 0))) : 1; }
}
