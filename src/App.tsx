import { useEffect, useMemo, useState } from "react";
import "./styles.css";
import Topbar from "./components/Topbar";
import Tabs from "./components/Tabs";
import ErrorBoundary from "./components/ErrorBoundary";
import { Ticket } from "./lib/models";
import { v4 as uuidv4 } from "uuid";
import { addDays, fmtISO } from "./lib/group";
import { withComputed } from "./lib/storage";
import { normalizeLegs } from "./lib/storage"; // <-- add this line
import {
  listTickets as apiList,
  createTicket as apiCreate,
  updateTicket as apiUpdate,
  deleteTicket as apiDelete,
} from "./lib/api";

export default function App() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  // default load window: last 120 days
  const [range, setRange] = useState<{ start: string; end: string }>({
    start: fmtISO(addDays(new Date(), -120)),
    end: fmtISO(new Date()),
  });

  // ---- Load from API whenever range changes ----
  useEffect(() => {
    let isAlive = true;
    (async () => {
      try {
        setLoading(true);
        setLoadError(null);
        const rows = await apiList({ start: range.start, end: range.end });
        // Ensure each record conforms to Ticket and has computed fields
        const normalized: Ticket[] = rows.map((r: any) =>
        withComputed({
          id: r.ticket_id ?? r.id,
          event_dt: r.event_dt ?? r.eventDate,
          sport: r.sport,
          market: r.market,
          title: r.title ?? "",
          ticket_type: r.ticket_type ?? r.ticketType ?? "Single",
          stake: Number(r.stake || 0),
          decimal_odds: Number(r.decimal_odds || r.odds || 1),
          status: r.status,
          payout: Number(r.payout || 0),
          notes: r.notes ?? "",
          legs: normalizeLegs(r.legs),            // <-- HERE
          created_at: r.created_at,
          updated_at: r.updated_at,
        })
      );
        if (isAlive) setTickets(normalized);
      } catch (e: any) {
        console.error(e);
        if (isAlive) setLoadError("Failed to load records from server.");
      } finally {
        if (isAlive) setLoading(false);
      }
    })();
    return () => {
      isAlive = false;
    };
  }, [range.start, range.end]);

  // ---- Global axis domains for charts ----
  const globalDomains = useMemo(() => {
    if (!tickets.length)
      return {
        net: [-1, 1] as [number, number],
        money: [0, 1] as [number, number],
        count: [0, 10] as [number, number],
      };
    const moneyMax = Math.max(
      ...tickets.map((t) => Math.max(Number(t.stake) || 0, Number(t.payout) || 0))
    );
    const nets = tickets.map((t) => Number(t.payout || 0) - Number(t.stake || 0));
    const netMin = Math.min(...nets),
      netMax = Math.max(...nets);
    return {
      net: niceDomain(netMin, netMax),
      money: niceDomain(0, moneyMax),
      count: niceDomain(0, Math.max(10, tickets.length)),
    };
  }, [tickets]);

  // ---- CRUD handlers (optimistic) ----
  const addTicket = async (t: Ticket) => {
    const id = uuidv4();
    const candidate = withComputed({ ...t, id });

    // optimistic add
    setTickets((prev) => [...prev, candidate]);

    try {
      await apiCreate({
        ticket_id: id,
        event_dt: candidate.event_dt,
        sport: candidate.sport,
        market: candidate.market,
        title: candidate.title ?? "",
        ticket_type: candidate.ticket_type,
        stake: Number(candidate.stake || 0),
        decimal_odds: Number(candidate.decimal_odds || 1),
        status: candidate.status,
        payout: Number(candidate.payout || 0),
        notes: candidate.notes ?? "",
        legs: candidate.legs ?? [],
      });
    } catch (e) {
      console.error(e);
      // rollback on failure
      setTickets((prev) => prev.filter((x) => x.id !== id));
      alert("Failed to save. Please try again.");
    }
  };

  const updateTicket = async (id: string, patch: Partial<Ticket>) => {
    const before = tickets;
    // optimistic update
    setTickets((prev) =>
      prev.map((t) => (t.id === id ? withComputed({ ...t, ...patch }) : t))
    );

    try {
      // send only fields that may change
      const allowed = [
        "event_dt",
        "sport",
        "market",
        "title",
        "ticket_type",
        "stake",
        "decimal_odds",
        "status",
        "payout",
        "notes",
        "legs",
      ] as const;
      const payload: Record<string, any> = {};
      for (const k of allowed) {
        if (k in patch) {
          // map UI -> API keys if needed (kept same names as Lambda handler)
          payload[k] = (patch as any)[k];
        }
      }
      await apiUpdate(id, payload);
    } catch (e) {
      console.error(e);
      alert("Update failed; reloading.");
      // reload current range from server
      try {
        const rows = await apiList({ start: range.start, end: range.end });
        const normalized: Ticket[] = rows.map((r: any) =>
          withComputed({
            id: r.ticket_id ?? r.id,
            event_dt: r.event_dt ?? r.eventDate,
            sport: r.sport,
            market: r.market,
            title: r.title ?? "",
            ticket_type: r.ticket_type ?? r.ticketType ?? "Single",
            stake: Number(r.stake || 0),
            decimal_odds: Number(r.decimal_odds || r.odds || 1),
            status: r.status,
            payout: Number(r.payout || 0),
            notes: r.notes ?? "",
            legs: Array.isArray(r.legs) ? r.legs : [],
            created_at: r.created_at,
            updated_at: r.updated_at,
          } as Ticket)
        );
        setTickets(normalized);
      } catch {
        // if reload also fails, revert to before
        setTickets(before);
      }
    }
  };

  // optional: expose delete for Data tab
  const deleteTicket = async (id: string) => {
    const prev = tickets;
    setTickets((t) => t.filter((x) => x.id !== id));
    try {
      await apiDelete(id);
    } catch (e) {
      console.error(e);
      alert("Delete failed; restoring.");
      setTickets(prev);
    }
  };

  // ---- Render ----
  return (
    <ErrorBoundary>
      <div className="shell">
        <Topbar />

        {/* quick range picker in header (optional) */}
        <div className="card" style={{ marginBottom: 12 }}>
          <div className="grid3">
            <div>
              <label>Range (start)</label>
              <input
                type="date"
                value={range.start}
                onChange={(e) => setRange((r) => ({ ...r, start: e.target.value }))}
              />
            </div>
            <div>
              <label>Range (end)</label>
              <input
                type="date"
                value={range.end}
                onChange={(e) => setRange((r) => ({ ...r, end: e.target.value }))}
              />
            </div>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 8 }}>
              {loading ? <span className="pill soft">Loading…</span> : <span className="pill good">Synced</span>}
              {loadError && <span className="pill bad">{loadError}</span>}
            </div>
          </div>
        </div>

        <Tabs
          tickets={tickets}
          addTicket={addTicket}
          updateTicket={updateTicket}
          setTickets={setTickets}
          globalDomains={globalDomains}
          // if your Tabs component accepts these, pass them; else it can use setTickets:
          // @ts-expect-error optional props depending on your Tabs signature
          deleteTicket={deleteTicket}
          // @ts-expect-error optional props depending on your Tabs signature
          range={range}
          // @ts-expect-error optional props depending on your Tabs signature
          setRange={setRange}
          // @ts-expect-error optional props depending on your Tabs signature
          loading={loading}
        />
      </div>
    </ErrorBoundary>
  );
}

function niceDomain(min: number, max: number): [number, number] {
  if (!isFinite(min) || !isFinite(max)) return [0, 1];
  if (min === max) {
    const span = Math.abs(min) * 0.2 + 1;
    return [min - span, max + span];
  }
  const pad = (max - min) * 0.05;
  return [min - pad, max + pad] as [number, number];
}
