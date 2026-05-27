import { type ResourceGroup } from './types.js';

// =============================================================================
// PHONE
// =============================================================================

export const PHONE: ResourceGroup = {
  id: 'phone',
  label: 'Phone',
  description: 'Manage phone numbers and call logs. Search for available numbers to purchase.',
  endpoints: [
    { method: 'GET', path: '/phone/numbers', description: 'List company phone numbers.', scopes: ['phone:read'], isWrite: false },
    { method: 'POST', path: '/phone/numbers/search', description: 'Search available phone numbers to purchase.', scopes: ['phone:read'], isWrite: false, params: [{ name: 'country', type: 'string', required: false, description: 'Country code (default: AU)', in: 'body' }, { name: 'area_code', type: 'string', required: false, description: 'Area code filter', in: 'body' }] },
    { method: 'POST', path: '/phone/numbers/buy', description: 'Purchase a phone number.', scopes: ['phone:write'], isWrite: true, params: [{ name: 'phone_number', type: 'string', required: true, description: 'Phone number to purchase', in: 'body' }] },
    { method: 'DELETE', path: '/phone/numbers/:id', description: 'Release a phone number.', scopes: ['phone:write'], isWrite: true, params: [{ name: 'id', type: 'uuid', required: true, description: 'Phone number ID', in: 'path' }] },
    { method: 'GET', path: '/phone/numbers/:id', description: 'Get a specific phone number by ID.', scopes: ['phone:read'], isWrite: false, params: [{ name: 'id', type: 'uuid', required: true, description: 'Phone number ID', in: 'path' }] },
    {
      method: 'PATCH',
      path: '/phone/numbers/:id',
      description: 'Update phone number settings. Settable fields: friendly_name, transfer_number, inbound_voice_agent_config_id (voice_agent_config UUID or null), outbound_voice_agent_config_id (voice_agent_config UUID or null). When either agent assignment field is included, the API immediately pushes the change to Retell and returns retell_last_synced_at / retell_last_sync_error. Retell sync failure does NOT roll back the DB write.',
      scopes: ['phone:write'],
      isWrite: true,
      params: [
        { name: 'id', type: 'uuid', required: true, description: 'Phone number ID', in: 'path' },
        { name: 'friendly_name', type: 'string', required: false, description: 'Display name', in: 'body' },
        { name: 'transfer_number', type: 'string', required: false, description: 'Call forwarding number in E.164 format', in: 'body' },
        { name: 'inbound_voice_agent_config_id', type: 'string|null', required: false, description: 'voice_agent_config UUID for answering inbound calls. Pass null to clear.', in: 'body' },
        { name: 'outbound_voice_agent_config_id', type: 'string|null', required: false, description: 'voice_agent_config UUID for outbound caller ID. Pass null to clear.', in: 'body' },
      ],
    },
    { method: 'POST', path: '/phone/numbers/:id/release', description: 'Release a phone number.', scopes: ['phone:write'], isWrite: true, params: [{ name: 'id', type: 'uuid', required: true, description: 'Phone number ID', in: 'path' }] },
    {
      method: 'POST',
      path: '/phone/numbers/:id/import-to-retell',
      description: 'Register an existing phone number with the AI voice provider so voice agents can be bound to it. Idempotent -- safe to re-run on a number that is already registered. Use this to recover numbers that were purchased before auto-registration was enabled, or where the automatic registration failed. After this completes successfully, PATCH /phone/numbers/:id with inbound_voice_agent_config_id or outbound_voice_agent_config_id will succeed. On success, the response includes retell_import.retell_phone_number_id (the E.164 number) and retell_import.termination_uri.',
      scopes: ['phone:write'],
      isWrite: true,
      params: [
        { name: 'id', type: 'uuid', required: true, description: 'Phone number UUID', in: 'path' },
      ],
      response: {
        example: JSON.stringify({
          id: 'uuid',
          phone_number: '+61400000001',
          retell_phone_number_id: '+61400000001',
          retell_imported_at: '2026-05-28T10:00:00Z',
          retell_last_synced_at: '2026-05-28T10:00:00Z',
          retell_last_sync_error: null,
          retell_import: {
            retell_phone_number_id: '+61400000001',
            already_imported: false,
            termination_uri: 'retell-example-sip.pstn.twilio.com',
          },
        }, null, 2),
      },
    },
    { method: 'GET', path: '/phone/call-logs', description: 'List phone call logs.', scopes: ['calls:read'], isWrite: false },
    { method: 'GET', path: '/phone/addresses', description: 'List regulatory addresses for phone compliance.', scopes: ['phone:read'], isWrite: false },
    { method: 'POST', path: '/phone/addresses', description: 'Create a regulatory address for phone compliance.', scopes: ['phone:write'], isWrite: true },
    { method: 'GET', path: '/phone/bundles', description: 'List regulatory bundles for phone compliance.', scopes: ['phone:read'], isWrite: false },
    { method: 'POST', path: '/phone/bundles', description: 'Create a regulatory bundle.', scopes: ['phone:write'], isWrite: true },
    { method: 'POST', path: '/phone/bundles/:id/submit', description: 'Submit a regulatory bundle for review.', scopes: ['phone:write'], isWrite: true, params: [{ name: 'id', type: 'uuid', required: true, description: 'Bundle ID', in: 'path' }] },
    {
      method: 'GET',
      path: '/phone/bundles/:id',
      description: 'Get a single regulatory bundle with live compliance state. Returns the DB record plus live provider detail and evaluation history (per-requirement pass/fail breakdown). Use this to diagnose why a bundle was rejected and see which compliance requirements failed.',
      scopes: ['phone:read'],
      isWrite: false,
      params: [
        { name: 'id', type: 'uuid', required: true, description: 'Bundle UUID', in: 'path' },
      ],
      response: {
        example: JSON.stringify({
          id: 'uuid',
          company_id: 'uuid',
          bundle_sid: 'BU...',
          friendly_name: 'My Bundle',
          status: 'twilio-rejected',
          approved_at: null,
          created_at: '2025-01-01T00:00:00Z',
          updated_at: '2025-01-01T00:00:00Z',
          twilio: {
            detail: {
              sid: 'BU...',
              friendly_name: 'My Bundle',
              status: 'twilio-rejected',
              valid_until: null,
              email: 'admin@example.com',
              status_callback: null,
            },
            detail_error: null,
            evaluations: [
              {
                sid: 'EL...',
                account_sid: 'AC...',
                regulation_sid: 'RN...',
                bundle_sid: 'BU...',
                status: 'noncompliant',
                date_created: '2025-01-01T00:00:00Z',
                date_updated: '2025-01-01T00:00:00Z',
                results: [
                  {
                    friendly_name: 'Business Identity',
                    object_type: 'business',
                    passed: false,
                    failure_reason: 'Business name does not match government records',
                    fields: [],
                  },
                ],
              },
            ],
            evaluations_error: null,
            parsed_status_message: 'Business name does not match government records',
          },
        }, null, 2),
      },
    },
  ],
};
