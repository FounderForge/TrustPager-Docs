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
      method: 'POST', path: '/reports/query', description: 'Run a report query. Returns aggregated rows for charts or individual deal rows for drilldowns.',
      scopes: ['deals:read'], isWrite: false,
      params: [
        { name: 'source', type: 'string', required: true, description: 'Data source. Currently "deals".', in: 'body' },
        { name: 'measures', type: 'array', required: false, description: 'Array of { field, aggregation, alias }. Fields: id, value, products_total_value, probability. Aggregations: count, sum, avg, min, max.', in: 'body' },
        { name: 'dimensions', type: 'array', required: false, description: 'Group-by fields: status, pipeline_name, stage_name, assigned_user_name, lead_source, etc.', in: 'body' },
        { name: 'filters', type: 'array', required: false, description: 'Array of { field, operator, value/values }. Operators: eq, neq, gt, gte, lt, lte, in, not_in, like, is_null, is_not_null, contains.', in: 'body' },
        { name: 'time_dimension', type: 'object', required: false, description: '{ field: "deal_created_at"|"won_at"|"lost_at", granularity: "day"|"week"|"month"|"quarter"|"year" }', in: 'body' },
        { name: 'mode', type: 'string', required: false, description: '"aggregate" (default) or "drilldown" for individual deal rows.', in: 'body' },
        { name: 'limit', type: 'number', required: false, description: 'Max rows (default 100, max 1000).', in: 'body' },
      ],
    },
    {
      method: 'GET', path: '/reports/sources', description: 'List available data sources with supported measures, dimensions, and filter fields.',
      scopes: ['deals:read'], isWrite: false,
    },
    {
      method: 'GET', path: '/reports/templates', description: 'List available dashboard templates: sales_overview, staff_accountability, pipeline_health, marketing_roi.',
      scopes: ['deals:read'], isWrite: false,
    },

    // ── Dashboard CRUD ──────────────────────────────────────────────────────
    {
      method: 'POST', path: '/report-dashboards', description: 'Create a report dashboard. Supports template expansion with optional pipeline_id scoping. Set visibility to "restricted" then use POST /report-dashboards/:id/acl to grant per-user/role access.',
      scopes: ['deals:read'], isWrite: true,
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
      scopes: ['deals:read'], isWrite: false,
    },
    {
      method: 'GET', path: '/report-dashboards/:id', description: 'Get a dashboard with all its cards. Each card includes title, visualization_type, size, position, and full query_spec.',
      scopes: ['deals:read'], isWrite: false,
      params: [{ name: 'id', type: 'uuid', required: true, description: 'Dashboard UUID.', in: 'path' }],
    },
    {
      method: 'PATCH', path: '/report-dashboards/:id', description: 'Partial update -- rename, re-describe, or change visibility of a dashboard. Changing visibility to "all_users" removes the restriction but does not delete existing ACL entries.',
      scopes: ['deals:read'], isWrite: true,
      params: [
        { name: 'id', type: 'uuid', required: true, description: 'Dashboard UUID.', in: 'path' },
        { name: 'name', type: 'string', required: false, description: 'New name.', in: 'body' },
        { name: 'description', type: 'string', required: false, description: 'New description.', in: 'body' },
        { name: 'visibility', type: 'string', required: false, description: 'all_users or restricted.', in: 'body' },
      ],
    },
    {
      method: 'DELETE', path: '/report-dashboards/:id', description: 'Delete a dashboard and all its cards permanently.',
      scopes: ['deals:read'], isWrite: true,
      params: [{ name: 'id', type: 'uuid', required: true, description: 'Dashboard UUID.', in: 'path' }],
    },

    // ── ACL ─────────────────────────────────────────────────────────────────
    {
      method: 'GET', path: '/report-dashboards/:id/acl', description: 'List ACL entries for a restricted dashboard. Each entry has user_id or role_name indicating who has access.',
      scopes: ['deals:read'], isWrite: false,
      params: [{ name: 'id', type: 'uuid', required: true, description: 'Dashboard UUID.', in: 'path' }],
    },
    {
      method: 'POST', path: '/report-dashboards/:id/acl', description: 'Grant a user or role access to a restricted dashboard. Set visibility="restricted" on the dashboard first.',
      scopes: ['deals:read'], isWrite: true,
      params: [
        { name: 'id', type: 'uuid', required: true, description: 'Dashboard UUID.', in: 'path' },
        { name: 'principal_type', type: 'string', required: true, description: '"user" or "role".', in: 'body' },
        { name: 'principal_id', type: 'string', required: true, description: 'User UUID (when principal_type=user) or role name (when principal_type=role, e.g. "client_admin", "client_editor", "client_viewer").', in: 'body' },
      ],
    },

    // ── Card CRUD ───────────────────────────────────────────────────────────
    {
      method: 'POST', path: '/report-dashboards/:id/cards', description: 'Add a chart card to a dashboard.',
      scopes: ['deals:read'], isWrite: true,
      params: [
        { name: 'id', type: 'uuid', required: true, description: 'Dashboard UUID.', in: 'path' },
        { name: 'title', type: 'string', required: true, description: 'Card title.', in: 'body' },
        { name: 'visualization_type', type: 'string', required: false, description: 'Chart type: stat, bar, horizontal_bar, line, area, donut, pie, table, composed.', in: 'body' },
        { name: 'query_spec', type: 'object', required: false, description: 'Query specification (same format as POST /reports/query).', in: 'body' },
        { name: 'size', type: 'string', required: false, description: 'Card size: sm, md, lg.', in: 'body' },
        { name: 'position', type: 'number', required: false, description: 'Zero-based position in the dashboard.', in: 'body' },
      ],
    },
    {
      method: 'PATCH', path: '/report-cards/:id', description: 'Partial update on a card -- change title, visualization type, query spec, size, or position.',
      scopes: ['deals:read'], isWrite: true,
      params: [
        { name: 'id', type: 'uuid', required: true, description: 'Card UUID.', in: 'path' },
        { name: 'title', type: 'string', required: false, in: 'body' },
        { name: 'visualization_type', type: 'string', required: false, in: 'body' },
        { name: 'query_spec', type: 'object', required: false, in: 'body' },
        { name: 'size', type: 'string', required: false, in: 'body' },
        { name: 'position', type: 'number', required: false, in: 'body' },
      ],
    },
    {
      method: 'DELETE', path: '/report-cards/:id', description: 'Remove a card from its dashboard. Dashboard itself is not affected.',
      scopes: ['deals:read'], isWrite: true,
      params: [{ name: 'id', type: 'uuid', required: true, description: 'Card UUID.', in: 'path' }],
    },
    {
      method: 'PUT', path: '/report-dashboards/:id/reorder', description: 'Reorder cards by providing an ordered array of card UUIDs.',
      scopes: ['deals:read'], isWrite: true,
      params: [
        { name: 'id', type: 'uuid', required: true, description: 'Dashboard UUID.', in: 'path' },
        { name: 'card_ids', type: 'array', required: true, description: 'Ordered array of card UUIDs.', in: 'body' },
      ],
    },

    // ── Funnel Config ───────────────────────────────────────────────────────
    {
      method: 'GET', path: '/report-funnels', description: 'Get funnel step configuration for a pipeline.',
      scopes: ['deals:read'], isWrite: false,
      params: [{ name: 'pipeline_id', type: 'uuid', required: true, description: 'Pipeline UUID.', in: 'query' }],
    },
    {
      method: 'PUT', path: '/report-funnels', description: 'Create or update funnel step configuration for a pipeline.',
      scopes: ['deals:read'], isWrite: true,
      params: [
        { name: 'pipeline_id', type: 'uuid', required: true, description: 'Pipeline UUID.', in: 'body' },
        { name: 'steps', type: 'array', required: true, description: 'Array of { name, stage_ids[] }. Each step groups one or more pipeline stages.', in: 'body' },
      ],
    },
    {
      method: 'DELETE', path: '/report-funnels/:id', description: 'Delete a funnel config.',
      scopes: ['deals:read'], isWrite: true,
      params: [{ name: 'id', type: 'uuid', required: true, description: 'Funnel config UUID.', in: 'path' }],
    },
  ],
};
