export type Status = "Pending" | "Win" | "Loss" | "Push";
export type TicketType = "Single" | "Multi";
export type Market = "ML" | "Total" | "Spread" | "Alternate" | "Other" | "Unlabeled";
// src/lib/models.ts
export type Leg = {
  idx: number;
  sport?: string;
  leg_name: string;
  leg_result?: string;
};

export type Ticket = {
  id: string;                    // UI id (maps to ticket_id from API)
  event_dt: string;              // YYYY-MM-DD
  sport: string;                 // NBA, NFL, etc.
  market: string;                // ML, Total, Spread, Alternate, Other
  title?: string;
  ticket_type: "Single" | "Multi";
  stake: number;
  decimal_odds: number;
  status: "Pending" | "Win" | "Loss" | "Push";
  payout: number;
  notes?: string;
  legs: Leg[];
  created_at?: string;
  updated_at?: string;
};
