import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
export default function ChartBarCounts({ counts, yDomain }) {
    const data = ["Win", "Loss", "Push", "Pending"].map(name => ({ name, value: counts[name] || 0 }));
    return (_jsx("div", { style: { width: "100%", height: 280 }, children: _jsx(ResponsiveContainer, { children: _jsxs(BarChart, { data: data, children: [_jsx(CartesianGrid, { stroke: "#eee" }), _jsx(XAxis, { dataKey: "name" }), _jsx(YAxis, { domain: yDomain }), _jsx(Tooltip, {}), _jsx(Legend, {}), _jsx(Bar, { dataKey: "value", name: "Count", fill: "#22C55E" })] }) }) }));
}
