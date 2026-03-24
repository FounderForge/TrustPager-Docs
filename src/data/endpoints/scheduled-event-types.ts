import { type ResourceGroup, API_BASE_URL } from './types.js';

// =============================================================================
// SCHEDULED EVENT TYPES
// =============================================================================

export const SCHEDULED_EVENT_TYPES: ResourceGroup = {
  id: 'scheduled-event-types',
  label: 'Scheduled Event Types',
  description: 'Configurable event templates that appear in the Add Event dropdown on opportunities. Each type can optionally attach an event queue for auto-enrollment with reminders.',
  endpoints: [
    {
      method: 'GET',
      path: '/scheduled-event-types',
      description: 'List all scheduled event types for the company with cursor-based pagination.',
      scopes: ['company:read'],
      isWrite: false,
      params: [
        { name: 'limit', type: 'number', required: false, description: 'Max results per page (1-100, default 25)', in: 'query' },
        { name: 'after', type: 'string', required: false, description: 'Cursor for next page', in: 'query' },
      ],
      requestExample: `curl -X GET \\
  "${API_BASE_URL}/scheduled-event-types" \\
  -H "Authorization: Bearer YOUR_API_KEY"`,
      responseExample: `{
  "data": [
    {
      "id": "a1b2c3d4-...",
      "name": "Site Visit",
      "description": "On-site client meeting",
      "icon": "map-pin",
      "color": "emerald",
      "event_queue_id": "b2c3d4e5-...",
      "enrollment_offset_minutes": 1440,
      "is_meeting": false,
      "default_duration_minutes": null,
      "sort_order": 1,
      "is_active": true,
      "created_at": "2026-01-15T10:30:00Z",
      "updated_at": "2026-03-20T14:00:00Z"
    }
  ],
  "pagination": { "limit": 25, "has_more": false, "next_cursor": null },
  "meta": { "credits_remaining": 9500 }
}`,
    },
    {
      method: 'POST',
      path: '/scheduled-event-types',
      description: 'Create a new scheduled event type template. name is required.',
      scopes: ['company:write'],
      isWrite: true,
      params: [
        { name: 'name', type: 'string', required: true, description: 'Event type name. E.g. "Site Visit", "Follow-Up Call", "Demo"', in: 'body' },
        { name: 'description', type: 'string', required: false, description: 'Description shown in the dropdown', in: 'body' },
        { name: 'icon', type: 'string', required: false, description: 'Lucide icon name: calendar, video, phone, users, map-pin, coffee, briefcase, file-text, clock, calendar-clock', in: 'body' },
        { name: 'color', type: 'string', required: false, description: 'Color theme: primary, emerald, blue, amber, red, purple, pink, indigo', in: 'body' },
        { name: 'is_meeting', type: 'boolean', required: false, description: 'If true, uses Google Meet form (duration, invitees). If false, uses Standard Event form.', in: 'body' },
        { name: 'default_duration_minutes', type: 'number', required: false, description: 'Default meeting duration in minutes (only applies when is_meeting is true)', in: 'body' },
        { name: 'event_queue_id', type: 'uuid', required: false, description: 'Event queue UUID for auto-enrollment when this type is added to an opportunity', in: 'body' },
        { name: 'enrollment_offset_minutes', type: 'number', required: false, description: 'How far before the event to start the queue (0 = at event time, 1440 = 1 day before)', in: 'body' },
        { name: 'sort_order', type: 'number', required: false, description: 'Display order in the dropdown', in: 'body' },
        { name: 'is_active', type: 'boolean', required: false, description: 'Whether this type appears in the dropdown (default true)', in: 'body' },
      ],
      requestExample: `curl -X POST \\
  "${API_BASE_URL}/scheduled-event-types" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "Site Visit",
    "icon": "map-pin",
    "color": "emerald",
    "event_queue_id": "b2c3d4e5-...",
    "enrollment_offset_minutes": 1440
  }'`,
      responseExample: `{
  "data": {
    "id": "a1b2c3d4-...",
    "name": "Site Visit",
    "description": null,
    "icon": "map-pin",
    "color": "emerald",
    "event_queue_id": "b2c3d4e5-...",
    "enrollment_offset_minutes": 1440,
    "is_meeting": false,
    "default_duration_minutes": null,
    "sort_order": null,
    "is_active": true,
    "created_at": "2026-03-23T10:00:00Z",
    "updated_at": "2026-03-23T10:00:00Z"
  },
  "meta": { "credits_remaining": 9499 }
}`,
    },
    {
      method: 'GET',
      path: '/scheduled-event-types/:id',
      description: 'Retrieve a single scheduled event type by ID.',
      scopes: ['company:read'],
      isWrite: false,
      params: [
        { name: 'id', type: 'uuid', required: true, description: 'Scheduled event type ID', in: 'path' },
      ],
      requestExample: `curl -X GET \\
  "${API_BASE_URL}/scheduled-event-types/a1b2c3d4-..." \\
  -H "Authorization: Bearer YOUR_API_KEY"`,
      responseExample: `{
  "data": {
    "id": "a1b2c3d4-...",
    "name": "Site Visit",
    "description": null,
    "icon": "map-pin",
    "color": "emerald",
    "event_queue_id": "b2c3d4e5-...",
    "enrollment_offset_minutes": 1440,
    "is_meeting": false,
    "default_duration_minutes": null,
    "sort_order": 1,
    "is_active": true,
    "created_at": "2026-01-15T10:30:00Z",
    "updated_at": "2026-03-20T14:00:00Z"
  },
  "meta": { "credits_remaining": 9500 }
}`,
    },
    {
      method: 'PATCH',
      path: '/scheduled-event-types/:id',
      description: 'Update a scheduled event type. Only include fields you want to change.',
      scopes: ['company:write'],
      isWrite: true,
      params: [
        { name: 'id', type: 'uuid', required: true, description: 'Scheduled event type ID', in: 'path' },
        { name: 'name', type: 'string', required: false, description: 'Event type name', in: 'body' },
        { name: 'description', type: 'string', required: false, description: 'Description', in: 'body' },
        { name: 'icon', type: 'string', required: false, description: 'Lucide icon name', in: 'body' },
        { name: 'color', type: 'string', required: false, description: 'Color theme', in: 'body' },
        { name: 'is_meeting', type: 'boolean', required: false, description: 'Meeting type flag', in: 'body' },
        { name: 'default_duration_minutes', type: 'number', required: false, description: 'Default duration (meeting types only)', in: 'body' },
        { name: 'event_queue_id', type: 'uuid', required: false, description: 'Linked event queue UUID', in: 'body' },
        { name: 'enrollment_offset_minutes', type: 'number', required: false, description: 'Minutes before event to start queue', in: 'body' },
        { name: 'sort_order', type: 'number', required: false, description: 'Display order', in: 'body' },
        { name: 'is_active', type: 'boolean', required: false, description: 'Active/inactive state', in: 'body' },
        { name: 'is_bookable', type: 'boolean', required: false, description: 'Whether customers can book this type publicly', in: 'body' },
        { name: 'slug', type: 'string', required: false, description: 'URL-friendly slug for public booking page', in: 'body' },
        { name: 'buffer_before_minutes', type: 'number', required: false, description: 'Buffer time before booking (minutes)', in: 'body' },
        { name: 'buffer_after_minutes', type: 'number', required: false, description: 'Buffer time after booking (minutes)', in: 'body' },
        { name: 'min_notice_hours', type: 'number', required: false, description: 'Minimum notice required (hours)', in: 'body' },
        { name: 'max_advance_days', type: 'number', required: false, description: 'Max days in advance to book', in: 'body' },
        { name: 'slot_interval_minutes', type: 'number', required: false, description: 'Time slot interval (minutes)', in: 'body' },
        { name: 'booking_pipeline_id', type: 'uuid', required: false, description: 'Pipeline for auto-created deals', in: 'body' },
        { name: 'booking_stage_id', type: 'uuid', required: false, description: 'Stage for auto-created deals', in: 'body' },
        { name: 'booking_assigned_user_ids', type: 'array', required: false, description: 'Team member UUIDs to assign to deals and check calendar availability', in: 'body' },
        { name: 'booking_reminders', type: 'array', required: false, description: 'Pre-meeting reminders. Array of { offset_minutes, channels: ["email","sms"], recipients: "booker"|"booker_and_attendees"|"team"|"all", email_subject, email_body, sms_body, label }. Template vars: {booker_name}, {event_type}, {date}, {time}, {meet_link}, {duration}', in: 'body' },
      ],
      requestExample: `curl -X PATCH \\
  "${API_BASE_URL}/scheduled-event-types/a1b2c3d4-..." \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{ "name": "Client Site Visit", "color": "blue" }'`,
      responseExample: `{
  "data": {
    "id": "a1b2c3d4-...",
    "name": "Client Site Visit",
    "color": "blue",
    "is_active": true,
    "updated_at": "2026-03-23T11:00:00Z"
  },
  "meta": { "credits_remaining": 9498 }
}`,
    },
    {
      method: 'DELETE',
      path: '/scheduled-event-types/:id',
      description: 'Permanently delete a scheduled event type. Returns 204 No Content on success.',
      scopes: ['company:write'],
      isWrite: true,
      params: [
        { name: 'id', type: 'uuid', required: true, description: 'Scheduled event type ID', in: 'path' },
      ],
      requestExample: `curl -X DELETE \\
  "${API_BASE_URL}/scheduled-event-types/a1b2c3d4-..." \\
  -H "Authorization: Bearer YOUR_API_KEY"`,
    },
  ],
};

// =============================================================================
// EXPORT
// =============================================================================
