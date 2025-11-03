import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import ThemeSwitcher from "./ThemeSwitcher";
import { FiLayers } from "react-icons/fi";
export default function Topbar() {
    return (_jsxs("header", { className: "topbar", children: [_jsxs("div", { className: "brand", children: [_jsx("div", { className: "logo", children: _jsx(FiLayers, { size: 22 }) }), _jsxs("div", { children: [_jsx("div", { className: "title", children: "Picks Tracker" }), _jsx("div", { className: "subtitle", children: "Tickets \u2022 Legs \u2022 Colorful insights" })] })] }), _jsx(ThemeSwitcher, {})] }));
}
