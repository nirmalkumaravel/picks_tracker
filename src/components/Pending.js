import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
// src/components/Pending.tsx
import { useEffect, useMemo, useState } from "react";
export default function Pending({ tickets, updateTicket }) {
    const pending = useMemo(() => tickets.filter((t) => t.status === "Pending"), [tickets]);
    const [editingId, setEditingId] = useState(null);
    const current = useMemo(() => (editingId ? tickets.find((t) => t.id === editingId) ?? null : null), [editingId, tickets]);
    const [form, setForm] = useState({
        status: "Pending",
        stake: 0,
        decimal_odds: 1,
        payout: 0,
        notes: "",
    });
    // Initialize the form when opening the editor or when ticket updates
    useEffect(() => {
        if (!current)
            return;
        setForm({
            status: current.status,
            stake: Number(current.stake ?? 0),
            decimal_odds: Number(current.decimal_odds ?? 1),
            payout: Number(current.payout ?? 0),
            notes: current.notes ?? "",
        });
    }, [current?.id]); // eslint-disable-line react-hooks/exhaustive-deps
    function openEditor(id, toStatus) {
        setEditingId(id);
        // status will be set in useEffect; optionally override desired next status
        if (toStatus && current?.id !== id) {
            // we can’t set immediately because current isn’t resolved yet;
            // apply in a microtask
            Promise.resolve().then(() => {
                setForm((f) => ({ ...f, status: toStatus }));
            });
        }
        else if (toStatus) {
            setForm((f) => ({ ...f, status: toStatus }));
        }
    }
    function closeEditor() {
        setEditingId(null);
    }
    function calcSuggestedPayout(stake, dec) {
        // returns total return (not net): stake * decimal_odds
        const s = Number(stake || 0);
        const d = Number(dec || 1);
        return Number((s * d).toFixed(2));
    }
    async function save() {
        if (!current) {
            // guard if the ticket vanished (e.g., list refreshed)
            setEditingId(null);
            return;
        }
        const { status, stake, decimal_odds, payout, notes } = form;
        // Normalize numbers
        const patch = {
            status,
            stake: Number(stake || 0),
            decimal_odds: Number(decimal_odds || 1),
            payout: Number(payout || 0),
            notes: notes ?? "",
        };
        await updateTicket(current.id, patch);
        setEditingId(null);
    }
    return (_jsxs("div", { className: "card", children: [_jsx("h3", { style: { marginBottom: 12 }, children: "Pending Items" }), !pending.length && _jsx("div", { className: "muted", children: "Nothing pending right now." }), _jsxs("div", { className: "table", children: [_jsxs("div", { className: "thead", children: [_jsx("div", { children: "Date" }), _jsx("div", { children: "Title" }), _jsx("div", { children: "Sport" }), _jsx("div", { children: "Market" }), _jsx("div", { children: "Stake" }), _jsx("div", { children: "Odds" }), _jsx("div", { children: "Actions" })] }), pending.map((t) => (_jsxs("div", { className: "trow", children: [_jsx("div", { children: t.event_dt }), _jsx("div", { children: t.title }), _jsx("div", { children: t.sport }), _jsx("div", { children: t.market }), _jsxs("div", { children: ["$", Number(t.stake || 0).toFixed(2)] }), _jsx("div", { children: Number(t.decimal_odds || 1).toFixed(2) }), _jsxs("div", { className: "row", style: { gap: 8 }, children: [_jsx("button", { className: "btn soft", onClick: () => openEditor(t.id, "Win"), children: "Mark Win" }), _jsx("button", { className: "btn warn", onClick: () => openEditor(t.id, "Loss"), children: "Mark Loss" }), _jsx("button", { className: "btn", onClick: () => openEditor(t.id), children: "Update" })] })] }, t.id)))] }), editingId && (_jsx("div", { className: "drawer", children: _jsx("div", { className: "drawer-body", children: !current ? (_jsx("div", { className: "muted", children: "Item no longer available." })) : (_jsxs(_Fragment, { children: [_jsxs("div", { className: "row space-between", children: [_jsx("h4", { children: "Edit Outcome" }), _jsx("button", { className: "icon-btn", onClick: closeEditor, "aria-label": "Close", children: "\u00D7" })] }), _jsxs("div", { className: "grid2", children: [_jsxs("div", { children: [_jsx("label", { children: "Status" }), _jsx("select", { value: form.status, onChange: (e) => setForm((f) => ({ ...f, status: e.target.value })), children: ["Pending", "Win", "Loss", "Push"].map((s) => (_jsx("option", { value: s, children: s }, s))) })] }), _jsxs("div", { children: [_jsx("label", { children: "Stake ($)" }), _jsx("input", { type: "number", min: 0, step: "0.01", value: Number(form.stake ?? 0), onChange: (e) => setForm((f) => ({ ...f, stake: Number(e.target.value) })) })] }), _jsxs("div", { children: [_jsx("label", { children: "Decimal Odds" }), _jsx("input", { type: "number", min: 1, step: "0.01", value: Number(form.decimal_odds ?? 1), onChange: (e) => setForm((f) => ({ ...f, decimal_odds: Number(e.target.value) })) })] }), _jsxs("div", { children: [_jsx("label", { children: "Payout ($)" }), _jsxs("div", { className: "row", style: { gap: 8 }, children: [_jsx("input", { type: "number", min: 0, step: "0.01", value: Number(form.payout ?? 0), onChange: (e) => setForm((f) => ({ ...f, payout: Number(e.target.value) })) }), _jsx("button", { className: "btn soft", type: "button", onClick: () => setForm((f) => ({
                                                            ...f,
                                                            payout: calcSuggestedPayout(f.stake, f.decimal_odds),
                                                        })), title: "Use stake \u00D7 decimal odds", children: "Suggest" })] })] })] }), _jsxs("div", { children: [_jsx("label", { children: "Notes" }), _jsx("textarea", { rows: 3, value: form.notes ?? "", onChange: (e) => setForm((f) => ({ ...f, notes: e.target.value })) })] }), _jsxs("div", { className: "row", style: { gap: 8, marginTop: 12 }, children: [_jsx("button", { className: "btn primary", onClick: save, children: "Save" }), _jsx("button", { className: "btn", onClick: closeEditor, children: "Cancel" })] })] })) }) }))] }));
}
