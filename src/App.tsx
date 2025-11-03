import { useEffect, useMemo, useState } from "react";
import "./styles.css";
import Topbar from "./components/Topbar";
import Tabs from "./components/Tabs";
import ErrorBoundary from "./components/ErrorBoundary";
import { Ticket } from "./lib/models";
import { loadTickets, saveTickets, withComputed, newId } from "./lib/storage";

export default function App(){
  const [tickets, setTickets] = useState<Ticket[]>(loadTickets);

  useEffect(()=>{ saveTickets(tickets); }, [tickets]);

  const globalDomains = useMemo(()=>{
    if (!tickets.length) return { net:[-1,1] as [number,number], money:[0,1] as [number,number], count:[0,10] as [number,number] };
    const moneyMax = Math.max(...tickets.map(t => Math.max(Number(t.stake)||0, Number(t.payout)||0)));
    const nets = tickets.map(t => (Number(t.payout||0) - Number(t.stake||0)));
    const netMin = Math.min(...nets), netMax = Math.max(...nets);
    return {
      net: niceDomain(netMin, netMax),
      money: niceDomain(0, moneyMax),
      count: niceDomain(0, Math.max(10, tickets.length))
    };
  }, [tickets]);

  const addTicket = (t: Ticket) => setTickets(prev => [...prev, withComputed({ ...t, id: newId() })]);
  const updateTicket = (id: string, patch: Partial<Ticket>) =>
    setTickets(prev => prev.map(t => t.id === id ? withComputed({ ...t, ...patch }) : t));

  return (
    <ErrorBoundary>
      <div className="shell">
        <Topbar />
        <Tabs
          tickets={tickets}
          addTicket={addTicket}
          updateTicket={updateTicket}
          setTickets={setTickets}
          globalDomains={globalDomains}
        />
      </div>
    </ErrorBoundary>
  );
}

function niceDomain(min:number, max:number):[number,number]{
  if (!isFinite(min) || !isFinite(max)) return [0,1];
  if (min===max){ const span=Math.abs(min)*0.2+1; return [min-span, max+span]; }
  const pad=(max-min)*0.05; return [min-pad, max+pad];
}
