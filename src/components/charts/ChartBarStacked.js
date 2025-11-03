import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
export default function ChartBarStacked({ rows }) {
    return (_jsx("div", { style: { width: "100%", height: 320 }, children: _jsx(ResponsiveContainer, { children: _jsxs(BarChart, { data: rows, margin: { top: 10, right: 20, bottom: 0, left: 0 }, children: [_jsx(CartesianGrid, { strokeDasharray: "3 6", stroke: "#e2e8f0" }), _jsx(XAxis, { dataKey: "label" }), _jsx(YAxis, {}), _jsx(Tooltip, {}), _jsx(Legend, {}), _jsx(Bar, { dataKey: "Win", stackId: "a", fill: "#22C55E", radius: [8, 8, 0, 0] }), _jsx(Bar, { dataKey: "Loss", stackId: "a", fill: "#EF4444", radius: [8, 8, 0, 0] }), _jsx(Bar, { dataKey: "Push", stackId: "a", fill: "#94A3B8", radius: [8, 8, 0, 0] }), _jsx(Bar, { dataKey: "Pending", stackId: "a", fill: "#A3A3A3", radius: [8, 8, 0, 0] })] }) }) }));
}
