import { type ResourceGroup } from './types.js';

// =============================================================================
// INTEGRATIONS
// =============================================================================

export const INTEGRATIONS: ResourceGroup = {
  id: 'integrations',
  label: 'Integrations',
  description: 'Manage native integrations (Xero, MYOB, etc.). Connect, configure, query, and execute actions.',
  endpoints: [
    { method: 'GET', path: '/integrations', description: 'List all integrations.', scopes: ['integrations:read'], isWrite: false },
    { method: 'GET', path: '/integrations/:id', description: 'Retrieve an integration.', scopes: ['integrations:read'], isWrite: false, params: [{ name: 'id', type: 'uuid', required: true, description: 'Integration ID', in: 'path' }] },
    { method: 'POST', path: '/integrations/connect', description: 'Connect a new integration. platform_type is required.', scopes: ['integrations:write'], isWrite: true, params: [{ name: 'platform_type', type: 'string', required: true, description: 'Integration platform type (e.g. xero, myob)', in: 'body' }] },
    { method: 'PATCH', path: '/integrations/:id', description: 'Update an integration configuration.', scopes: ['integrations:write'], isWrite: true, params: [{ name: 'id', type: 'uuid', required: true, description: 'Integration ID', in: 'path' }] },
    { method: 'DELETE', path: '/integrations/:id', description: 'Delete (disconnect) an integration.', scopes: ['integrations:write'], isWrite: true, params: [{ name: 'id', type: 'uuid', required: true, description: 'Integration ID', in: 'path' }] },
    { method: 'POST', path: '/integrations/:id/query', description: 'Query data from an integration (e.g. list invoices from Xero).', scopes: ['integrations:read'], isWrite: false, params: [{ name: 'id', type: 'uuid', required: true, description: 'Integration ID', in: 'path' }, { name: 'query_type', type: 'string', required: true, description: 'Query type', in: 'body' }, { name: 'params', type: 'object', required: false, description: 'Query parameters', in: 'body' }] },
    { method: 'POST', path: '/integrations/:id/action', description: 'Execute an action on an integration (e.g. create invoice in Xero).', scopes: ['integrations:write'], isWrite: true, params: [{ name: 'id', type: 'uuid', required: true, description: 'Integration ID', in: 'path' }, { name: 'action_type', type: 'string', required: true, description: 'Action type', in: 'body' }, { name: 'params', type: 'object', required: true, description: 'Action parameters', in: 'body' }] },
  ],
};
