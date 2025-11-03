import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useMemo, useState } from "react";
import { fnum } from "../lib/math";
import { format } from "date-fns";
import { FiPlusSquare } from "react-icons/fi";
const SPORTS = [
    "NBA", "NFL", "MLB", "NHL", "NCAA Football", "NCAA Basketball", "Soccer", "Tennis", "Cricket", "Volleyball",
    "MMA", "Boxing", "Golf", "F1", "NASCAR", "Rugby", "Table Tennis", "Esports", "Other/Custom"
];
const MARKETS = ["ML", "Total", "Spread", "Alternate", "Other"];
const STATUS = ["Pending", "Win", "Loss", "Push"];
export default function AddTicket({ onSave }) {
    const [eventDate, setEventDate] = useState(format(new Date(), "yyyy-MM-dd"));
    const [sportSel, setSportSel] = useState("NBA");
    const [sportCustom, setSportCustom] = useState("");
    const [market, setMarket] = useState("ML");
    const [ticketType, setTicketType] = useState("Single");
    const [title, setTitle] = useState("");
    const [stake, setStake] = useState(""); // keep as string for the input
    const [status, setStatus] = useState("Pending");
    const [notes, setNotes] = useState("");
    // odds
    const [decimalOdds, setDecimalOdds] = useState(""); // used for Single
    const [combinedOdds, setCombinedOdds] = useState("2.50"); // used for Multi
    // legs (no per-leg odds)
    const [legsCnt, setLegsCnt] = useState(2);
    const [legsUX, setLegsUX] = useState([
        { leg_sport: "Tennis", leg_desc: "First leg", leg_result: "Pending" },
        { leg_sport: "NBA", leg_desc: "Second leg", leg_result: "Pending" },
    ]);
    // keep legsUX length in sync when Multi + legsCnt changes
    useEffect(() => {
        if (ticketType !== "Multi")
            return;
        const n = Math.max(2, Number(legsCnt) || 2);
        if (legsUX.length !== n) {
            setLegsUX(Array.from({ length: n }, (_, i) => legsUX[i] || { leg_sport: "NBA", leg_desc: "", leg_result: "Pending" }));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ticketType, legsCnt]);
    const parentSport = sportSel === "Other/Custom" ? (sportCustom.trim() || "Unlabeled") : sportSel;
    const previewReturn = useMemo(() => {
        const s = fnum(stake);
        if (ticketType === "Single") {
            if (status === "Win")
                return s * fnum(decimalOdds);
            if (status === "Push")
                return s;
            return 0;
        }
        // Multi: if any Loss or Pending -> 0; otherwise stake * combinedOdds
        const hasLoss = legsUX.some(l => l.leg_result === "Loss");
        const hasPend = legsUX.some(l => l.leg_result === "Pending");
        if (hasLoss || hasPend)
            return 0;
        return s * fnum(combinedOdds);
    }, [stake, status, decimalOdds, ticketType, legsUX, combinedOdds]);
    const save = () => {
        // Build Leg[] exactly as your model expects
        const legs = ticketType === "Multi"
            ? legsUX.map((l, i) => ({
                idx: i + 1,
                sport: l.leg_sport,
                leg_name: `[${l.leg_sport}] ${l.leg_desc?.trim() || `Leg ${i + 1}`}`,
                leg_result: l.leg_result
            }))
            : [];
        const t = {
            id: "NEW",
            event_dt: eventDate,
            sport: parentSport,
            market: market,
            title,
            ticket_type: ticketType,
            stake: Number.isFinite(Number(stake)) ? Number(stake) : 0,
            decimal_odds: ticketType === "Single"
                ? (Number.isFinite(Number(decimalOdds)) ? Number(decimalOdds) : 0)
                : (Number.isFinite(Number(combinedOdds)) ? Number(combinedOdds) : 0),
            status,
            payout: 0, // actual payout will be set later when resolved
            notes,
            legs
        };
        onSave(t);
        // reset some fields
        setTitle("");
        setStake("");
        setDecimalOdds("");
        setNotes("");
        if (ticketType === "Multi") {
            setLegsCnt(2);
            setCombinedOdds("2.50");
            setLegsUX([
                { leg_sport: "Tennis", leg_desc: "First leg", leg_result: "Pending" },
                { leg_sport: "NBA", leg_desc: "Second leg", leg_result: "Pending" },
            ]);
        }
    };
    return (_jsxs("div", { className: "card", children: [_jsxs("div", { className: "grid3", children: [_jsxs("div", { children: [_jsx("label", { children: "Event Date" }), _jsx("input", { type: "date", value: eventDate, onChange: e => setEventDate(e.target.value) })] }), _jsxs("div", { children: [_jsx("label", { children: "Sport (overall)" }), _jsxs("div", { className: "row", style: { gap: 8 }, children: [_jsx("select", { value: sportSel, onChange: e => setSportSel(e.target.value), children: SPORTS.map(s => _jsx("option", { value: s, children: s }, s)) }), sportSel === "Other/Custom" && (_jsx("input", { placeholder: "Custom\u2026", value: sportCustom, onChange: e => setSportCustom(e.target.value) }))] })] }), _jsxs("div", { children: [_jsx("label", { children: "Category" }), _jsx("select", { value: market, onChange: e => setMarket(e.target.value), children: MARKETS.map(m => _jsx("option", { value: m, children: m }, m)) })] })] }), _jsxs("div", { className: "grid3", children: [_jsxs("div", { children: [_jsx("label", { children: "Ticket Type" }), _jsx("div", { className: "seg", children: ["Single", "Multi"].map(t => (_jsx("button", { className: `segbtn ${ticketType === t ? "active" : ""}`, onClick: () => setTicketType(t), type: "button", children: t }, t))) })] }), _jsxs("div", { children: [_jsx("label", { children: "Stake" }), _jsx("input", { type: "number", step: "0.01", value: stake, onChange: e => setStake(e.target.value) })] }), _jsxs("div", { children: [_jsx("label", { children: "Status" }), _jsx("select", { value: status, onChange: e => setStatus(e.target.value), children: STATUS.map(s => _jsx("option", { value: s, children: s }, s)) })] })] }), _jsxs("div", { className: "grid2", children: [_jsxs("div", { children: [_jsx("label", { children: "Title (optional)" }), _jsx("input", { placeholder: "Brief label", value: title, onChange: e => setTitle(e.target.value) })] }), _jsxs("div", { children: [_jsx("label", { children: "Notes" }), _jsx("input", { placeholder: "Anything to remember\u2026", value: notes, onChange: e => setNotes(e.target.value) })] })] }), ticketType === "Single" ? (_jsx("div", { className: "grid2", children: _jsxs("div", { children: [_jsx("label", { children: "Decimal Odds" }), _jsx("input", { type: "number", step: "0.01", value: decimalOdds, onChange: e => setDecimalOdds(e.target.value) })] }) })) : (_jsxs(_Fragment, { children: [_jsxs("div", { className: "grid3", children: [_jsxs("div", { children: [_jsx("label", { children: "How many legs?" }), _jsx("input", { type: "number", min: 2, max: 20, value: legsCnt, onChange: e => setLegsCnt(Number(e.target.value)) })] }), _jsxs("div", { children: [_jsx("label", { children: "Combined Decimal Odds" }), _jsx("input", { type: "number", step: "0.0001", value: combinedOdds, onChange: e => setCombinedOdds(e.target.value) })] }), _jsxs("div", { className: "info", style: { alignSelf: "end" }, children: ["Projected Return (if all Win/Push): ", _jsxs("b", { children: ["$", (previewReturn || 0).toFixed(2)] })] })] }), _jsxs("div", { className: "table legs", children: [_jsxs("div", { className: "thead", children: [_jsx("div", { children: "Leg Sport" }), _jsx("div", { children: "Description" }), _jsx("div", { children: "Result" })] }), legsUX.map((lg, i) => (_jsxs("div", { className: "trow", children: [_jsx("select", { value: lg.leg_sport, onChange: e => patchLeg(i, { leg_sport: e.target.value }), children: SPORTS.map(s => _jsx("option", { value: s, children: s }, s)) }), _jsx("input", { value: lg.leg_desc, onChange: e => patchLeg(i, { leg_desc: e.target.value }), placeholder: "e.g., Tennis - Player A" }), _jsx("select", { value: lg.leg_result, onChange: e => patchLeg(i, { leg_result: e.target.value }), children: STATUS.map(s => _jsx("option", { value: s, children: s }, s)) })] }, i)))] })] })), _jsxs("div", { className: "info", children: ["Projected Return: ", _jsxs("b", { children: ["$", (previewReturn || 0).toFixed(2)] }), " \u2022 Net:", " ", _jsxs("b", { children: ["$", ((previewReturn || 0) - fnum(stake)).toFixed(2)] })] }), _jsxs("button", { className: "primary", onClick: save, type: "button", children: [_jsx(FiPlusSquare, { style: { verticalAlign: "-2px", marginRight: 6 } }), " Save Ticket"] })] }));
    function patchLeg(i, patch) {
        setLegsUX(prev => {
            const copy = [...prev];
            copy[i] = { ...copy[i], ...patch };
            return copy;
        });
    }
}
