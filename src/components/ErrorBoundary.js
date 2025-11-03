import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from "react";
export default class ErrorBoundary extends React.Component {
    constructor(props) { super(props); this.state = { hasError: false }; }
    static getDerivedStateFromError() { return { hasError: true }; }
    componentDidCatch(err, info) { console.error("ErrorBoundary:", err, info); }
    render() {
        if (this.state.hasError)
            return _jsxs("div", { style: { padding: 16 }, children: [_jsx("h3", { children: "Something went wrong." }), _jsx("p", { children: "Try refreshing the page." })] });
        return this.props.children;
    }
}
