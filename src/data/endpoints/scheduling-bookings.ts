import { type ResourceGroup, API_BASE_URL } from './types.js';

// =============================================================================
// SCHEDULING BOOKINGS (8 endpoints)
// =============================================================================

export const SCHEDULING_BOOKINGS: ResourceGroup = {
  id: 'scheduling-bookings',
  label: 'Scheduling Bookings',
  description: 'Create, manage, and check availability for bookings. AI-agent-friendly: human-readable responses, self-correcting errors with alternatives, nearest-slot suggestions.',
  endpoints: [
    {
      method: 'GET',
      path: '/scheduling-bookings',
      description: 'List bookings with filters. Returns upcoming/past bookings sorted by start time.',
      scopes: ['company:read'],
      isWrite: false,
      params: [
        { name: 'status', type: 'string', required: false, description: 'Filter: confirmed, cancelled, attended, late, no_show', in: 'query' },
        { name: 'event_type_id', type: 'string', required: false, description: 'Filter by event type UUID', in: 'query' },
        { name: 'date_from', type: 'string', required: false, description: 'Filter: bookings on or after YYYY-MM-DD', in: 'query' },
        { name: 'date_to', type: 'string', required: false, description: 'Filter: bookings on or before YYYY-MM-DD', in: 'query' },
        { name: 'limit', type: 'number', required: false, description: 'Max results (default 25, max 100)', in: 'query' },
        { name: 'after', type: 'string', required: false, description: 'Cursor for next page', in: 'query' },
      ],
      requestExample: `curl -X GET \\
  "${API_BASE_URL}/scheduling-bookings?status=confirmed&date_from=2026-03-24" \\
  -H "Authorization: Bearer YOUR_API_KEY"`,
      responseExample: `{
  "data": [
    {
      "id": "a1b2c3d4-...",
      "event_type_id": "e1f2g3h4-...",
      "starts_at": "2026-03-25T09:00:00+11:00",
      "ends_at": "2026-03-25T09:15:00+11:00",
      "timezone": "Australia/Sydney",
      "booker_name": "Sarah Johnson",
      "booker_email": "sarah@example.com",
      "booker_phone": "+61412345678",
      "status": "confirmed",
      "deal_id": "d1e2f3g4-...",
      "contact_id": "c1d2e3f4-..."
    }
  ],
  "pagination": { "limit": 25, "has_more": false }
}`,
    },
    {
      method: 'GET',
      path: '/scheduling-bookings/:id',
      description: 'Get a single booking by ID with full details including linked event type name.',
      scopes: ['company:read'],
      isWrite: false,
      params: [
        { name: 'id', type: 'string', required: true, description: 'Booking UUID', in: 'path' },
      ],
    },
    {
      method: 'POST',
      path: '/scheduling-bookings',
      description: 'Create a booking. Auto-creates CRM deal + contact. Flat request body (no nested objects). On slot conflict, returns SLOT_UNAVAILABLE error with nearest alternatives. Accepts event type by ID, slug, or name.',
      scopes: ['company:write'],
      isWrite: true,
      params: [
        { name: 'event_type_id', type: 'string', required: false, description: 'Event type UUID. Or use event_type_slug or event_type_name.', in: 'body' },
        { name: 'event_type_slug', type: 'string', required: false, description: 'Event type slug (e.g. "30-minute-booking"). Alternative to ID.', in: 'body' },
        { name: 'event_type_name', type: 'string', required: false, description: 'Event type name (fuzzy matched). Alternative to ID.', in: 'body' },
        { name: 'date', type: 'string', required: true, description: 'Booking date YYYY-MM-DD', in: 'body' },
        { name: 'time', type: 'string', required: true, description: 'Booking time HH:MM (24h format)', in: 'body' },
        { name: 'timezone', type: 'string', required: false, description: 'Customer timezone. Default: Australia/Sydney. Auto-resolves "Sydney" etc.', in: 'body' },
        { name: 'fullName', type: 'string', required: true, description: 'Customer full name', in: 'body' },
        { name: 'email', type: 'string', required: true, description: 'Customer email', in: 'body' },
        { name: 'phone', type: 'string', required: false, description: 'Customer phone', in: 'body' },
        { name: 'message', type: 'string', required: false, description: 'Customer notes', in: 'body' },
        { name: 'company_name', type: 'string', required: false, description: 'Customer company (used for CRM account)', in: 'body' },
        { name: 'attendees', type: 'array', required: false, description: 'Additional attendees: [{ "email": "...", "name": "...", "phone": "..." }]. All receive Google Calendar invites.', in: 'body' },
      ],
      requestExample: `curl -X POST \\
  "${API_BASE_URL}/scheduling-bookings" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "event_type_slug": "30-minute-booking",
    "date": "2026-04-01",
    "time": "10:00",
    "timezone": "Australia/Sydney",
    "fullName": "John Smith",
    "email": "john@example.com",
    "phone": "+61412345678"
  }'`,
      responseExample: `{
  "data": {
    "success": true,
    "booking": {
      "id": "b1c2d3e4-...",
      "event_type_name": "30 Minute Booking",
      "date": "2026-04-01",
      "time": "10:00",
      "formatted": "Tuesday, 1 April 2026 at 10:00 AM",
      "duration_minutes": 30,
      "status": "confirmed",
      "google_meet_link": "https://meet.google.com/abc-defg-hij",
      "attendees": [{ "email": "colleague@example.com", "name": "Jane Doe" }]
    },
    "crm": {
      "deal_id": "d1e2f3g4-...",
      "contact_id": "c1d2e3f4-...",
      "customer_id": "u1v2w3x4-..."
    }
  }
}`,
    },
    {
      method: 'POST',
      path: '/scheduling-bookings/:id/cancel',
      description: 'Cancel a booking. Updates status, removes Google Calendar event (notifies all attendees), cancels pending reminders, clears linked deal next action.',
      scopes: ['company:write'],
      isWrite: true,
      params: [
        { name: 'id', type: 'string', required: true, description: 'Booking UUID', in: 'path' },
        { name: 'cancellation_reason', type: 'string', required: false, description: 'Reason for cancellation', in: 'body' },
      ],
    },
    {
      method: 'POST',
      path: '/scheduling-bookings/check-availability',
      description: 'Quick check if a specific date/time slot is available. Always returns nearest_before and nearest_after slots -- perfect for conversational booking flows.',
      scopes: ['company:read'],
      isWrite: false,
      params: [
        { name: 'event_type_id', type: 'string', required: false, description: 'Event type UUID (or slug/name)', in: 'body' },
        { name: 'event_type_slug', type: 'string', required: false, description: 'Event type slug', in: 'body' },
        { name: 'event_type_name', type: 'string', required: false, description: 'Event type name', in: 'body' },
        { name: 'date', type: 'string', required: true, description: 'Date to check YYYY-MM-DD', in: 'body' },
        { name: 'time', type: 'string', required: true, description: 'Time to check HH:MM (24h)', in: 'body' },
        { name: 'timezone', type: 'string', required: false, description: 'Timezone. Default: Australia/Sydney', in: 'body' },
      ],
      requestExample: `curl -X POST \\
  "${API_BASE_URL}/scheduling-bookings/check-availability" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "event_type_slug": "30-minute-booking",
    "date": "2026-04-03",
    "time": "10:00",
    "timezone": "Australia/Sydney"
  }'`,
      responseExample: `{
  "data": {
    "available": true,
    "slot": {
      "date": "2026-04-03",
      "time": "10:00",
      "formatted": "Thursday, 3 April 2026 at 10:00 AM",
      "duration_minutes": 30
    },
    "nearest_before": {
      "date": "2026-04-03",
      "time": "09:30",
      "formatted": "Thursday, 3 April at 9:30 AM"
    },
    "nearest_after": {
      "date": "2026-04-03",
      "time": "10:30",
      "formatted": "Thursday, 3 April at 10:30 AM"
    },
    "hint": "This slot is available. Use POST /scheduling-bookings to confirm."
  }
}`,
    },
    {
      method: 'POST',
      path: '/scheduling-bookings/available-slots',
      description: 'Get all available time slots for a date range. Returns slots grouped by date with human-readable formatting. Integrates with Google Calendar freebusy to block busy times.',
      scopes: ['company:read'],
      isWrite: false,
      params: [
        { name: 'event_type_id', type: 'string', required: false, description: 'Event type UUID (or slug/name)', in: 'body' },
        { name: 'event_type_slug', type: 'string', required: false, description: 'Event type slug', in: 'body' },
        { name: 'event_type_name', type: 'string', required: false, description: 'Event type name', in: 'body' },
        { name: 'date_from', type: 'string', required: false, description: 'Start date YYYY-MM-DD. Default: today.', in: 'body' },
        { name: 'date_to', type: 'string', required: false, description: 'End date YYYY-MM-DD. Default: 14 days from date_from. Max 30 days.', in: 'body' },
        { name: 'timezone', type: 'string', required: false, description: 'Timezone. Default: Australia/Sydney. Auto-resolves abbreviations.', in: 'body' },
      ],
      requestExample: `curl -X POST \\
  "${API_BASE_URL}/scheduling-bookings/available-slots" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "event_type_slug": "30-minute-booking",
    "date_from": "2026-04-01",
    "date_to": "2026-04-03"
  }'`,
      responseExample: `{
  "data": {
    "success": true,
    "event_type": { "id": "...", "name": "30 Minute Booking", "duration_minutes": 30 },
    "availability": {
      "timezone": "Australia/Sydney",
      "total_available_slots": 12,
      "next_available": { "date": "2026-04-01", "time": "09:00", "formatted": "..." },
      "dates": [
        {
          "date": "2026-04-01",
          "day_name": "Wednesday",
          "formatted": "Wednesday, 1 April 2026",
          "slots": [
            { "time": "09:00", "formatted": "9:00 AM" },
            { "time": "09:30", "formatted": "9:30 AM" }
          ]
        }
      ]
    }
  }
}`,
    },
    {
      method: 'POST',
      path: '/scheduling-bookings/:id/mark-attended',
      description: 'Mark a booking as attended. Sets status to "attended", clears linked deal next action, cancels pending reminders, and logs a CRM activity with full booking context.',
      scopes: ['company:write'],
      isWrite: true,
      params: [
        { name: 'id', type: 'string', required: true, description: 'Booking UUID', in: 'path' },
      ],
    },
    {
      method: 'POST',
      path: '/scheduling-bookings/:id/mark-late',
      description: 'Mark a booking as late. Sets status to "late", sends late notifications to the booker (if configured on the event type), and logs a CRM activity.',
      scopes: ['company:write'],
      isWrite: true,
      params: [
        { name: 'id', type: 'string', required: true, description: 'Booking UUID', in: 'path' },
      ],
    },
    {
      method: 'POST',
      path: '/scheduling-bookings/:id/mark-no-show',
      description: 'Mark a booking as no-show. Sets status to "no_show", sends no-show notifications, schedules rebooking reminders (if configured), and logs a CRM activity.',
      scopes: ['company:write'],
      isWrite: true,
      params: [
        { name: 'id', type: 'string', required: true, description: 'Booking UUID', in: 'path' },
      ],
    },
    {
      method: 'POST',
      path: '/scheduling-bookings/:id/notetaker',
      description: 'Attach the TrustPager Notetaker (Recall.ai bot) to an existing confirmed booking. The bot joins 60 seconds before the meeting start time, transcribes with speaker attribution, and writes the transcript to the linked CRM deal. Idempotent -- safe to call multiple times (returns already_scheduled: true if already registered). Requires: (1) TrustPager Notetaker enabled in company settings, (2) booking must have a google_meet_link, (3) booking must not be cancelled. Credits: 23 credits per recorded minute, billed after the meeting ends.',
      scopes: ['company:write'],
      isWrite: true,
      params: [
        { name: 'id', type: 'string', required: true, description: 'Booking UUID. Must have a google_meet_link and status must not be cancelled.', in: 'path' },
      ],
      requestExample: `curl -X POST \\
  "${API_BASE_URL}/scheduling-bookings/b1c2d3e4-.../notetaker" \\
  -H "Authorization: Bearer YOUR_API_KEY"`,
      responseExample: `{
  "data": {
    "success": true,
    "bot_id": "b50591e6-ce65-43b1-b6e6-64093067c0f0",
    "already_scheduled": false,
    "message": "TrustPager Notetaker scheduled. It will join the meeting 60 seconds before the start time."
  },
  "meta": {
    "credits_remaining": 53827,
    "url": "https://app.trustpager.com/tools/scheduling"
  }
}`,
    },
  ],
};
