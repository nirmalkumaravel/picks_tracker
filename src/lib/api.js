// src/lib/api.ts
const API = import.meta.env.DEV
    ? "/api"
    : import.meta.env.VITE_API_URL;
// TEMP user header until you add Cognito later:
const BASE_HEADERS = {
    "Content-Type": "application/json",
    "x-user-id": "demo-user" // replace with Cognito 'sub' later
};
export async function listTickets(params) {
    const qs = new URLSearchParams(params).toString();
    const r = await fetch(`${API}/tickets?${qs}`, { headers: BASE_HEADERS });
    if (!r.ok)
        throw new Error(`listTickets failed: ${r.status}`);
    return r.json();
}
export async function createTicket(t) {
    const r = await fetch(`${API}/tickets`, {
        method: "POST",
        headers: BASE_HEADERS,
        body: JSON.stringify(t),
    });
    if (!r.ok)
        throw new Error(`createTicket failed: ${r.status}`);
    return r.json();
}
export async function updateTicket(id, patch) {
    const r = await fetch(`${API}/tickets/${id}`, {
        method: "PUT",
        headers: BASE_HEADERS,
        body: JSON.stringify(patch),
    });
    if (!r.ok)
        throw new Error(`updateTicket failed: ${r.status}`);
    return r.json();
}
export async function deleteTicket(id) {
    const r = await fetch(`${API}/tickets/${id}`, {
        method: "DELETE",
        headers: BASE_HEADERS,
    });
    if (!r.ok)
        throw new Error(`deleteTicket failed: ${r.status}`);
    return r.json();
}
