import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import clsx from "clsx";
import { useMemo, useState } from "react";
import AddTicket from "./AddTicket";
import Pending from "./Pending";
import Reports from "./Reports";
import DataTab from "./DataTab";
import { FiPlusSquare, FiClock, FiBarChart2, FiPackage } from "react-icons/fi";
const TAB_LIST = [
    { key: "add", label: "Add Ticket", icon: _jsx(FiPlusSquare, {}) },
    { key: "pending", label: "Pending", icon: _jsx(FiClock, {}) },
    { key: "reports", label: "Reports", icon: _jsx(FiBarChart2, {}) },
    { key: "data", label: "Data", icon: _jsx(FiPackage, {}) },
];
export default function Tabs({ tickets, addTicket, updateTicket, setTickets, globalDomains }) {
    const [tab, setTab] = useState("add");
    const activeIdx = useMemo(() => TAB_LIST.findIndex(t => t.key === tab), [tab]);
    return (_jsxs(_Fragment, { children: [_jsxs("div", { className: "tabs tabs-real", children: [TAB_LIST.map((t, i) => (_jsxs("button", { className: clsx("tab-pill", tab === t.key && "active"), onClick: () => setTab(t.key), children: [t.icon, _jsx("span", { children: t.label })] }, t.key))), _jsx("div", { className: "tab-underline", style: { transform: `translateX(${activeIdx * 100}%)` } })] }), tab === "add" && _jsx(AddTicket, { onSave: addTicket }), tab === "pending" && _jsx(Pending, { tickets: tickets, updateTicket: updateTicket }), tab === "reports" && _jsx(Reports, { tickets: tickets, globalDomains: globalDomains }), tab === "data" && _jsx(DataTab, { tickets: tickets, setTickets: setTickets })] }));
}
