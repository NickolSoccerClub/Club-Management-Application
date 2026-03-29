// ---------------------------------------------------------------------------
// Finance types – income, expenses, budgets, sponsors, grants
// ---------------------------------------------------------------------------

export type TransactionType = "income" | "expense";
export type TransactionStatus = "pending" | "approved" | "reconciled" | "rejected";
export type SponsorTier = "platinum" | "gold" | "silver" | "bronze";
export type SponsorStatus = "active" | "inactive" | "pending";
export type GrantStatus = "identified" | "draft" | "submitted" | "approved" | "rejected" | "received";

/** An incoming payment / fee. Table: `public.income_records` */
export interface IncomeRecord {
  id: string;
  season_id: string;
  date: string;
  description: string;
  category: string;
  amount: number;
  paid_by: string | null;
  reference: string | null;
  status: TransactionStatus;
  recorded_by: string;
  created_at: string;
}

/** A club expense requiring approval. Table: `public.expense_records` */
export interface ExpenseRecord {
  id: string;
  season_id: string;
  date: string;
  description: string;
  category: string;
  amount: number;
  submitted_by: string;
  approved_by: string | null;
  status: TransactionStatus;
  receipt_url: string | null;
  created_at: string;
}

/** A budget line-item for a season. Table: `public.budget_categories` */
export interface BudgetCategory {
  id: string;
  season_id: string;
  name: string;
  type: TransactionType;
  budgeted_amount: number;
  notes: string | null;
  created_by: string;
}

/**
 * A sponsorship agreement with an external company.
 * Table: `public.sponsors`
 */
export interface Sponsor {
  id: string;
  company_name: string;
  contact_name: string;
  contact_email: string;
  contact_phone: string | null;
  tier: SponsorTier;
  logo_url: string | null;
  website_url: string | null;
  contract_start: string;
  contract_end: string;
  annual_value: number;
  status: SponsorStatus;
  season_id: string;
  created_at: string;
}

/**
 * A grant application tracked through its lifecycle.
 * Table: `public.grants`
 */
export interface Grant {
  id: string;
  season_id: string;
  grant_name: string;
  granting_body: string;
  amount_applied: number;
  amount_received: number | null;
  application_date: string | null;
  decision_date: string | null;
  status: GrantStatus;
  reporting_requirements: string | null;
  next_report_due: string | null;
  created_at: string;
}
