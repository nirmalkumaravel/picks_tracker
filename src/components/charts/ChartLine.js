import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { format, parseISO } from "date-fns";
export default function ChartLine({ data, xKey, yKey, yDomain, color }) {
    return (_jsx("div", { style: { width: "100%", height: 300 }, children: _jsx(ResponsiveContainer, { children: _jsxs(LineChart, { data: data, margin: { top: 10, right: 20, bottom: 0, left: 0 }, children: [_jsx("defs", { children: _jsxs("linearGradient", { id: "gradLine", x1: "0", y1: "0", x2: "1", y2: "0", children: [_jsx("stop", { offset: "0%", stopColor: color, stopOpacity: 0.9 }), _jsx("stop", { offset: "100%", stopColor: color, stopOpacity: 0.5 })] }) }), _jsx(CartesianGrid, { strokeDasharray: "3 6" }), _jsx(XAxis, { dataKey: xKey, tickFormatter: (d) => format(parseISO(d), "MMM d") }), _jsx(YAxis, { domain: yDomain }), _jsx(Tooltip, { formatter: (v) => Number(v).toFixed(2), labelFormatter: (l) => format(parseISO(l), "PP") }), _jsx(Legend, {}), _jsx(Line, { type: "monotone", dataKey: yKey, stroke: "url(#gradLine)", strokeWidth: 3, dot: { r: 3 } })] }) }) }));
}
