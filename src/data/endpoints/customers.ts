// =============================================================================
// CUSTOMERS (legacy alias for COMPANIES)
// =============================================================================
//
// 2026-05-13: Resource renamed to "Companies". The canonical definitions now
// live in ./companies.ts. This file re-exports them under the legacy CUSTOMERS
// name so that any code still importing { CUSTOMERS } from this module keeps
// working.
//
// The /customers/* API path itself remains served indefinitely -- it is
// documented as a "legacy alias" on every endpoint in the canonical Companies
// group. Don't add new endpoints here; add them to companies.ts.
// =============================================================================

export { COMPANIES as CUSTOMERS } from './companies.js';
