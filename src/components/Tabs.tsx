import clsx from "clsx";
import { useMemo, useState } from "react";
import AddTicket from "./AddTicket";
import Pending from "./Pending";
import Reports from "./Reports";
import DataTab from "./DataTab";
import { Ticket } from "../lib/models";
import { FiPlusSquare, FiClock, FiBarChart2, FiPackage } from "react-icons/fi";

const TAB_LIST = [
  { key: "add",     label: "Add Ticket",   icon: <FiPlusSquare/> },
  { key: "pending", label: "Pending",      icon: <FiClock/> },
  { key: "reports", label: "Reports",      icon: <FiBarChart2/> },
  { key: "data",    label: "Data",         icon: <FiPackage/> },
] as const;

export default function Tabs({
  tickets, addTicket, updateTicket, setTickets, globalDomains
}:{
  tickets:Ticket[];
  addTicket:(t:Ticket)=>void;
  updateTicket:(id:string, patch:Partial<Ticket>)=>void;
  setTickets:(t:Ticket[])=>void;
  globalDomains:{ net:[number,number]; money:[number,number]; count:[number,number]; };
}){
  const [tab, setTab] = useState<"add"|"pending"|"reports"|"data">("add");

  const activeIdx = useMemo(() => TAB_LIST.findIndex(t => t.key===tab), [tab]);

  return (
    <>
      <div className="tabs tabs-real">
        {TAB_LIST.map((t, i)=>(
          <button
            key={t.key}
            className={clsx("tab-pill", tab===t.key && "active")}
            onClick={()=>setTab(t.key as any)}
          >
            {t.icon}<span>{t.label}</span>
          </button>
        ))}
        <div
          className="tab-underline"
          style={{ transform: `translateX(${activeIdx * 100}%)` }}
        />
      </div>

      {tab==="add"     && <AddTicket onSave={addTicket} />}
      {tab==="pending" && <Pending tickets={tickets} updateTicket={updateTicket} />}
      {tab==="reports" && <Reports tickets={tickets} globalDomains={globalDomains} />}
      {tab==="data"    && <DataTab tickets={tickets} setTickets={setTickets} />}
    </>
  );
}
