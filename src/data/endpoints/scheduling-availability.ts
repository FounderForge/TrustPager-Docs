import { type ResourceGroup, API_BASE_URL } from './types.js';

// =============================================================================
// SCHEDULING AVAILABILITY (2 endpoints)
// =============================================================================

export const SCHEDULING_AVAILABILITY: ResourceGroup = {
  id: 'scheduling-availability',
  label: 'Scheduling Availability',
  description: 'Manage company and per-user working hours, timezone, and date overrides for the booking system.',
  endpoints: [
    {
      method: 'GET',
      path: '/scheduling-availability',
      description: 'Get scheduling availability config. Returns weekly hours, timezone, and date overrides. Defaults to company-level availability.',
      scopes: ['company:read'],
      isWrite: false,
      params: [
        { name: 'user_id', type: 'string', required: false, description: '"me" for current user, or a user UUID. Omit for company default.', in: 'query' },
      ],
      requestExample: `curl -X GET \\
  "${API_BASE_URL}/scheduling-availability" \\
  -H "Authorization: Bearer YOUR_API_KEY"`,
      responseExample: `{
  "data": {
    "id": "a1b2c3d4-...",
    "company_id": "c1d2e3f4-...",
    "user_id": null,
    "weekly_hours": [
      { "day": 1, "start": "09:00", "end": "17:00" },
      { "day": 2, "start": "09:00", "end": "17:00" },
      { "day": 3, "start": "09:00", "end": "17:00" },
      { "day": 4, "start": "09:00", "end": "17:00" },
      { "day": 5, "start": "09:00", "end": "17:00" }
    ],
    "timezone": "Australia/Sydney",
    "date_overrides": [
      { "date": "2026-04-25", "type": "blocked", "reason": "ANZAC Day" }
    ]
  },
  "meta": { "credits_remaining": 9500 }
}`,
    },
    {
      method: 'PUT',
      path: '/scheduling-availability',
      description: 'Update or create scheduling availability. Upserts -- creates the record if it does not exist.',
      scopes: ['company:write'],
      isWrite: true,
      params: [
        { name: 'weekly_hours', type: 'array', required: false, description: 'Array of {day: 0-6, start: "HH:MM", end: "HH:MM"}. day 0=Sunday, 6=Saturday.', in: 'body' },
        { name: 'timezone', type: 'string', required: false, description: 'IANA timezone (e.g. "Australia/Sydney")', in: 'body' },
        { name: 'date_overrides', type: 'array', required: false, description: 'Array of {date: "YYYY-MM-DD", type: "blocked"|"custom", start?, end?, reason?}', in: 'body' },
        { name: 'user_id', type: 'string', required: false, description: 'Set user-specific availability instead of company default', in: 'body' },
      ],
      requestExample: `curl -X PUT \\
  "${API_BASE_URL}/scheduling-availability" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "weekly_hours": [
      {"day": 1, "start": "09:00", "end": "17:00"},
      {"day": 2, "start": "09:00", "end": "17:00"},
      {"day": 3, "start": "09:00", "end": "17:00"},
      {"day": 4, "start": "09:00", "end": "17:00"},
      {"day": 5, "start": "09:00", "end": "17:00"}
    ],
    "timezone": "Australia/Sydney",
    "date_overrides": [
      {"date": "2026-12-25", "type": "blocked", "reason": "Christmas"}
    ]
  }'`,
    },
  ],
};
