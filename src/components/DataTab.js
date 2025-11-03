import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo, useState } from "react";
import { fmtISO, addDays } from "../lib/group";
const SPORTS = ["(All)", "NBA", "NFL", "MLB", "NHL", "NCAA Football", "NCAA Basketball", "Soccer", "Tennis", "Cricket", "Volleyball", "MMA", "Boxing", "Golf", "F1", "NASCAR", "Rugby", "Table Tennis", "Esports", "Other/Custom"];
const MARKETS = ["(All)", "ML", "Total", "Spread", "Alternate", "Other"];
const STATUSES = ["(All)", "Pending", "Win", "Loss", "Push"];
export default function DataTab({ tickets, setTickets }) {
    const [filters, setFilters] = useState({
        start: fmtISO(addDays(new Date(), -60)),
        end: fmtISO(new Date()),
        sport: "(All)",
        market: "(All)",
        status: "(All)",
        q: ""
    });
    const filtered = useMemo(() => {
        const s = new Date(filters.start);
        const e = new Date(filters.end);
        return tickets.filter(t => {
            const d = new Date(t.event_dt);
            if (isNaN(+d) || d < s || d > e)
                return false;
            if (filters.sport !== "(All)" && (t.sport || "") !== filters.sport)
                return false;
            if (filters.market !== "(All)" && (t.market || "") !== filters.market)
                return false;
            if (filters.status !== "(All)" && (t.status || "") !== filters.status)
                return false;
            if (filters.q) {
                const q = filters.q.toLowerCase();
                const blob = `${t.title || ""} ${t.notes || ""} ${t.sport || ""} ${t.market || ""}`.toLowerCase();
                if (!blob.includes(q))
                    return false;
            }
            return true;
        }).sort((a, b) => (a.event_dt || "").localeCompare(b.event_dt || ""));
    }, [tickets, filters]);
    const exportJSON = () => {
        const blob = new Blob([JSON.stringify(filtered, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "picks_filtered.json";
        a.click();
        URL.revokeObjectURL(url);
    };
    const importJSON = async (file) => {
        if (!file)
            return;
        const text = await file.text();
        try {
            const data = JSON.parse(text);
            if (Array.isArray(data))
                setTickets(data);
            else
                alert("Invalid JSON");
        }
        catch {
            alert("Invalid JSON");
        }
    };
    return (_jsxs("div", { className: "card", children: [_jsxs("div", { className: "data-header", children: [_jsxs("div", { children: [_jsx("h3", { children: "\uD83D\uDCE6 All Records" }), _jsx("p", { children: "Power filters + sticky header + export/import" })] }), _jsxs("div", { className: "row", style: { gap: 8 }, children: [_jsx("button", { className: "ghost", onClick: exportJSON, children: "Download JSON" }), _jsxs("label", { className: "ghost", children: ["Import JSON", _jsx("input", { type: "file", accept: "application/json", style: { display: "none" }, onChange: e => importJSON(e.target.files?.[0] || null) })] })] })] }), _jsxs("div", { className: "filters-bar", children: [_jsxs("div", { children: [_jsx("label", { children: "From" }), _jsx("input", { type: "date", value: filters.start, onChange: e => setFilters(f => ({ ...f, start: e.target.value })) })] }), _jsxs("div", { children: [_jsx("label", { children: "To" }), _jsx("input", { type: "date", value: filters.end, onChange: e => setFilters(f => ({ ...f, end: e.target.value })) })] }), _jsxs("div", { children: [_jsx("label", { children: "Sport" }), _jsx("select", { value: filters.sport, onChange: e => setFilters(f => ({ ...f, sport: e.target.value })), children: SPORTS.map(s => _jsx("option", { value: s, children: s }, s)) })] }), _jsxs("div", { children: [_jsx("label", { children: "Category" }), _jsx("select", { value: filters.market, onChange: e => setFilters(f => ({ ...f, market: e.target.value })), children: MARKETS.map(m => _jsx("option", { value: m, children: m }, m)) })] }), _jsxs("div", { children: [_jsx("label", { children: "Status" }), _jsx("select", { value: filters.status, onChange: e => setFilters(f => ({ ...f, status: e.target.value })), children: STATUSES.map(s => _jsx("option", { value: s, children: s }, s)) })] }), _jsxs("div", { className: "wide", children: [_jsx("label", { children: "Search" }), _jsx("input", { placeholder: "Title / notes / sport / category", value: filters.q, onChange: e => setFilters(f => ({ ...f, q: e.target.value })) })] })] }), _jsxs("div", { className: "datatable", children: [_jsxs("div", { className: "thead sticky", children: [_jsx("div", { children: "Date" }), _jsx("div", { children: "Sport" }), _jsx("div", { children: "Category" }), _jsx("div", { children: "Type" }), _jsx("div", { className: "right", children: "Stake" }), _jsx("div", { className: "right", children: "Decimal" }), _jsx("div", { children: "Status" }), _jsx("div", { className: "right", children: "Return" }), _jsx("div", { className: "right", children: "Net" })] }), filtered.length === 0 && (_jsx("div", { className: "empty", children: _jsxs("div", { className: "empty-card", children: [_jsx("div", { className: "empty-emoji", children: "\uD83D\uDD0E" }), _jsx("div", { children: "No records match your filters." })] }) })), filtered.map((t, i) => (_jsxs("div", { className: `trow fancy ${i % 2 ? "odd" : ""}`, children: [_jsx("div", { className: "mono", children: t.event_dt }), _jsx("div", { children: _jsx("span", { className: "badge", children: t.sport }) }), _jsx("div", { children: _jsx("span", { className: "badge alt", children: t.market }) }), _jsx("div", { className: "dim", children: t.ticket_type }), _jsxs("div", { className: "right", children: ["$", Number(t.stake || 0).toFixed(2)] }), _jsx("div", { className: "right", children: Number(t.decimal_odds || 0).toFixed(3) }), _jsx("div", { children: _jsx("span", { className: `pill ${pillClass(t.status)}`, children: t.status }) }), _jsxs("div", { className: "right", children: ["$", Number(t.payout || 0).toFixed(2)] }), _jsxs("div", { className: `right ${((t.payout || 0) - (t.stake || 0)) >= 0 ? "pos" : "neg"}`, children: ["$", Number((t.payout || 0) - (t.stake || 0)).toFixed(2)] })] }, t.id)))] })] }));
}
function pillClass(s) {
    if (s === "Win")
        return "ok";
    if (s === "Loss")
        return "bad";
    if (s === "Push")
        return "muted";
    return "wait";
}
