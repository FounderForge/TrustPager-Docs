import { Helmet } from 'react-helmet-async';

interface Token {
  token: string;
  description: string;
  badge?: string;
}

interface TokenGroup {
  namespace: string;
  description: string;
  tokens: Token[];
}

const CORE_GROUPS: TokenGroup[] = [
  {
    namespace: 'Special',
    description: 'Computed at runtime — always available in every automation action.',
    tokens: [
      { token: '{{today}}', description: 'Current date as YYYY-MM-DD, resolved in the company\'s configured timezone.' },
      { token: '{{now}}', description: 'Current datetime as an ISO 8601 string (UTC).' },
    ],
  },
  {
    namespace: 'company.*',
    description: 'Your company profile. Always populated — fetched fresh for every automation run.',
    tokens: [
      { token: '{{company.name}}', description: 'Company name.' },
      { token: '{{company.email}}', description: 'Company contact email.' },
      { token: '{{company.phone}}', description: 'Company phone number.' },
      { token: '{{company.abn}}', description: 'ABN or tax number.' },
      { token: '{{company.website}}', description: 'Website URL.' },
      { token: '{{company.industry}}', description: 'Industry.' },
      { token: '{{company.address_line1}}', description: 'Street address.' },
      { token: '{{company.city}}', description: 'City.' },
      { token: '{{company.state}}', description: 'State or province.' },
      { token: '{{company.postal_code}}', description: 'Postcode / ZIP.' },
      { token: '{{company.country}}', description: 'Country.' },
    ],
  },
  {
    namespace: 'contact.*',
    description: 'The contact linked to the deal or trigger. Resolves to empty string when no contact is matched.',
    tokens: [
      { token: '{{contact.first_name}}', description: 'First name.' },
      { token: '{{contact.last_name}}', description: 'Last name.' },
      { token: '{{contact.display_name}}', description: 'Full name computed from first + last.', badge: 'Virtual' },
      { token: '{{contact.full_name}}', description: 'Alias for display_name.', badge: 'Virtual' },
      { token: '{{contact.greeting}}', description: '"Hi {first_name}" when first name is set, otherwise "Hi there".', badge: 'Virtual' },
      { token: '{{contact.email}}', description: 'Primary email address.' },
      { token: '{{contact.phone}}', description: 'Primary phone number.' },
      { token: '{{contact.job_title}}', description: 'Job title.' },
      { token: '{{contact.timezone}}', description: 'Configured timezone (e.g. Australia/Sydney).' },
      { token: '{{contact.address_line1}}', description: 'Street address.' },
      { token: '{{contact.city}}', description: 'City.' },
      { token: '{{contact.state}}', description: 'State or province.' },
      { token: '{{contact.postal_code}}', description: 'Postcode / ZIP.' },
      { token: '{{contact.country}}', description: 'Country.' },
      { token: '{{contact.notes}}', description: 'Notes field on the contact record.' },
      { token: '{{contact.id}}', description: 'Internal UUID.' },
      { token: '{{contact.public_id}}', description: 'Human-readable public ID (e.g. CNT-00123).' },
    ],
  },
  {
    namespace: 'account.*',
    description: 'The account (business) linked to the deal. Also accessible as {{customer.*}}.',
    tokens: [
      { token: '{{account.name}}', description: 'Business name.' },
      { token: '{{account.email}}', description: 'Account email.' },
      { token: '{{account.phone}}', description: 'Account phone.' },
      { token: '{{account.website}}', description: 'Website URL.' },
      { token: '{{account.industry}}', description: 'Industry.' },
      { token: '{{account.timezone}}', description: 'Configured timezone.' },
      { token: '{{account.address_line1}}', description: 'Street address.' },
      { token: '{{account.city}}', description: 'City.' },
      { token: '{{account.state}}', description: 'State or province.' },
      { token: '{{account.postal_code}}', description: 'Postcode / ZIP.' },
      { token: '{{account.country}}', description: 'Country.' },
      { token: '{{account.id}}', description: 'Internal UUID.' },
      { token: '{{account.public_id}}', description: 'Human-readable public ID.' },
    ],
  },
  {
    namespace: 'deal.*',
    description: 'The deal that triggered the automation.',
    tokens: [
      { token: '{{deal.name}}', description: 'Deal name.' },
      { token: '{{deal.value}}', description: 'Deal value (numeric).' },
      { token: '{{deal.currency}}', description: 'Currency code (e.g. AUD).' },
      { token: '{{deal.status}}', description: 'Deal status: open, won, or lost.' },
      { token: '{{deal.probability}}', description: 'Win probability (0–100).' },
      { token: '{{deal.lead_source}}', description: 'Lead source label.' },
      { token: '{{deal.opportunity_type}}', description: 'Opportunity type (if configured).' },
      { token: '{{deal.expected_close_date}}', description: 'Expected close date. Formatted as a human-readable string; use _iso suffix for raw value.', badge: 'Date' },
      { token: '{{deal.notes}}', description: 'Notes field on the deal.' },
      { token: '{{deal.timezone}}', description: 'Deal\'s configured timezone.' },
      { token: '{{deal.owner_id}}', description: 'UUID of the primary assigned team member. Falls back to deal.assigned_to, then null.', badge: 'UUID' },
      { token: '{{deal.assigned_to}}', description: 'Legacy single-user assignment field. Prefer deal.owner_id.', badge: 'UUID' },
      { token: '{{deal.metadata.field_key}}', description: 'Any custom CRM field stored on the deal. Replace field_key with the actual field key.' },
      { token: '{{deal.id}}', description: 'Internal UUID.' },
      { token: '{{deal.public_id}}', description: 'Human-readable public ID (e.g. OPP-00456).' },
    ],
  },
  {
    namespace: 'user.*',
    description: 'The team member who triggered the automation, or the sender in email/document actions.',
    tokens: [
      { token: '{{user.first_name}}', description: 'First name.' },
      { token: '{{user.last_name}}', description: 'Last name.' },
      { token: '{{user.display_name}}', description: 'Full name computed from first + last.', badge: 'Virtual' },
      { token: '{{user.full_name}}', description: 'Alias for display_name.', badge: 'Virtual' },
      { token: '{{user.greeting}}', description: '"Hi {first_name}" or "Hi there".', badge: 'Virtual' },
      { token: '{{user.email}}', description: 'Email address.' },
      { token: '{{user.phone}}', description: 'Phone number.' },
      { token: '{{user.job_title}}', description: 'Job title.' },
      { token: '{{user.department}}', description: 'Department.' },
    ],
  },
  {
    namespace: 'products[N].*',
    description: 'Products attached to the deal. Available in stage_changed automations and document templates. N is the zero-based product index.',
    tokens: [
      { token: '{{products[0].name}}', description: 'Name of the first product.' },
      { token: '{{products[0].price}}', description: 'Unit price of the first product.' },
      { token: '{{products[0].quantity}}', description: 'Quantity of the first product.' },
      { token: '{{products[0].discount}}', description: 'Discount percentage on the first product.' },
      { token: '{{products[0].discounted_price}}', description: 'Price after discount.' },
      { token: '{{products[0].line_total}}', description: 'Line total (discounted price × quantity).' },
      { token: '{{products.count}}', description: 'Total number of products on the deal.' },
      { token: '{{products.total}}', description: 'Sum of all line totals.' },
    ],
  },
  {
    namespace: 'supplier.*',
    description: 'Populated when an action\'s recipient_target is account_supplier. Resolves the supplier linked to the deal\'s account.',
    tokens: [
      { token: '{{supplier.name}}', description: 'Supplier business name.' },
      { token: '{{supplier.email}}', description: 'Supplier email.' },
      { token: '{{supplier.phone}}', description: 'Supplier phone.' },
      { token: '{{supplier.abn}}', description: 'Supplier ABN / tax number.' },
      { token: '{{supplier.contact.first_name}}', description: 'Supplier\'s primary contact first name.' },
      { token: '{{supplier.contact.last_name}}', description: 'Supplier\'s primary contact last name.' },
      { token: '{{supplier.contact.email}}', description: 'Supplier\'s primary contact email.' },
      { token: '{{supplier.product.name}}', description: 'First supplier product name.' },
      { token: '{{supplier.product.price}}', description: 'First supplier product price.' },
    ],
  },
  {
    namespace: 'trigger.*',
    description: 'Raw trigger payload captured before CRM enrichment. Useful for webhook fields, form submission data, or anything not mapped to a CRM entity. Available keys depend on the trigger type — see the trigger-specific tables below.',
    tokens: [
      { token: '{{trigger.*}}', description: 'Any top-level field from the raw trigger payload.' },
    ],
  },
  {
    namespace: 'var.*',
    description: 'Custom variables defined in the CRM Integration config of an automation. Evaluated after CRM enrichment, so they can reference contact.*, deal.*, etc.',
    tokens: [
      { token: '{{var.my_variable}}', description: 'Value of the custom variable named my_variable.' },
    ],
  },
];

