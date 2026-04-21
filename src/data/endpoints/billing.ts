import { type ResourceGroup } from './types.js';

// =============================================================================
// BILLING
// =============================================================================

export const BILLING: ResourceGroup = {
  id: 'billing',
  label: 'Billing',
  description: 'View billing plans, credit balance, and pricing.',
  endpoints: [
    {
      method: 'GET',
      path: '/billing/plan',
      description: 'Get the company billing plan, subscription status, seat count, trial window, and plan gating flags.',
      scopes: ['billing:read'],
      isWrite: false,
      response: {
        example: {
          id: 'ca7359da-...',
          status: 'trialing',
          billing_interval: 'monthly',
          seat_count: 1,
          credit_balance: 500,
          current_period_start: '2026-04-21T00:00:00Z',
          current_period_end: '2026-05-21T00:00:00Z',
          trial_end: '2026-05-05T00:00:00Z',
          cancel_at_period_end: false,
          billing_plans: {
            id: '...',
            plan_key: 'pro',
            plan_name: 'Pro',
            price_monthly: 99,
            price_annual: 990,
            credits_per_cycle: 5000,
            trial_credit_grant: 500,
            is_permissions_locked: false,
            features: ['Full CRM access', 'AI tools', 'Automations'],
            feature_access: ['crm', 'automations', 'inbox', 'tools'],
          },
        },
      },
      notes: [
        'status values: trialing (no-card 14-day Pro trial), active, past_due, canceled.',
        'billing_plans.is_permissions_locked: true on the Free plan -- the Permissions settings page is locked and role scopes cannot be edited.',
        'billing_plans.trial_credit_grant: credits automatically granted when a trial starts.',
        'billing_plans.plan_key: free, pro, or enterprise.',
        'trial_end: ISO timestamp when the no-card trial expires. Null for non-trial subscriptions.',
        'Free plan restriction: API access is blocked entirely for free plan workspaces. Every request (including GET /billing/plan) returns HTTP 403 with error code PLAN_REQUIRED and an upgrade_url. Use the Portal UI at /settings/billing to view billing for free plan workspaces.',
        'Trial continuity: when a user on a no-card trial calls create_checkout, remaining trial days carry over to the Stripe subscription rather than granting a fresh 14 days.',
      ],
    },
    { method: 'GET', path: '/billing/balance', description: 'Get the current API credit balance.', scopes: ['billing:read'], isWrite: false },
    { method: 'GET', path: '/billing/usage', description: 'List credit transactions and usage history.', scopes: ['billing:read'], isWrite: false, params: [{ name: 'limit', type: 'number', required: false, description: 'Max results per page', in: 'query' }, { name: 'after', type: 'string', required: false, description: 'Cursor for pagination', in: 'query' }] },
    { method: 'GET', path: '/billing/pricing', description: 'Get the full credit pricing table. Returns all active feature keys with credits_per_use, category, and description. Free endpoint (does not consume credits).', scopes: ['billing:read'], isWrite: false },
  ],
};
