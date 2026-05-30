import { type ResourceGroup, API_BASE_URL } from './types.js';

// =============================================================================
// CRM EXPORT (1 endpoint)
// =============================================================================

export const CRM_EXPORT: ResourceGroup = {
  id: 'crm-export',
  label: 'CRM Export',
  description: 'Bulk-export CRM data as XLSX or CSV. Supports all four entity types (contacts, customers, deals, work-orders) with entity-specific filters. Custom fields auto-expand into dedicated columns. Maximum 50,000 rows per request.',
  endpoints: [
    {
      method: 'GET',
      path: '/crm/export',
      toolName: 'export_crm_data',
      description: 'Export CRM data as a downloadable file. Returns the file as an attachment (XLSX or CSV). Custom fields from company_settings are appended as dynamic columns. Work-order dynamic fields come from crm_work_order_fields. Response headers include X-Row-Count (actual rows returned) and X-Truncated (1 if the 50,000-row cap was hit).',
      scopes: ['contacts:read', 'companies:read', 'opportunities:read', 'work-orders:read'],
      isWrite: false,
      params: [
        {
          name: 'type',
          type: 'string',
          required: true,
          description: 'Entity type to export. One of: contacts, customers, deals, work-orders. The caller must hold the matching read scope for the chosen type.',
          in: 'query',
        },
        {
          name: 'format',
          type: 'string',
          required: false,
          description: 'File format. One of: xlsx (default), csv.',
          in: 'query',
        },
        // -- Common filters --
        {
          name: 'search',
          type: 'string',
          required: false,
          description: 'Text search. Contacts: first_name, last_name, email, phone, landline. Customers: name, email, phone, landline. Deals: name only. Not available for work-orders.',
          in: 'query',
        },
        {
          name: 'created_after',
          type: 'string',
          required: false,
          description: 'ISO 8601 datetime. Return records created on or after this timestamp.',
          in: 'query',
        },
        {
          name: 'created_before',
          type: 'string',
          required: false,
          description: 'ISO 8601 datetime. Return records created on or before this timestamp.',
          in: 'query',
        },
        // -- Contact-specific --
        {
          name: 'source',
          type: 'string',
          required: false,
          description: '(contacts only) Filter by lead source string.',
          in: 'query',
        },
        {
          name: 'customer_id',
          type: 'uuid',
          required: false,
          description: '(contacts, deals) Filter contacts linked to this customer, or deals belonging to this customer.',
          in: 'query',
        },
        {
          name: 'email_unsubscribed',
          type: 'string',
          required: false,
          description: '(contacts only) true = opted-out contacts only, false = opted-in contacts only.',
          in: 'query',
        },
        {
          name: 'sms_unsubscribed',
          type: 'string',
          required: false,
          description: '(contacts only) true = opted-out contacts only, false = opted-in contacts only.',
          in: 'query',
        },
        // -- Customer-specific --
        {
          name: 'is_customer',
          type: 'string',
          required: false,
          description: '(customers only) true = is a customer, false = is not.',
          in: 'query',
        },
        {
          name: 'is_supplier',
          type: 'string',
          required: false,
          description: '(customers only) true = is a supplier, false = is not.',
          in: 'query',
        },
        {
          name: 'industry',
          type: 'string',
          required: false,
          description: '(customers only) Exact industry match.',
          in: 'query',
        },
        // -- Deal-specific --
        {
          name: 'status',
          type: 'string',
          required: false,
          description: '(deals only) Filter by deal status. Valid values: open, won, lost.',
          in: 'query',
        },
        {
          name: 'pipeline_id',
          type: 'uuid',
          required: false,
          description: '(deals only) Filter deals that are placed in this pipeline.',
          in: 'query',
        },
        {
          name: 'stage_id',
          type: 'uuid',
          required: false,
          description: '(deals only) Filter deals that are placed in this specific stage.',
          in: 'query',
        },
        {
          name: 'contact_id',
          type: 'uuid',
          required: false,
          description: '(deals only) Filter deals linked to this contact.',
          in: 'query',
        },
        {
          name: 'assigned_to',
          type: 'uuid',
          required: false,
          description: '(deals, work-orders) Filter by assigned user UUID.',
          in: 'query',
        },
        // -- Work-order-specific --
        {
          name: 'status_id',
          type: 'uuid',
          required: false,
          description: '(work-orders only) Filter by work order status UUID.',
          in: 'query',
        },
        {
          name: 'deal_product_id',
          type: 'uuid',
          required: false,
          description: '(work-orders only) Filter by deal product UUID.',
          in: 'query',
        },
        {
          name: 'schedule_date',
          type: 'string',
          required: false,
          description: '(work-orders only) Exact date match (YYYY-MM-DD).',
          in: 'query',
        },
      ],
      example: {
        request: `curl -H "Authorization: Bearer tp_live_..." \\
  "${API_BASE_URL}/crm/export?type=contacts&format=xlsx" \\
  --output contacts.xlsx`,
        response: `# Binary XLSX file download.
# Response headers:
# Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
# Content-Disposition: attachment; filename="contacts-2026-04-27T10-30-00.xlsx"
# X-Row-Count: 294
# X-Truncated: 0`,
      },
    },
  ],
};