interface TriggerTokenGroup {
  trigger: string;
  description: string;
  tokens: Token[];
}

const TRIGGER_GROUPS: TriggerTokenGroup[] = [
  {
    trigger: 'sms_received',
    description: 'Fires when an inbound SMS arrives on a TrustPager phone number.',
    tokens: [
      { token: '{{trigger.from_number}}', description: 'The sender\'s phone number.' },
      { token: '{{trigger.to_number}}', description: 'Your TrustPager number that received the SMS.' },
      { token: '{{trigger.message_body}}', description: 'The SMS message text.' },
      { token: '{{trigger.message_id}}', description: 'Internal message UUID.' },
      { token: '{{trigger.conversation_id}}', description: 'Conversation thread UUID.' },
    ],
  },
  {
    trigger: 'email_received',
    description: 'Fires when an inbound email arrives on a connected Gmail inbox.',
    tokens: [
      { token: '{{trigger.from_email}}', description: 'Sender\'s email address.' },
      { token: '{{trigger.from_name}}', description: 'Sender\'s display name.' },
      { token: '{{trigger.to_email}}', description: 'The inbox address that received the email.' },
      { token: '{{trigger.subject}}', description: 'Email subject line.' },
      { token: '{{trigger.message_body}}', description: 'Plain-text email body.' },
      { token: '{{trigger.has_attachments}}', description: 'true if the email has attachments, false otherwise.' },
      { token: '{{trigger.thread_id}}', description: 'Gmail thread ID.' },
    ],
  },
  {
    trigger: 'call_analyzed',
    description: 'Fires when a voice agent call is fully analyzed by Retell AI.',
    tokens: [
      { token: '{{trigger.summary}}', description: 'AI-generated call summary.' },
      { token: '{{trigger.sentiment}}', description: 'Caller sentiment: positive, neutral, or negative.' },
      { token: '{{trigger.call_successful}}', description: 'Whether the call achieved its goal (true/false).' },
      { token: '{{trigger.in_voicemail}}', description: 'Whether the call reached voicemail (true/false).' },
      { token: '{{trigger.caller_phone}}', description: 'The caller\'s phone number.' },
      { token: '{{trigger.duration_seconds}}', description: 'Call duration in seconds.' },
      { token: '{{trigger.call_id}}', description: 'Retell call ID.' },
      { token: '{{trigger.collected_dynamic_variables.*}}', description: 'Any variable collected during the call by the voice agent.' },
    ],
  },
  {
    trigger: 'platform_integration (Xero)',
    description: 'Fires when a Xero invoice event occurs (created, updated, paid).',
    tokens: [
      { token: '{{xero.invoice_number}}', description: 'Xero invoice number.' },
      { token: '{{invoice_number}}', description: 'Alias — same as xero.invoice_number.' },
      { token: '{{sub_total}}', description: 'Invoice subtotal (before tax).' },
      { token: '{{total_tax}}', description: 'Total tax amount.' },
      { token: '{{total}}', description: 'Invoice total.' },
      { token: '{{amount_due}}', description: 'Amount still owed.' },
      { token: '{{amount_paid}}', description: 'Amount already paid.' },
      { token: '{{currency_code}}', description: 'Currency code (e.g. AUD).' },
      { token: '{{due_date}}', description: 'Invoice due date.', badge: 'Date' },
      { token: '{{fully_paid_on_date}}', description: 'Date the invoice was fully paid.', badge: 'Date' },
      { token: '{{status}}', description: 'Invoice status (DRAFT, AUTHORISED, PAID, etc.).' },
    ],
  },
];

