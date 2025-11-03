// src/components/Pending.tsx
import { useEffect, useMemo, useState } from "react";
import type { Ticket } from "../lib/models";
type Props = {
  tickets: Ticket[];
  updateTicket: (id: string, patch: Partial<Ticket>) => Promise<any> | void;
};

type EditForm = {
  status: "Pending" | "Win" | "Loss" | "Push";
  stake: number;
  decimal_odds: number;
  payout: number;
  notes: string;
};

export default function Pending({ tickets, updateTicket }: Props) {
  const pending = useMemo(
    () => tickets.filter((t) => t.status === "Pending"),
    [tickets]
  );

  const [editingId, setEditingId] = useState<string | null>(null);
  const current = useMemo(
    () => (editingId ? tickets.find((t) => t.id === editingId) ?? null : null),
    [editingId, tickets]
  );

  const [form, setForm] = useState<EditForm>({
    status: "Pending",
    stake: 0,
    decimal_odds: 1,
    payout: 0,
    notes: "",
  });

  // Initialize the form when opening the editor or when ticket updates
  useEffect(() => {
    if (!current) return;
    setForm({
      status: current.status as EditForm["status"],
      stake: Number(current.stake ?? 0),
      decimal_odds: Number(current.decimal_odds ?? 1),
      payout: Number(current.payout ?? 0),
      notes: current.notes ?? "",
    });
  }, [current?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  function openEditor(id: string, toStatus?: EditForm["status"]) {
    setEditingId(id);
    // status will be set in useEffect; optionally override desired next status
    if (toStatus && current?.id !== id) {
      // we can’t set immediately because current isn’t resolved yet;
      // apply in a microtask
      Promise.resolve().then(() => {
        setForm((f) => ({ ...f, status: toStatus }));
      });
    } else if (toStatus) {
      setForm((f) => ({ ...f, status: toStatus }));
    }
  }

  function closeEditor() {
    setEditingId(null);
  }

  function calcSuggestedPayout(stake: number, dec: number) {
    // returns total return (not net): stake * decimal_odds
    const s = Number(stake || 0);
    const d = Number(dec || 1);
    return Number((s * d).toFixed(2));
  }

  async function save() {
    if (!current) {
      // guard if the ticket vanished (e.g., list refreshed)
      setEditingId(null);
      return;
    }
    const { status, stake, decimal_odds, payout, notes } = form;

    // Normalize numbers
    const patch: Partial<Ticket> = {
      status,
      stake: Number(stake || 0),
      decimal_odds: Number(decimal_odds || 1),
      payout: Number(payout || 0),
      notes: notes ?? "",
    };

    await updateTicket(current.id, patch);
    setEditingId(null);
  }

  return (
    <div className="card">
      <h3 style={{ marginBottom: 12 }}>Pending Items</h3>

      {!pending.length && <div className="muted">Nothing pending right now.</div>}

      <div className="table">
        <div className="thead">
          <div>Date</div>
          <div>Title</div>
          <div>Sport</div>
          <div>Market</div>
          <div>Stake</div>
          <div>Odds</div>
          <div>Actions</div>
        </div>
        {pending.map((t) => (
          <div className="trow" key={t.id}>
            <div>{t.event_dt}</div>
            <div>{t.title}</div>
            <div>{t.sport}</div>
            <div>{t.market}</div>
            <div>${Number(t.stake || 0).toFixed(2)}</div>
            <div>{Number(t.decimal_odds || 1).toFixed(2)}</div>
            <div className="row" style={{ gap: 8 }}>
              <button className="btn soft" onClick={() => openEditor(t.id, "Win")}>
                Mark Win
              </button>
              <button className="btn warn" onClick={() => openEditor(t.id, "Loss")}>
                Mark Loss
              </button>
              <button className="btn" onClick={() => openEditor(t.id)}>
                Update
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Editor drawer / modal */}
      {editingId && (
        <div className="drawer">
          <div className="drawer-body">
            {!current ? (
              <div className="muted">Item no longer available.</div>
            ) : (
              <>
                <div className="row space-between">
                  <h4>Edit Outcome</h4>
                  <button className="icon-btn" onClick={closeEditor} aria-label="Close">
                    ×
                  </button>
                </div>

                <div className="grid2">
                  <div>
                    <label>Status</label>
                    <select
                      value={form.status}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, status: e.target.value as EditForm["status"] }))
                      }
                    >
                      {["Pending", "Win", "Loss", "Push"].map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label>Stake ($)</label>
                    <input
                      type="number"
                      min={0}
                      step="0.01"
                      value={Number(form.stake ?? 0)}
                      onChange={(e) => setForm((f) => ({ ...f, stake: Number(e.target.value) }))}
                    />
                  </div>

                  <div>
                    <label>Decimal Odds</label>
                    <input
                      type="number"
                      min={1}
                      step="0.01"
                      value={Number(form.decimal_odds ?? 1)}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, decimal_odds: Number(e.target.value) }))
                      }
                    />
                  </div>

                  <div>
                    <label>Payout ($)</label>
                    <div className="row" style={{ gap: 8 }}>
                      <input
                        type="number"
                        min={0}
                        step="0.01"
                        value={Number(form.payout ?? 0)}
                        onChange={(e) => setForm((f) => ({ ...f, payout: Number(e.target.value) }))}
                      />
                      <button
                        className="btn soft"
                        type="button"
                        onClick={() =>
                          setForm((f) => ({
                            ...f,
                            payout: calcSuggestedPayout(f.stake, f.decimal_odds),
                          }))
                        }
                        title="Use stake × decimal odds"
                      >
                        Suggest
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <label>Notes</label>
                  <textarea
                    rows={3}
                    value={form.notes ?? ""}
                    onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                  />
                </div>

                <div className="row" style={{ gap: 8, marginTop: 12 }}>
                  <button className="btn primary" onClick={save}>
                    Save
                  </button>
                  <button className="btn" onClick={closeEditor}>
                    Cancel
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
