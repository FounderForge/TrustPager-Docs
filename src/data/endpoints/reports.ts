import { type ResourceGroup } from './types.js';

// =============================================================================
// REPORTS
// =============================================================================

export const REPORTS: ResourceGroup = {
  id: 'reports',
  label: 'Reports',
  description: 'Query engine, dashboard CRUD, card CRUD, and funnel configuration for the workspace reporting system. Dashboards support per-record visibility (all_users or restricted) with ACL-based access grants.',
  endpoints: [
    // ── Query Engine ────────────────────────────────────────────────────────
    {
      method: 'POST', path: '/reports/query', description: 'Run a report query. Returns aggregated rows for charts, or individual rows for drilldowns. Sources: "deals" (pipeline performance, revenue, win/loss) and "tasks" (open/overdue/by-assignee). In drilldown mode, the dimensions[] array controls which columns are returned and in what order (up to 8 columns via display_config.columns on a saved card).',
      scopes: ['opportunities:read'], isWrite: false,
      params: [
        { name: 'source', type: 'string', required: true, description: 'Data source: "deals" or "tasks".', in: 'body' },
        { name: 'measures', type: 'array', required: false, description: 'Array of { field, aggregation, alias }. deals fields: id (count), value, products_total_value, product_count. tasks fields: id (count). Aggregations: count, sum, avg, min, max.', in: 'body' },
        { name: 'dimensions', type: 'array', required: false, description: 'In aggregate mode: group-by fields. In drilldown mode: also sets which columns are returned in order. deals fields: status, pipeline_name, stage_name, assigned_user_name, lead_source, currency, won_reasons, lost_reasons, product_names, product_categories. tasks fields: status, priority, category, assignee_name, deal_name, contact_name, is_overdue, client (virtual -- display only, resolves to contact_name falling back to deal_name; cannot be filtered or sorted). Virtual dimensions (virtual:true in /reports/sources) are computed in JS post-fetch and cannot appear in filters or order_by.', in: 'body' },
        { name: 'filters', type: 'array', required: false, description: 'Array of { field, operator, value/values }. Operators: eq, neq, gt, gte, lt, lte, in, not_in, like, is_null, is_not_null, contains. Do not filter on virtual dimensions.', in: 'body' },
        { name: 'time_dimension', type: 'object', required: false, description: '{ field, granularity }. deals: field is deal_created_at, won_at, lost_at, placed_at. tasks: field is due_date, task_created_at, completed_at. granularity: day, week, month, quarter, year.', in: 'body' },
        { name: 'mode', type: 'string', required: false, description: '"aggregate" (default) returns grouped/summed rows. "drilldown" returns individual rows from the source; dimensions[] controls which columns are returned.', in: 'body' },
        { name: 'order_by', type: 'array', required: false, description: 'Sort order. Array of { field, direction } objects where direction is "asc" or "desc". Can also be a single { field, direction } object. "sort" is accepted as an alias. Cannot sort on virtual dimensions.', in: 'body' },
        { name: 'drilldown_dimension', type: 'string', required: false, description: 'For drilldown mode: dimension field to filter by.', in: 'body' },
        { name: 'drilldown_value', type: 'string', required: false, description: 'For drilldown mode: value to match on drilldown_dimension.', in: 'body' },
        { name: 'limit', type: 'number', required: false, description: 'Max rows (default 100, max 1000).', in: 'body' },
      ],
    },
    {
      method: 'GET', path: '/reports/sources', description: 'List available data sources ("deals", "tasks") with supported measures, dimensions, and filter fields. Dimensions with virtual:true are computed in JS post-fetch -- they cannot be used in filters or order_by, only in dimensions[] for display column selection.',
      scopes: ['opportunities:read'], isWrite: false,
    },
    {
      method: 'GET', path: '/reports/templates', description: 'List available dashboard templates: sales_overview, staff_accountability, pipeline_health, marketing_roi.',
      scopes: ['opportunities:read'], isWrite: false,
    },

    // ── Dashboard CRUD ──────────────────────────────────────────────────────
    {
      method: 'POST', path: '/report-dashboards', description: 'Create a report dashboard. Supports template expansion with optional pipeline_id scoping. Set visibility to "restricted" then use POST /report-dashboards/:id/acl to grant per-user/role access.',
      scopes: ['opportunities:read'], isWrite: true,
      params: [
        { name: 'name', type: 'string', required: false, description: 'Dashboard name. Required if no template.', in: 'body' },
        { name: 'description', type: 'string', required: false, description: 'Dashboard description.', in: 'body' },
        { name: 'template', type: 'string', required: false, description: 'Template key: sales_overview, staff_accountability, pipeline_health, marketing_roi. Auto-populates cards.', in: 'body' },
        { name: 'pipeline_id', type: 'uuid', required: false, description: 'Pipeline UUID. Scopes all template cards to this pipeline.', in: 'body' },
        { name: 'visibility', type: 'string', required: false, description: 'Who can see this dashboard. Valid values: "all_users" (default -- everyone in the workspace) or "restricted" (only users/roles added via the ACL endpoint). Use "restricted" + POST /report-dashboards/:id/acl to control access precisely.', in: 'body' },
      ],
    },
    {
      method: 'GET', path: '/report-dashboards', description: 'List all report dashboards for the company.',
      scopes: ['opportunities:read'], isWrite: false,
    },
    {
      method: 'GET', path: '/report-dashboards/:id', description: 'Get a dashboard with all its cards. Each card includes title, visualization_type, size, position, and full query_spec.',
      scopes: ['opportunities:read'], isWrite: false,
      params: [{ name: 'id', type: 'uuid', required: true, description: 'Dashboard UUID.', in: 'path' }],
    },
    {
      method: 'PATCH', path: '/report-dashboards/:id', description: 'Partial update -- rename, re-describe, or change visibility of a dashboard. Changing visibility to "all_users" removes the restriction but does not delete existing ACL entries.',
      scopes: ['opportunities:read'], isWrite: true,
      params: [
        { name: 'id', type: 'uuid', required: true, description: 'Dashboard UUID.', in: 'path' },
        { name: 'name', type: 'string', required: false, description: 'New name.', in: 'body' },
        { name: 'description', type: 'string', required: false, description: 'New description.', in: 'body' },
        { name: 'visibility', type: 'string', required: false, description: 'all_users or restricted.', in: 'body' },
      ],
    },
    {
      method: 'DELETE', path: '/report-dashboards/:id', description: 'Delete a dashboard and all its cards permanently.',
      scopes: ['opportunities:read'], isWrite: true,
      params: [{ name: 'id', type: 'uuid', required: true, description: 'Dashboard UUID.', in: 'path' }],
    },

    // ── ACL ─────────────────────────────────────────────────────────────────
    {
      method: 'GET', path: '/report-dashboards/:id/acl', description: 'List ACL entries for a restricted dashboard. Each entry has user_id or role_name indicating who has access.',
      scopes: ['opportunities:read'], isWrite: false,
      params: [{ name: 'id', type: 'uuid', required: true, description: 'Dashboard UUID.', in: 'path' }],
    },
    {
      method: 'POST', path: '/report-dashboards/:id/acl', description: 'Grant a user or role access to a restricted dashboard. Set visibility="restricted" on the dashboard first.',
      scopes: ['opportunities:read'], isWrite: true,
      params: [
        { name: 'id', type: 'uuid', required: true, description: 'Dashboard UUID.', in: 'path' },
        { name: 'principal_type', type: 'string', required: true, description: '"user" or "role".', in: 'body' },
        { name: 'principal_id', type: 'string', required: true, description: 'User UUID (when principal_type=user) or role name (when principal_type=role, e.g. "client_admin", "client_editor", "client_viewer").', in: 'body' },
      ],
    },

    // ── Card CRUD ───────────────────────────────────────────────────────────
    {
      method: 'POST', path: '/report-dashboards/:id/cards', description: 'Add a chart or table card to a dashboard. Use display_config.columns to control which columns appear in email digest renders for table/drilldown cards.',
      scopes: ['opportunities:read'], isWrite: true,
      params: [
        { name: 'id', type: 'uuid', required: true, description: 'Dashboard UUID.', in: 'path' },
        { name: 'title', type: 'string', required: true, description: 'Card title.', in: 'body' },
        { name: 'visualization_type', type: 'string', required: false, description: 'Chart type: stat, bar, horizontal_bar, line, area, donut, pie, table, composed.', in: 'body' },
        { name: 'query_spec', type: 'object', required: false, description: 'Query specification (same format as POST /reports/query). For drilldown table cards set mode:"drilldown" and optionally dimensions[] to control columns. order_by accepts an array of { field, direction } objects for multi-key sorting; "sort" is accepted as alias.', in: 'body' },
        { name: 'display_config', type: 'object', required: false, description: 'Display overrides for email digest rendering. display_config.columns: array of column key strings or { key, label? } objects (up to 8 columns). When set, overrides dimensions[] as the column source for table cards. Use to show different columns in the email vs the underlying data query.', in: 'body' },
        { name: 'size', type: 'string', required: false, description: 'Card size: sm, md, lg.', in: 'body' },
        { name: 'position', type: 'number', required: false, description: 'Zero-based position in the dashboard.', in: 'body' },
      ],
    },
    {
      method: 'PATCH', path: '/report-cards/:id', description: 'Partial update on a card -- change title, visualization type, query spec, display_config, size, or position.',
      scopes: ['opportunities:read'], isWrite: true,
      params: [
        { name: 'id', type: 'uuid', required: true, description: 'Card UUID.', in: 'path' },
        { name: 'title', type: 'string', required: false, description: 'Card title.', in: 'body' },
        { name: 'visualization_type', type: 'string', required: false, description: 'Visualization type (bar, line, pie, etc.).', in: 'body' },
        { name: 'query_spec', type: 'object', required: false, description: 'Query specification object. Supports order_by as array of { field, direction } for multi-key sorting; "sort" is accepted as alias for order_by.', in: 'body' },
        { name: 'display_config', type: 'object', required: false, description: 'Display overrides. display_config.columns sets an explicit column list for table/drilldown email digest rendering (string[] or { key, label? }[], up to 8 columns).', in: 'body' },
        { name: 'size', type: 'string', required: false, description: 'Card size (sm, md, lg).', in: 'body' },
        { name: 'position', type: 'number', required: false, description: 'Sort order position.', in: 'body' },
      ],
    },
    {
      method: 'DELETE', path: '/report-cards/:id', description: 'Remove a card from its dashboard. Dashboard itself is not affected.',
      scopes: ['opportunities:read'], isWrite: true,
      params: [{ name: 'id', type: 'uuid', required: true, description: 'Card UUID.', in: 'path' }],
    },
    {
      method: 'PUT', path: '/report-dashboards/:id/reorder', description: 'Reorder cards by providing an ordered array of card UUIDs.',
      scopes: ['opportunities:read'], isWrite: true,
      params: [
        { name: 'id', type: 'uuid', required: true, description: 'Dashboard UUID.', in: 'path' },
        { name: 'card_ids', type: 'array', required: true, description: 'Ordered array of card UUIDs.', in: 'body' },
      ],
    },

    // ── Digest Send ─────────────────────────────────────────────────────────
    {
      method: 'POST', path: '/reports/send', description: 'Send a report dashboard as an email digest. Dashboard cards render server-side and are inlined into the email body. Each recipient is scoped via current_user_id so cards filtered to "the current user" naturally show per-recipient data. Returns per-recipient send status with skipped_reason when a send is suppressed.',
      scopes: ['opportunities:read'], isWrite: true,
      params: [
        { name: 'dashboard_id', type: 'uuid', required: true, description: 'UUID of the dashboard to send.', in: 'body' },
        { name: 'recipients', type: 'array', required: true, description: 'Array of recipients. Each item is a plain email string or { email, name?, user_id? }. user_id scopes the rendered report to that workspace user.', in: 'body' },
        { name: 'subject', type: 'string', required: false, description: 'Email subject line. Defaults to the dashboard name.', in: 'body' },
        { name: 'intro_text', type: 'string', required: false, description: 'Plain-text intro paragraph above the report block. Supports {{variable}} placeholders. Ignored when intro_html is also set.', in: 'body' },
        { name: 'outro_text', type: 'string', required: false, description: 'Plain-text outro paragraph below the report block. Supports {{variable}} placeholders. Ignored when outro_html is also set.', in: 'body' },
        { name: 'intro_html', type: 'string', required: false, description: 'Pre-authored HTML intro (e.g. from the rich-text wizard). Takes precedence over intro_text when both are provided.', in: 'body' },
        { name: 'outro_html', type: 'string', required: false, description: 'Pre-authored HTML outro. Takes precedence over outro_text when both are provided.', in: 'body' },
        { name: 'sender_name', type: 'string', required: false, description: 'Display name shown above the signature line.', in: 'body' },
        { name: 'suppress_if_empty', type: 'boolean', required: false, description: 'When true (default), skip sending to any recipient whose dashboard renders zero rows. Skipped sends are reported as success with skipped_reason: "empty_dashboard".', in: 'body' },
        { name: 'email_config_id', type: 'uuid', required: false, description: 'Optional email config UUID to pin the sender alias or provider.', in: 'body' },
        { name: 'email_provider', type: 'string', required: false, description: 'Provider to use: "postmark" (TrustPager Mail, default) or "gmail". Gmail requires the workspace email_config to have a Gmail sender connected; returns an error otherwise.', in: 'body' },
        { name: 'contact_id', type: 'uuid', required: false, description: 'Optional CRM contact UUID to associate with the email send log.', in: 'body' },
        { name: 'customer_id', type: 'uuid', required: false, description: 'Optional CRM company UUID to associate with the email send log.', in: 'body' },
        { name: 'deal_id', type: 'uuid', required: false, description: 'Optional CRM opportunity UUID to associate with the email send log.', in: 'body' },
      ],
      example: {
        request: {
          dashboard_id: '550e8400-e29b-41d4-a716-446655440000',
          recipients: [{ email: 'alice@example.com', name: 'Alice', user_id: 'usr_abc123' }],
          subject: 'Your weekly sales report',
          intro_html: '<p>Hi {{name}}, here is your weekly summary.</p>',
          email_provider: 'postmark',
          suppress_if_empty: true,
        },
        response: {
          success: true,
          dashboard_name: 'Sales Overview',
          recipients: [
            { email: 'alice@example.com', sent: true, rendered_card_count: 4 },
          ],
        },
      },
    },

    // ── Funnel Config ───────────────────────────────────────────────────────
    {
      method: 'GET', path: '/report-funnels', description: 'Get funnel step configuration for a pipeline.',
      scopes: ['opportunities:read'], isWrite: false,
      params: [{ name: 'pipeline_id', type: 'uuid', required: true, description: 'Pipeline UUID.', in: 'query' }],
    },
    {
      method: 'PUT', path: '/report-funnels', description: 'Create or update funnel step configuration for a pipeline.',
      scopes: ['opportunities:read'], isWrite: true,
      params: [
        { name: 'pipeline_id', type: 'uuid', required: true, description: 'Pipeline UUID.', in: 'body' },
        { name: 'steps', type: 'array', required: true, description: 'Array of { name, stage_ids[] }. Each step groups one or more pipeline stages.', in: 'body' },
      ],
    },
    {
      method: 'DELETE', path: '/report-funnels/:id', description: 'Delete a funnel config.',
      scopes: ['opportunities:read'], isWrite: true,
      params: [{ name: 'id', type: 'uuid', required: true, description: 'Funnel config UUID.', in: 'path' }],
    },
  ],
};
