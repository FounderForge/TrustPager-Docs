import { type ResourceGroup, API_BASE_URL } from './types.js';

// =============================================================================
// SCHEDULING BOOKINGS (10 endpoints)
// =============================================================================

export const SCHEDULING_BOOKINGS: ResourceGroup = {
  id: 'scheduling-bookings',
  label: 'Scheduling Bookings',
  description: 'Create, manage, and check availability for bookings. Bookings link to an opportunity via deal_id (field name preserved for backward compatibility) and surface in the Meetings card on the opportunity page. Scheduler bookings are separate from the opportunity\'s next_action_* fields, which are for ad-hoc reminders only. AI-agent-friendly: human-readable responses, self-correcting errors with alternatives, nearest-slot suggestions. Includes voice-optimised endpoints (text/plain responses) designed for Retell AI voice agents.',
  endpoints: [
    {
      method: 'GET',
      path: '/scheduling-bookings',
      description: 'List bookings with filters. Returns upcoming/past bookings sorted by start time. Includes management_token and management_token_expires_at for each booking (null on bookings created before self-service management was introduced).',
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
      "contact_id": "c1d2e3f4-...",
      "management_token": "f7a3c891-4d52-4b1e-9e80-abc123def456",
      "management_token_expires_at": "2026-03-26T09:15:00+11:00"
    }
  ],
  "pagination": { "limit": 25, "has_more": false }
}`,
    },
    {
      method: 'GET',
      path: '/scheduling-bookings/:id',
      description: 'Get a single booking by ID with full details including linked event type name. Returns management_token (UUID used to construct the self-service management URL: https://app.trustpager.com/book/{company_slug}/manage/{management_token}) and management_token_expires_at (set to 24 hours after the booking end time; null on old bookings). The management token is NOT returned in create responses -- it is delivered to the booker only via the Google Calendar invite description and booking reminder emails using the {management_url} template variable.',
      scopes: ['company:read'],
      isWrite: false,
      params: [
        { name: 'id', type: 'string', required: true, description: 'Booking UUID', in: 'path' },
      ],
      responseExample: `{
  "data": {
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
    "contact_id": "c1d2e3f4-...",
    "management_token": "f7a3c891-4d52-4b1e-9e80-abc123def456",
    "management_token_expires_at": "2026-03-26T09:15:00+11:00",
    "crm_scheduled_event_types": {
      "name": "30 Minute Booking",
      "default_duration_minutes": 30
    }
  }
}`,
    },
    {
      method: 'POST',
      path: '/scheduling-bookings',
      description: 'Create a booking. Auto-creates CRM opportunity + contact (response field names like deal_id are preserved for backward compatibility). Flat request body (no nested objects). Email format is validated before slot logic runs -- malformed addresses (missing TLD, no domain) return INVALID_EMAIL; invalid attendee emails return INVALID_ATTENDEE_EMAIL. On slot conflict, returns SLOT_UNAVAILABLE error with nearest alternatives. Accepts event type by ID, slug, or name.',
      scopes: ['company:write'],
      isWrite: true,
      params: [
        { name: 'event_type_id', type: 'string', required: false, description: 'Event type UUID. Or use event_type_slug or event_type_name.', in: 'body' },
        { name: 'event_type_slug', type: 'string', required: false, description: 'Event type slug (e.g. "30-minute-booking"). Alternative to ID.', in: 'body' },
        { name: 'event_type_name', type: 'string', required: false, description: 'Event type name (fuzzy matched). Alternative to ID.', in: 'body' },
        { name: 'date', type: 'string', required: true, description: 'Booking date YYYY-MM-DD', in: 'body' },
        { name: 'time', type: 'string', required: true, description: 'Booking time HH:MM (24h format)', in: 'body' },
        { name: 'timezone', type: 'string', required: false, description: 'Customer (booker) timezone. Authoritative for converting date+time to UTC. Default: Australia/Sydney. Accepts IANA names (e.g. "Australia/Perth") or shorthands (e.g. "Perth", "AWST", "WA").', in: 'body' },
        { name: 'fullName', type: 'string', required: true, description: 'Customer full name', in: 'body' },
        { name: 'email', type: 'string', required: true, description: 'Customer email. Must be a valid format with a complete TLD (e.g. "name@example.com"). Truncated addresses like "doug@resolvency." are rejected with INVALID_EMAIL before slot validation runs.', in: 'body' },
        { name: 'phone', type: 'string', required: false, description: 'Customer phone', in: 'body' },
        { name: 'message', type: 'string', required: false, description: 'Customer notes', in: 'body' },
        { name: 'company_name', type: 'string', required: false, description: 'Customer company (used for CRM account)', in: 'body' },
        { name: 'booker_state', type: 'string', required: false, description: 'Customer state/region (e.g. "WA", "NSW"). Written to CRM contact state field if currently empty.', in: 'body' },
        { name: 'booker_timezone', type: 'string', required: false, description: 'Explicit CRM timezone to store on the contact (e.g. "Australia/Perth"). Falls back to timezone if omitted. Written to CRM contact timezone field if currently empty.', in: 'body' },
        { name: 'attendees', type: 'array', required: false, description: 'Additional attendees: [{ "email": "...", "name": "...", "phone": "..." }]. All receive calendar invites. Each attendee email must also be a valid format; invalid entries return INVALID_ATTENDEE_EMAIL.', in: 'body' },
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
      description: 'Cancel a booking. Updates status, removes Google Calendar event (notifies all attendees), and cancels pending reminders. Does not affect the opportunity\'s next_action fields (bookings and next_action are independent).',
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
      description: 'Mark a booking as attended. Sets status to "attended", clears the linked opportunity\'s next action, cancels pending reminders, and logs a CRM activity with full booking context.',
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
      description: 'Attach the TrustPager Notetaker to an existing confirmed booking. The bot joins 60 seconds before the meeting start time, transcribes with speaker attribution, and writes the transcript to the linked CRM opportunity. Idempotent -- safe to call multiple times (returns already_scheduled: true if already registered). Requires: (1) TrustPager Notetaker enabled in company settings, (2) booking must have a google_meet_link, (3) booking must not be cancelled. Credits: 23 credits per recorded minute, billed after the meeting ends.',
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
    {
      method: 'POST',
      path: '/scheduling/voice/:event_type_id/slots',
      description: 'Voice-agent slot picker. Returns text/plain — a human-readable listing of available slots with a header block showing event type name, duration, host names, and description. Designed to be consumed verbatim by a Retell AI voice agent as a custom tool response. The AI never sees raw JSON or date ranges — just readable text it can speak directly. Slots are tagged with exact booking keys (slot:"YYYY-MM-DD HH:MM") for use in the /book endpoint.',
      scopes: ['scheduling:read'],
      isWrite: false,
      params: [
        { name: 'event_type_id', type: 'uuid', required: true, description: 'Event type UUID in the URL path', in: 'path' },
        { name: 'preferred_day', type: 'string', required: false, description: 'Natural-language day preference: "monday", "tomorrow", "asap", "this week", or YYYY-MM-DD. Past dates auto-advance to next occurrence of that weekday. Default: "asap".', in: 'body' },
        { name: 'preferred_time', type: 'string', required: false, description: 'Time preference: "morning", "afternoon", "evening", "around 2pm", "14:00", or omit for any time.', in: 'body' },
        { name: 'state', type: 'string', required: false, description: 'Customer state/territory (e.g. "NSW", "VIC", "QLD"). Used to auto-resolve timezone. Also accepted from Retell call dynamic variables.', in: 'body' },
        { name: 'timezone', type: 'string', required: false, description: 'IANA timezone override (e.g. "Australia/Perth"). Fallback if state is not provided. Default: Australia/Sydney.', in: 'body' },
      ],
      requestExample: `curl -X POST \\
  "${API_BASE_URL}/scheduling/voice/{event_type_id}/slots" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{ "preferred_day": "monday", "preferred_time": "morning", "state": "NSW" }'`,
      responseExample: `Offering: Free Consultation (30 min)
Host: Jane Smith
Description: A complimentary session to discuss your needs.

Monday 04/27: 9:00 AM [slot:2026-04-27 09:00], 9:30 AM [slot:2026-04-27 09:30], 10:00 AM [slot:2026-04-27 10:00]
Monday 05/04: 9:00 AM [slot:2026-05-04 09:00], 9:30 AM [slot:2026-05-04 09:30]

To book, pass the exact slot value (e.g. slot:"2026-04-28 09:00") with the caller's name and email.`,
    },
    {
      method: 'POST',
      path: '/scheduling/voice/:event_type_id/book',
      description: 'Voice-agent booking confirmation. Returns text/plain — a plain English sentence the AI reads to the caller to confirm the appointment. On success, includes event type name, duration, formatted start/end time, host names, description, Google Meet link, and booking ID. On failure, always returns HTTP 200 with a bolded warning the AI must not ignore — prevents the AI from falsely confirming a booking that failed. Supports Retell custom tool format: {"call":{...},"name":"tool_name","args":{...}}.',
      scopes: ['scheduling:write'],
      isWrite: true,
      params: [
        { name: 'event_type_id', type: 'uuid', required: true, description: 'Event type UUID in the URL path', in: 'path' },
        { name: 'slot', type: 'string', required: true, description: 'Exact slot value from the /slots response, e.g. "2026-04-28 10:45". Unsubstituted Retell template variables ({{...}}) are detected and rejected with a fix message.', in: 'body' },
        { name: 'name', type: 'string', required: true, description: 'Caller full name. Unsubstituted template variables rejected.', in: 'body' },
        { name: 'email', type: 'string', required: true, description: 'Caller email for confirmation. Unsubstituted template variables rejected.', in: 'body' },
        { name: 'phone', type: 'string', required: false, description: 'Caller phone number (mobile, E.164 format)', in: 'body' },
        { name: 'notes', type: 'string', required: false, description: 'Any notes the caller provided', in: 'body' },
        { name: 'state', type: 'string', required: false, description: 'Customer state for timezone resolution (e.g. "VIC")', in: 'body' },
        { name: 'timezone', type: 'string', required: false, description: 'IANA timezone override. Default: Australia/Sydney.', in: 'body' },
      ],
      requestExample: `curl -X POST \\
  "${API_BASE_URL}/scheduling/voice/{event_type_id}/book" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "slot": "2026-04-28 10:00",
    "name": "Sarah Jones",
    "email": "sarah@example.com",
    "phone": "+61412345678",
    "state": "NSW"
  }'`,
      responseExample: `Booked! Sarah Jones's Free Consultation (30 min) is confirmed for Monday, 28 April 2026 at 10:00 AM, ending at 10:30 AM. A confirmation has been sent to sarah@example.com.
Host: Jane Smith
Description: A complimentary session to discuss your needs.
Video link: https://meet.google.com/abc-defg-hij
Booking ID: b1c2d3e4-f5a6-...`,
    },
    {
      method: 'POST',
      path: '/scheduling/voice/cancel-booking',
      description: 'Voice-agent booking cancellation. Returns text/plain. Resolves the caller by phone number (from args.phone, or Retell call envelope from_number/to_number as fallback), then cancels the matching upcoming booking. When the caller has multiple upcoming bookings, omit booking_selector on the first call to receive a numbered disambiguation list; re-fire with the caller\'s choice to execute the cancellation. Always returns HTTP 200 - failures begin with "BOOKING CANCELLATION FAILED:" and must not be read as confirmations.',
      scopes: ['scheduling:write'],
      isWrite: true,
      params: [
        { name: 'phone', type: 'string', required: false, description: 'Caller phone number (E.164 or AU local format). Falls back to Retell call envelope from_number (inbound) or to_number (outbound).', in: 'body' },
        { name: 'booking_selector', type: 'string', required: false, description: 'Which booking to cancel when the caller has multiple upcoming. Accepts: 1-based integer index (from disambiguation list), booking UUID prefix, or partial event type name substring. Omit to auto-select when only one booking exists, or to trigger the disambiguation list when multiple exist.', in: 'body' },
        { name: 'reason', type: 'string', required: false, description: 'Cancellation reason stored on the booking record.', in: 'body' },
      ],
      requestExample: `curl -X POST \\
  "${API_BASE_URL}/scheduling/voice/cancel-booking" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{ "args": { "phone": "+61412345678", "booking_selector": "1", "reason": "caller request" } }'`,
      responseExample: `Cancelled! Your Free Consultation (30 min) on Monday, 28 April 2026 at 10:00 AM has been cancelled.`,
    },
    {
      method: 'POST',
      path: '/scheduling/voice/reschedule-booking',
      description: 'Voice-agent booking reschedule. Returns text/plain. Resolves the caller by phone, then moves an existing booking to a new slot. New booking is created first (slot-race protection), then the old booking is cancelled. If the old cancel fails, a rollback is attempted on the new booking. Uses the same two-shot disambiguation pattern as cancel-booking when multiple upcoming bookings exist. Always returns HTTP 200 - failures begin with "RESCHEDULE FAILED:".',
      scopes: ['scheduling:write'],
      isWrite: true,
      params: [
        { name: 'phone', type: 'string', required: false, description: 'Caller phone number (E.164 or AU local). Falls back to Retell call envelope.', in: 'body' },
        { name: 'booking_selector', type: 'string', required: false, description: 'Which booking to reschedule. Same format as cancel-booking selector. Omit for auto-select or to trigger disambiguation.', in: 'body' },
        { name: 'new_slot', type: 'string', required: true, description: 'New slot in "YYYY-MM-DD HH:MM" format, as returned by the /slots endpoint for this event type.', in: 'body' },
        { name: 'timezone', type: 'string', required: false, description: 'IANA timezone name. Defaults to the event type configured timezone.', in: 'body' },
      ],
      requestExample: `curl -X POST \\
  "${API_BASE_URL}/scheduling/voice/reschedule-booking" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{ "args": { "phone": "+61412345678", "new_slot": "2026-04-30 14:00", "timezone": "Australia/Brisbane" } }'`,
      responseExample: `Rescheduled! Your Free Consultation is now confirmed for Wednesday, 30 April 2026 at 2:00 PM.
The previous booking has been cancelled.`,
    },
  ],
};
