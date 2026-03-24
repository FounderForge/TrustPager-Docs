import { type ResourceGroup } from './types.js';

// =============================================================================
// WEBHOOKS
// =============================================================================

export const WEBHOOKS: ResourceGroup = {
  id: 'webhooks',
  label: 'Webhooks',
  description: 'Manage incoming and outgoing webhooks for external system integration.',
  endpoints: [
    { method: 'GET', path: '/webhooks/incoming', description: 'List incoming webhooks.', scopes: ['webhooks:read'], isWrite: false },
    { method: 'GET', path: '/webhooks/incoming/:id', description: 'Retrieve an incoming webhook.', scopes: ['webhooks:read'], isWrite: false, params: [{ name: 'id', type: 'uuid', required: true, description: 'Webhook ID', in: 'path' }] },
    { method: 'POST', path: '/webhooks/incoming', description: 'Create an incoming webhook.', scopes: ['webhooks:write'], isWrite: true },
    { method: 'PATCH', path: '/webhooks/incoming/:id', description: 'Update an incoming webhook.', scopes: ['webhooks:write'], isWrite: true, params: [{ name: 'id', type: 'uuid', required: true, description: 'Webhook ID', in: 'path' }] },
    { method: 'DELETE', path: '/webhooks/incoming/:id', description: 'Delete an incoming webhook.', scopes: ['webhooks:write'], isWrite: true, params: [{ name: 'id', type: 'uuid', required: true, description: 'Webhook ID', in: 'path' }] },
    { method: 'GET', path: '/webhooks/outgoing', description: 'List outgoing webhooks.', scopes: ['webhooks:read'], isWrite: false },
    { method: 'GET', path: '/webhooks/outgoing/:id', description: 'Retrieve an outgoing webhook.', scopes: ['webhooks:read'], isWrite: false, params: [{ name: 'id', type: 'uuid', required: true, description: 'Webhook ID', in: 'path' }] },
    { method: 'POST', path: '/webhooks/outgoing', description: 'Create an outgoing webhook.', scopes: ['webhooks:write'], isWrite: true },
    { method: 'PATCH', path: '/webhooks/outgoing/:id', description: 'Update an outgoing webhook.', scopes: ['webhooks:write'], isWrite: true, params: [{ name: 'id', type: 'uuid', required: true, description: 'Webhook ID', in: 'path' }] },
    { method: 'DELETE', path: '/webhooks/outgoing/:id', description: 'Delete an outgoing webhook.', scopes: ['webhooks:write'], isWrite: true, params: [{ name: 'id', type: 'uuid', required: true, description: 'Webhook ID', in: 'path' }] },
    { method: 'POST', path: '/webhooks/outgoing/:id/test', description: 'Send a test event to an outgoing webhook.', scopes: ['webhooks:write'], isWrite: true, params: [{ name: 'id', type: 'uuid', required: true, description: 'Webhook ID', in: 'path' }] },
    { method: 'GET', path: '/webhooks/outgoing/:id/logs', description: 'View delivery logs for an outgoing webhook.', scopes: ['webhooks:read'], isWrite: false, params: [{ name: 'id', type: 'uuid', required: true, description: 'Webhook ID', in: 'path' }] },
    { method: 'GET', path: '/webhooks/subscriptions', description: 'List webhook event subscriptions.', scopes: ['webhooks:read'], isWrite: false },
    { method: 'POST', path: '/webhooks/subscriptions', description: 'Subscribe to webhook events. url, events array, and secret are required.', scopes: ['webhooks:write'], isWrite: true, params: [{ name: 'url', type: 'string', required: true, description: 'Delivery URL', in: 'body' }, { name: 'events', type: 'string[]', required: true, description: 'Event types to subscribe to', in: 'body' }, { name: 'secret', type: 'string', required: true, description: 'Signing secret for payload verification', in: 'body' }] },
    { method: 'PATCH', path: '/webhooks/subscriptions/:id', description: 'Update a webhook subscription.', scopes: ['webhooks:write'], isWrite: true, params: [{ name: 'id', type: 'uuid', required: true, description: 'Subscription ID', in: 'path' }] },
    { method: 'DELETE', path: '/webhooks/subscriptions/:id', description: 'Delete a webhook subscription.', scopes: ['webhooks:write'], isWrite: true, params: [{ name: 'id', type: 'uuid', required: true, description: 'Subscription ID', in: 'path' }] },
    { method: 'GET', path: '/webhooks/subscriptions/:id/logs', description: 'List delivery logs for a webhook subscription.', scopes: ['webhooks:read'], isWrite: false, params: [{ name: 'id', type: 'uuid', required: true, description: 'Subscription ID', in: 'path' }] },
  ],
};
