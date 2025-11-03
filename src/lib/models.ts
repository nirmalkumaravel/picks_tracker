export type Status = "Pending" | "Win" | "Loss" | "Push";
export type TicketType = "Single" | "Multi";
export type Market = "ML" | "Total" | "Spread" | "Alternate" | "Other" | "Unlabeled";

export interface Leg {
  leg_name: string;
  leg_odds: number;
  leg_result: Status;
}

export interface Ticket {
  id: string;
  event_dt: string;   // yyyy-MM-dd
  sport: string;
  market: Market;
  title?: string;
  ticket_type: TicketType;
  stake: number;
  decimal_odds: number;
  status: Status;
  payout: number;
  notes?: string;
  legs?: Leg[];
  net?: number;
}
