// =============================================================================
// DEALS (legacy alias for OPPORTUNITIES)
// =============================================================================
//
// 2026-05-13: Resource renamed to "Opportunities". The canonical definitions
// now live in ./opportunities.ts. This file re-exports them under the legacy
// DEALS name so that any code still importing { DEALS } from this module keeps
// working.
//
// The /deals/* API path itself remains served indefinitely -- it is documented
// as a "legacy alias" on every endpoint in the canonical Opportunities group.
// Don't add new endpoints here; add them to opportunities.ts.
// =============================================================================

export { OPPORTUNITIES as DEALS } from './opportunities.js';
