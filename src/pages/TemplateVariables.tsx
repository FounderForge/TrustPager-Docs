import { Helmet } from 'react-helmet-async';

interface Token {
  token: string;
  description: string;
  notes?: string;
}

interface TokenGroup {
  namespace: string;
  description: string;
  tokens: Token[];
}

const TOKEN_GROUPS: TokenGroup[] = [
  {
    namespace: 'Special',
    description: 'Computed at runtime — always available in every automation action.',
    tokens: [
      { token: '{{today}}', description: 'Current date in YYYY-MM-DD format, resolved in the company\'s configured timezone.' },
      { token: '{{now}}', description: 'Current datetime as an ISO 8601 string (UTC).' },
    ],
  },
  {
    namespace: 'contact.*',
    description: 'The contact linked to the deal or trigger. Resolves to empty string when no contact is matched.',
    tokens: [
      { token: '{{contact.first_name}}', description: 'First name.' },
      { token: '{{contact.last_name}}', description: 'Last name.' },
      { token: '{{contact.display_name}}', description: 'Full name computed from first + last. Virtual — does not require a database column.', notes: 'Virtual' },
      { token: '{{contact.full_name}}', description: 'Alias for display_name.', notes: 'Virtual' },
      { token: '{{contact.greeting}}', description: '"Hi {first_name}" when first name is set, otherwise "Hi there".', notes: 'Virtual' },
      { token: '{{contact.email}}', description: 'Primary email address.' },
      { token: '{{contact.phone}}', description: 'Primary phone number.' },
      { token: '{{contact.job_title}}', description: 'Job title.' },
      { token: '{{contact.timezone}}', description: 'Contact\'s configured timezone (e.g. Australia/Sydney).' },
      { token: '{{contact.address_line1}}', description: 'Street address.' },
      { token: '{{contact.city}}', description: 'City.' },
      { token: '{{contact.state}}', description: 'State or province.' },
      { token: '{{contact.postal_code}}', description: 'Postcode / ZIP.' },
      { token: '{{contact.country}}', description: 'Country.' },
      { token: '{{contact.notes}}', description: 'Notes field on the contact record.' },
      { token: '{{contact.id}}', description: 'Internal UUID of the contact.' },
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
      { token: '{{account.timezone}}', description: 'Account\'s configured timezone.' },
      { token: '{{account.id}}', description: 'Internal UUID of the account.' },
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
      { token: '{{deal.lead_source}}', description: 'Lead source label.' },
      { token: '{{deal.notes}}', description: 'Notes field on the deal.' },
      { token: '{{deal.timezone}}', description: 'Deal\'s configured timezone.' },
      { token: '{{deal.owner_id}}', description: 'UUID of the primary assigned team member. Falls back to deal.assigned_to if no primary user is set, then null.', notes: 'UUID' },
      { token: '{{deal.assigned_to}}', description: 'Legacy single-user assignment field. Prefer deal.owner_id for the "deal owner" concept.', notes: 'UUID' },
      { token: '{{deal.id}}', description: 'Internal UUID of the deal.' },
      { token: '{{deal.public_id}}', description: 'Human-readable public ID (e.g. OPP-00456).' },
    ],
  },
  {
    namespace: 'user.*',
    description: 'The authenticated user who triggered the automation (e.g. the team member who moved the deal stage).',
    tokens: [
      { token: '{{user.first_name}}', description: 'First name.' },
      { token: '{{user.last_name}}', description: 'Last name.' },
      { token: '{{user.display_name}}', description: 'Full name computed from first + last.', notes: 'Virtual' },
      { token: '{{user.full_name}}', description: 'Alias for display_name.', notes: 'Virtual' },
      { token: '{{user.greeting}}', description: '"Hi {first_name}" when first name is set, otherwise "Hi there".', notes: 'Virtual' },
    ],
  },
  {
    namespace: 'trigger.*',
    description: 'Raw trigger payload captured before CRM enrichment. Useful for accessing webhook fields or form submission data that isn\'t mapped to a CRM entity.',
    tokens: [
      { token: '{{trigger.email}}', description: 'Email from the raw trigger payload.' },
      { token: '{{trigger.phone}}', description: 'Phone from the raw trigger payload.' },
      { token: '{{trigger.name}}', description: 'Name from the raw trigger payload.' },
      { token: '{{trigger.*}}', description: 'Any field from the raw trigger payload by its key.' },
    ],
  },
  {
    namespace: 'var.*',
    description: 'Custom variables defined in the CRM Integration config of an automation. Evaluated after CRM enrichment so they can reference contact.*, deal.*, etc.',
    tokens: [
      { token: '{{var.my_variable}}', description: 'Value of the custom variable named my_variable.' },
    ],
  },
  {
    namespace: 'xero.*',
    description: 'Populated when a Xero integration is active and an invoice is linked to the deal.',
    tokens: [
      { token: '{{xero.invoice_number}}', description: 'Xero invoice number linked to the deal.' },
    ],
  },
];

