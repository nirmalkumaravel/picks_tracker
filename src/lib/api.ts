// src/lib/api.ts
const API =
  import.meta.env.DEV
    ? "/api"
    : import.meta.env.VITE_API_URL;

// TEMP user header until you add Cognito later:
const BASE_HEADERS: Record<string,string> = {
  "Content-Type": "application/json",
  "x-user-id": "demo-user" // replace with Cognito 'sub' later
};

// ---- Types (match your Ticket shape) ----
export type TicketPayload = {
  ticket_id: string;
  event_dt: string;            // "YYYY-MM-DD"
  sport: string;               // NBA, NFL, etc.
  market: string;              // ML, Total, Spread, Alternate, Other
  title?: string;
  ticket_type: "Single" | "Multi";
  stake: number;
  decimal_odds: number;
  status: "Pending" | "Win" | "Loss" | "Push";
  payout: number;
  notes?: string;
  legs?: Array<{ idx: number; sport?: string; leg_name: string; leg_result?: string }>;
};

export async function listTickets(params: {
  start: string;
  end: string;
  sport?: string;
  market?: string;
  status?: string;
}) {
  const qs = new URLSearchParams(params as any).toString();
  const r = await fetch(`${API}/tickets?${qs}`, { headers: BASE_HEADERS });
  if (!r.ok) throw new Error(`listTickets failed: ${r.status}`);
  return r.json();
}

export async function createTicket(t: TicketPayload) {
  const r = await fetch(`${API}/tickets`, {
    method: "POST",
    headers: BASE_HEADERS,
    body: JSON.stringify(t),
  });
  if (!r.ok) throw new Error(`createTicket failed: ${r.status}`);
  return r.json();
}

export async function updateTicket(id: string, patch: Partial<TicketPayload>) {
  const r = await fetch(`${API}/tickets/${id}`, {
    method: "PUT",
    headers: BASE_HEADERS,
    body: JSON.stringify(patch),
  });
  if (!r.ok) throw new Error(`updateTicket failed: ${r.status}`);
  return r.json();
}

export async function deleteTicket(id: string) {
  const r = await fetch(`${API}/tickets/${id}`, {
    method: "DELETE",
    headers: BASE_HEADERS,
  });
  if (!r.ok) throw new Error(`deleteTicket failed: ${r.status}`);
  return r.json();
}
