import React from "react";

export default class ErrorBoundary extends React.Component<{children:React.ReactNode},{hasError:boolean}> {
  constructor(props:any){ super(props); this.state = { hasError:false }; }
  static getDerivedStateFromError(){ return { hasError:true }; }
  componentDidCatch(err:any, info:any){ console.error("ErrorBoundary:", err, info); }
  render(){
    if (this.state.hasError) return <div style={{padding:16}}><h3>Something went wrong.</h3><p>Try refreshing the page.</p></div>;
    return this.props.children;
  }
}