function TokenBadge({ label }: { label: string }) {
  return (
    <span className="inline-block text-xs font-medium px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200">
      {label}
    </span>
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
          Automation actions support <code className="text-sm bg-gray-100 px-1.5 py-0.5 rounded font-mono">{'{{variable}}'}</code> tokens in text fields — email bodies, task titles, SMS messages, webhook payloads, document content, and more. Tokens are resolved at runtime from the deal, contact, and account linked to the trigger.
        </p>
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800 mb-10">
          <strong>Fallback behaviour:</strong> A token that cannot be resolved (missing field, no linked contact, etc.) renders as an <strong>empty string</strong> — it never outputs the literal <code className="bg-amber-100 px-1 rounded font-mono">{'{{token}}'}</code> text or the word "null".
        </div>

        <div className="space-y-10">
          {TOKEN_GROUPS.map((group) => (
            <section key={group.namespace}>
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-gray-900 font-mono">{group.namespace}</h2>
                <p className="text-sm text-gray-500 mt-1">{group.description}</p>
              </div>

              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="text-left px-4 py-2.5 font-medium text-gray-600 w-64">Token</th>
                      <th className="text-left px-4 py-2.5 font-medium text-gray-600">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {group.tokens.map((t) => (
                      <tr key={t.token} className="hover:bg-gray-50">
                        <td className="px-4 py-3 align-top">
                          <code className="text-xs font-mono text-teal-700 break-all">{t.token}</code>
                          {t.notes && (
                            <div className="mt-1">
                              <TokenBadge label={t.notes} />
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3 text-gray-600 align-top">{t.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          ))}
        </div>

        {/* Date fields */}
        <section className="mt-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Date formatting</h2>
          <p className="text-gray-600 mb-4">
            ISO datetime values (e.g. <code className="text-sm bg-gray-100 px-1.5 py-0.5 rounded font-mono">deal.expected_close_date</code>) are automatically formatted as human-readable strings in the company's configured timezone (e.g. <em>Wednesday, 30 April 2025 at 9:00 am AEST</em>).
          </p>
          <p className="text-gray-600 mb-4">
            To get the raw ISO string instead, append <code className="text-sm bg-gray-100 px-1.5 py-0.5 rounded font-mono">_iso</code> to the token name:
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

        {/* Where tokens work */}
        <section className="mt-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Where tokens are supported</h2>
          <p className="text-gray-600 mb-4">
            Tokens are resolved in any string field within an automation action config. Common uses:
          </p>
          <ul className="space-y-2 text-sm text-gray-600 list-disc list-inside">
            <li>Email subject and body (<code className="bg-gray-100 px-1 rounded font-mono text-xs">send_custom_email</code>)</li>
            <li>SMS message text (<code className="bg-gray-100 px-1 rounded font-mono text-xs">send_sms</code>)</li>
            <li>Task title and description (<code className="bg-gray-100 px-1 rounded font-mono text-xs">add_tasks</code>)</li>
            <li>Task assigned_to field — accepts a UUID token like <code className="bg-gray-100 px-1 rounded font-mono text-xs">{'{{deal.owner_id}}'}</code></li>
            <li>Webhook body templates (<code className="bg-gray-100 px-1 rounded font-mono text-xs">call_webhook</code>)</li>
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
