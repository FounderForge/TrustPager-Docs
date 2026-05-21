import { type ResourceGroup, API_BASE_URL } from './types.js';

// =============================================================================
// SCHEMAS (2 endpoints)
// Discovery endpoints for automation trigger types.
// Free -- 0 credits, no scope required beyond a valid API key.
// =============================================================================

export const SCHEMAS: ResourceGroup = {
  id: 'schemas',
  label: 'Schemas',
  description: 'Discoverable reference data for automation trigger types. Returns the shape of trigger_data each trigger publishes, the {{variable}} tokens available in action templates, and CRM-enriched variable namespaces. Free -- 0 credits, no scope required.',
  endpoints: [
    {
      method: 'GET',
      path: '/schemas/triggers',
      description: 'List all 43 trigger types supported by the automation engine. Each entry includes trigger_type, label, description, sample_trigger_data, and available_variables[]. The response also includes enriched_variables -- the CRM-enriched namespaces (contact.*, deal.*, customer.*, etc.) available on every trigger after CRM matching. Use this before building automations so you know which variable tokens to reference in action templates.',
      scopes: [],
      isWrite: false,
      params: [],
      requestExample: `curl -X GET \\
  "${API_BASE_URL}/schemas/triggers" \\
  -H "Authorization: Bearer YOUR_API_KEY"`,
      responseExample: `{
  "data": {
    "count": 43,
    "enriched_variables": {
      "contact.*": "Contact record fields (first_name, last_name, email, phone, custom fields) - populated after opportunity matching.",
      "deal.*": "Deal/opportunity fields (name, value, status, opportunity_type, tags).",
      "customer.*": "Customer/account record fields (name, abn, industry). Also available as account.*.",
      "today": "Today as YYYY-MM-DD in the company timezone.",
      "now": "Current timestamp as ISO 8601."
    },
    "triggers": [
      {
        "trigger_type": "referral_attributed",
        "label": "Referral Attributed",
        "description": "When an inbound referral is recorded -- fires for every code path (attribute_referral action, public form, manual). Use to thank referrers, alert team, or increment per-referrer counters.",
        "sample_trigger_data": {
          "referral_id": "uuid",
          "referrer_contact_id": "uuid",
          "referrer_email": "dr.smith@clinic.com.au",
          "referred_contact_id": "uuid",
          "referred_deal_id": "uuid",
          "category": "CT",
          "status": "pending",
          "source": "api",
          "notes": null
        },
        "available_variables": [
          "{{referral_id}}",
          "{{referrer_contact_id}}",
          "{{referrer_email}}",
          "{{referred_contact_id}}",
          "{{referred_deal_id}}",
          "{{category}}",
          "{{status}}",
          "{{source}}",
          "{{notes}}"
        ]
      },
      {
        "trigger_type": "facebook_lead_ad",
        "label": "Facebook Lead Ad",
        "description": "When a Facebook Lead Ad form is submitted.",
        "sample_trigger_data": {
          "page_id": "123456789",
          "form_id": "form_abc123",
          "first_name": "John",
          "last_name": "Doe",
          "email": "john@example.com",
          "phone": "+61431377068"
        },
        "available_variables": [
          "{{page_id}}",
          "{{form_id}}",
          "{{first_name}}",
          "{{last_name}}",
          "{{email}}",
          "{{phone}}"
        ]
      }
    ]
  },
  "meta": { "credits_remaining": 10000 }
}`,
    },
    {
      method: 'GET',
      path: '/schemas/triggers/:trigger_type',
      description: 'Get the canonical schema for a single trigger type. Returns label, description, sample_trigger_data (a realistic example payload), available_variables[] (all {{token}} names extracted from the sample), and enriched_variables (CRM namespace reference). Returns 404 if the trigger_type is not recognised.',
      scopes: [],
      isWrite: false,
      params: [
        {
          name: 'trigger_type',
          type: 'string',
          required: true,
          description: 'Trigger type key (e.g. facebook_lead_ad, form_submitted, deal_updated, booking_created). Use GET /schemas/triggers to discover all values.',
          in: 'path',
        },
      ],
      requestExample: `curl -X GET \\
  "${API_BASE_URL}/schemas/triggers/facebook_lead_ad" \\
  -H "Authorization: Bearer YOUR_API_KEY"`,
      responseExample: `{
  "data": {
    "trigger_type": "facebook_lead_ad",
    "label": "Facebook Lead Ad",
    "description": "When a Facebook Lead Ad form is submitted.",
    "sample_trigger_data": {
      "page_id": "123456789",
      "form_id": "form_abc123",
      "leadgen_id": "lead_xyz789",
      "first_name": "John",
      "last_name": "Doe",
      "email": "john@example.com",
      "phone": "+61431377068",
      "company_name": "Acme Corporation"
    },
    "available_variables": [
      "{{page_id}}",
      "{{form_id}}",
      "{{leadgen_id}}",
      "{{first_name}}",
      "{{last_name}}",
      "{{email}}",
      "{{phone}}",
      "{{company_name}}"
    ],
    "enriched_variables": {
      "contact.*": "Contact record fields (first_name, last_name, email, phone, custom fields) - populated after opportunity matching.",
      "deal.*": "Deal/opportunity fields (name, value, status, opportunity_type, tags).",
      "customer.*": "Customer/account record fields (name, abn, industry). Also available as account.*.",
      "today": "Today as YYYY-MM-DD in the company timezone.",
      "now": "Current timestamp as ISO 8601."
    }
  },
  "meta": { "credits_remaining": 10000 }
}`,
    },
  ],
};
