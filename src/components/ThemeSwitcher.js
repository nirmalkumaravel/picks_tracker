import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { FiSun, FiMoon, FiFeather, FiZap, FiCloud } from "react-icons/fi";
const THEMES = ["light", "aurora", "sunset", "ocean", "neon"];
export default function ThemeSwitcher() {
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem("picks.theme") || "light";
    });
    useEffect(() => {
        const root = document.documentElement;
        root.setAttribute("data-theme", theme);
        localStorage.setItem("picks.theme", theme);
    }, [theme]);
    return (_jsxs("div", { className: "theme-switcher", children: [_jsx("button", { className: `pill ${theme === "light" ? "active" : ""}`, title: "Light", onClick: () => setTheme("light"), children: _jsx(FiCloud, {}) }), _jsx("button", { className: `pill ${theme === "aurora" ? "active" : ""}`, title: "Aurora", onClick: () => setTheme("aurora"), children: _jsx(FiFeather, {}) }), _jsx("button", { className: `pill ${theme === "sunset" ? "active" : ""}`, title: "Sunset", onClick: () => setTheme("sunset"), children: _jsx(FiSun, {}) }), _jsx("button", { className: `pill ${theme === "ocean" ? "active" : ""}`, title: "Ocean", onClick: () => setTheme("ocean"), children: _jsx(FiMoon, {}) }), _jsx("button", { className: `pill ${theme === "neon" ? "active" : ""}`, title: "Neon", onClick: () => setTheme("neon"), children: _jsx(FiZap, {}) })] }));
}