function Badge({ label }: { label: string }) {
  const colours: Record<string, string> = {
    Virtual: 'bg-teal-50 text-teal-700 border-teal-200',
    UUID: 'bg-amber-50 text-amber-700 border-amber-200',
    Date: 'bg-blue-50 text-blue-700 border-blue-200',
  };
  return (
    <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full border ${colours[label] || 'bg-gray-50 text-gray-600 border-gray-200'}`}>
      {label}
    </span>
  );
}

function TokenTable({ tokens }: { tokens: Token[] }) {
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            <th className="text-left px-4 py-2.5 font-medium text-gray-600 w-64">Token</th>
            <th className="text-left px-4 py-2.5 font-medium text-gray-600">Description</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {tokens.map((t) => (
            <tr key={t.token} className="hover:bg-gray-50">
              <td className="px-4 py-3 align-top">
                <code className="text-xs font-mono text-teal-700 break-all">{t.token}</code>
                {t.badge && <div className="mt-1"><Badge label={t.badge} /></div>}
              </td>
              <td className="px-4 py-3 text-gray-600 align-top">{t.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TemplateVariables() {
  return (
    <>
      <Helmet>
        <title>Template Variables - TrustPager Developer Docs</title>
        <meta name="description" content="Complete reference for {{variable}} tokens available in automation actions — emails, tasks, SMS, webhooks, and documents." />
      </Helmet>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Template Variables</h1>
        <p className="text-gray-600 mb-4">
          Automation actions support <code className="text-sm bg-gray-100 px-1.5 py-0.5 rounded font-mono">{'{{variable}}'}</code> tokens in text fields — email bodies, task titles and assignments, SMS messages, webhook payloads, document content, and more. Tokens resolve at runtime from the deal, contact, and account linked to the trigger.
        </p>
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800 mb-10">
          <strong>Fallback behaviour:</strong> A token that cannot be resolved (missing field, no linked contact, etc.) renders as an <strong>empty string</strong> — it never outputs the literal <code className="bg-amber-100 px-1 rounded font-mono">{'{{token}}'}</code> text or the word "null". UUID fields (marked <strong>UUID</strong>) that resolve to empty string are treated as null — so <code className="bg-amber-100 px-1 rounded font-mono">assigned_to: {'{{deal.owner_id}}'}</code> leaves a task unassigned rather than failing.
        </div>

        {/* Core namespaces */}
        <div className="space-y-10">
          {CORE_GROUPS.map((group) => (
            <section key={group.namespace}>
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-gray-900 font-mono">{group.namespace}</h2>
                <p className="text-sm text-gray-500 mt-1">{group.description}</p>
              </div>
              <TokenTable tokens={group.tokens} />
            </section>
          ))}
        </div>

        {/* Date formatting */}
        <section className="mt-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Date formatting</h2>
          <p className="text-gray-600 mb-4">
            ISO datetime values are automatically formatted as human-readable strings in the company's configured timezone (e.g. <em>Wednesday, 30 April 2025 at 9:00 am AEST</em>). To get the raw ISO string, append <code className="text-sm bg-gray-100 px-1.5 py-0.5 rounded font-mono">_iso</code> to the token name:
          </p>
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-4 py-2.5 font-medium text-gray-600 w-64">Token</th>
                  <th className="text-left px-4 py-2.5 font-medium text-gray-600">Output</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="px-4 py-3"><code className="text-xs font-mono text-teal-700">{'{{deal.expected_close_date}}'}</code></td>
                  <td className="px-4 py-3 text-gray-600">Wednesday, 30 April 2025 at 9:00 am AEST</td>
                </tr>
                <tr>
                  <td className="px-4 py-3"><code className="text-xs font-mono text-teal-700">{'{{deal.expected_close_date_iso}}'}</code></td>
                  <td className="px-4 py-3 text-gray-600">2025-04-30T09:00:00.000Z</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Trigger-specific tokens */}
        <section className="mt-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Trigger-specific tokens</h2>
          <p className="text-gray-600 mb-8">
            These tokens are only available when the automation was triggered by the matching event type. They're all accessible under the <code className="text-sm bg-gray-100 px-1.5 py-0.5 rounded font-mono">trigger.*</code> namespace.
          </p>
          <div className="space-y-8">
            {TRIGGER_GROUPS.map((group) => (
              <section key={group.trigger}>
                <div className="mb-4">
                  <h3 className="text-base font-semibold text-gray-900 font-mono">{group.trigger}</h3>
                  <p className="text-sm text-gray-500 mt-1">{group.description}</p>
                </div>
                <TokenTable tokens={group.tokens} />
              </section>
            ))}
          </div>
        </section>

        {/* Where tokens work */}
        <section className="mt-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Where tokens are supported</h2>
          <ul className="space-y-2 text-sm text-gray-600 list-disc list-inside">
            <li>Email subject and body (<code className="bg-gray-100 px-1 rounded font-mono text-xs">send_custom_email</code>)</li>
            <li>SMS message text (<code className="bg-gray-100 px-1 rounded font-mono text-xs">send_sms</code>)</li>
            <li>Task title, description, and <code className="bg-gray-100 px-1 rounded font-mono text-xs">assigned_to</code> — accepts UUID tokens like <code className="bg-gray-100 px-1 rounded font-mono text-xs">{'{{deal.owner_id}}'}</code> (<code className="bg-gray-100 px-1 rounded font-mono text-xs">add_tasks</code>)</li>
            <li>Webhook body and header templates (<code className="bg-gray-100 px-1 rounded font-mono text-xs">call_webhook</code>)</li>
            <li>Document section content (<code className="bg-gray-100 px-1 rounded font-mono text-xs">send_document</code>)</li>
            <li>Next action name and description (<code className="bg-gray-100 px-1 rounded font-mono text-xs">update_next_action</code>)</li>
            <li>Custom variable templates in CRM Integration config</li>
          </ul>
        </section>
      </div>
    </>
  );
}

export default TemplateVariables;
