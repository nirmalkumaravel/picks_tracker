import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
export default function ChartBarSeries({ rows, xKey, yKey, yDomain, color, label, fmt }) {
    const data = rows.map(r => ({ label: r[xKey], value: r[yKey] }));
    return (_jsx("div", { style: { width: "100%", height: 300 }, children: _jsx(ResponsiveContainer, { children: _jsxs(BarChart, { data: data, margin: { top: 10, right: 20, bottom: 0, left: 0 }, children: [_jsx(CartesianGrid, { strokeDasharray: "3 6", stroke: "#e2e8f0" }), _jsx(XAxis, { dataKey: "label" }), _jsx(YAxis, { domain: yDomain }), _jsx(Tooltip, { formatter: (v) => fmt ? fmt(v) : Number(v).toFixed(2) }), _jsx(Legend, {}), _jsx(Bar, { dataKey: "value", name: label || yKey, fill: color, radius: [8, 8, 0, 0] })] }) }) }));
}
