import { type ResourceGroup } from './types.js';

// =============================================================================
// SPREADSHEETS
// =============================================================================

export const SPREADSHEETS: ResourceGroup = {
  id: 'spreadsheets',
  label: 'Spreadsheets',
  description: 'Manage spreadsheet templates (column definitions) and populated spreadsheets (row data). Spreadsheets can be linked to opportunities and are also created automatically when a form with a spreadsheet field is submitted. Scopes: spreadsheets:read, spreadsheets:write, spreadsheets:delete.',
  endpoints: [
    // --- Templates ---
    {
      method: 'GET',
      path: '/spreadsheets/templates',
      description: 'List all spreadsheet templates for this workspace.',
      scopes: ['spreadsheets:read'],
      isWrite: false,
      params: [
        { name: 'search', type: 'string', required: false, description: 'Filter by name (partial match)', in: 'query' },
        { name: 'include_archived', type: 'boolean', required: false, description: 'Include archived templates (default false)', in: 'query' },
        { name: 'limit', type: 'number', required: false, description: 'Items per page (default 25, max 100)', in: 'query' },
        { name: 'after', type: 'string', required: false, description: 'Cursor: last ID from previous page', in: 'query' },
      ],
    },
    {
      method: 'GET',
      path: '/spreadsheets/templates/:id',
      description: 'Get a spreadsheet template with full column definitions. Use this to resolve column IDs to headers before writing row data.',
      scopes: ['spreadsheets:read'],
      isWrite: false,
      params: [
        { name: 'id', type: 'uuid', required: true, description: 'Template ID', in: 'path' },
      ],
      responseExample: JSON.stringify({
        id: 'tmpl-uuid',
        name: 'Project Checklist',
        description: 'Standard project delivery checklist',
        columns: [
          { id: 'col-uuid-1', header: 'Task', data_type: 'text' },
          { id: 'col-uuid-2', header: 'Assigned To', data_type: 'text' },
          { id: 'col-uuid-3', header: 'Due Date', data_type: 'date' },
          { id: 'col-uuid-4', header: 'Complete', data_type: 'boolean' },
        ],
        is_archived: false,
        created_at: '2026-01-15T10:00:00Z',
      }, null, 2),
    },
    {
      method: 'POST',
      path: '/spreadsheets/templates',
      description: 'Create a new spreadsheet template with column definitions. Columns each have a header and data_type (text, number, date, boolean). If columns are omitted, two default columns (Item and Notes) are created.',
      scopes: ['spreadsheets:write'],
      isWrite: true,
      params: [
        { name: 'name', type: 'string', required: true, description: 'Template name', in: 'body' },
        { name: 'description', type: 'string', required: false, description: 'Optional description', in: 'body' },
        { name: 'columns', type: 'array', required: false, description: 'Column definitions. Each: { header: string, data_type: "text"|"number"|"date"|"boolean" }', in: 'body' },
      ],
      requestExample: JSON.stringify({
        name: 'Project Checklist',
        columns: [
          { header: 'Task', data_type: 'text' },
          { header: 'Assigned To', data_type: 'text' },
          { header: 'Due Date', data_type: 'date' },
          { header: 'Complete', data_type: 'boolean' },
        ],
      }, null, 2),
    },
    {
      method: 'PATCH',
      path: '/spreadsheets/templates/:id',
      description: 'Update a spreadsheet template. Changing columns does not modify existing row data.',
      scopes: ['spreadsheets:write'],
      isWrite: true,
      params: [
        { name: 'id', type: 'uuid', required: true, description: 'Template ID', in: 'path' },
        { name: 'name', type: 'string', required: false, description: 'Template name', in: 'body' },
        { name: 'description', type: 'string', required: false, description: 'Template description', in: 'body' },
        { name: 'columns', type: 'array', required: false, description: 'Full replacement column set. Include id on existing columns to update them; omit id to add new columns.', in: 'body' },
        { name: 'is_archived', type: 'boolean', required: false, description: 'Archive or unarchive', in: 'body' },
      ],
    },
    {
      method: 'DELETE',
      path: '/spreadsheets/templates/:id',
      description: 'Delete a spreadsheet template and cascade-delete all spreadsheets derived from it.',
      scopes: ['spreadsheets:delete'],
      isWrite: true,
      params: [
        { name: 'id', type: 'uuid', required: true, description: 'Template ID', in: 'path' },
      ],
    },

    // --- Spreadsheets (populated copies) ---
    {
      method: 'GET',
      path: '/spreadsheets',
      description: 'List all populated spreadsheets. Filter by template or opportunity.',
      scopes: ['spreadsheets:read'],
      isWrite: false,
      params: [
        { name: 'template_id', type: 'uuid', required: false, description: 'Filter by template', in: 'query' },
        { name: 'opportunity_id', type: 'uuid', required: false, description: 'Filter by linked opportunity', in: 'query' },
        { name: 'include_archived', type: 'boolean', required: false, description: 'Include archived spreadsheets (default false)', in: 'query' },
        { name: 'limit', type: 'number', required: false, description: 'Items per page (default 25, max 100)', in: 'query' },
        { name: 'after', type: 'string', required: false, description: 'Cursor: last ID from previous page', in: 'query' },
      ],
    },
    {
      method: 'GET',
      path: '/spreadsheets/:id',
      description: 'Get a populated spreadsheet with metadata, parent template column definitions (parent_columns), and all rows ordered by row_index. Each row cells object is keyed by column ID.',
      scopes: ['spreadsheets:read'],
      isWrite: false,
      params: [
        { name: 'id', type: 'uuid', required: true, description: 'Spreadsheet ID', in: 'path' },
      ],
      responseExample: JSON.stringify({
        id: 'ss-uuid',
        name: 'Project Alpha Checklist',
        opportunity_id: 'deal-uuid',
        is_archived: false,
        parent_columns: [
          { id: 'col-uuid-1', header: 'Task', data_type: 'text' },
          { id: 'col-uuid-2', header: 'Complete', data_type: 'boolean' },
        ],
        rows: [
          { id: 'row-uuid-1', row_index: 0, cells: { 'col-uuid-1': 'Discovery call', 'col-uuid-2': true } },
          { id: 'row-uuid-2', row_index: 1, cells: { 'col-uuid-1': 'Proposal sent', 'col-uuid-2': false } },
        ],
      }, null, 2),
    },
    {
      method: 'POST',
      path: '/spreadsheets',
      description: 'Create a new populated spreadsheet from a template. Starts with no rows. Optionally link to an opportunity.',
      scopes: ['spreadsheets:write'],
      isWrite: true,
      params: [
        { name: 'template_id', type: 'uuid', required: true, description: 'Template to base this spreadsheet on', in: 'body' },
        { name: 'name', type: 'string', required: true, description: 'Spreadsheet name', in: 'body' },
        { name: 'opportunity_id', type: 'uuid', required: false, description: 'Link to an opportunity', in: 'body' },
      ],
      requestExample: JSON.stringify({
        template_id: 'tmpl-uuid',
        name: 'Project Alpha Checklist',
        opportunity_id: 'deal-uuid',
      }, null, 2),
    },
    {
      method: 'PATCH',
      path: '/spreadsheets/:id',
      description: 'Update a spreadsheet name, linked opportunity, or archived status.',
      scopes: ['spreadsheets:write'],
      isWrite: true,
      params: [
        { name: 'id', type: 'uuid', required: true, description: 'Spreadsheet ID', in: 'path' },
        { name: 'name', type: 'string', required: false, description: 'Spreadsheet name', in: 'body' },
        { name: 'opportunity_id', type: 'uuid', required: false, description: 'Link to a different opportunity, or null to unlink', in: 'body' },
        { name: 'is_archived', type: 'boolean', required: false, description: 'Archive or unarchive', in: 'body' },
      ],
    },
    {
      method: 'DELETE',
      path: '/spreadsheets/:id',
      description: 'Delete a populated spreadsheet and all its rows. Does not affect the parent template.',
      scopes: ['spreadsheets:delete'],
      isWrite: true,
      params: [
        { name: 'id', type: 'uuid', required: true, description: 'Spreadsheet ID', in: 'path' },
      ],
    },

    // --- Rows ---
    {
      method: 'GET',
      path: '/spreadsheets/:id/rows',
      description: 'List all rows in a spreadsheet ordered by row_index. Each row has a cells object keyed by column ID.',
      scopes: ['spreadsheets:read'],
      isWrite: false,
      params: [
        { name: 'id', type: 'uuid', required: true, description: 'Spreadsheet ID', in: 'path' },
      ],
    },
    {
      method: 'POST',
      path: '/spreadsheets/:id/rows',
      description: 'Append a new row to a spreadsheet. Provide cells as an object keyed by column ID (not header name). Retrieve column IDs from GET /spreadsheets/:id (parent_columns) or GET /spreadsheets/templates/:id.',
      scopes: ['spreadsheets:write'],
      isWrite: true,
      params: [
        { name: 'id', type: 'uuid', required: true, description: 'Spreadsheet ID', in: 'path' },
        { name: 'cells', type: 'object', required: false, description: 'Cell values keyed by column ID', in: 'body' },
      ],
      requestExample: JSON.stringify({
        cells: {
          'col-uuid-1': 'Send proposal',
          'col-uuid-2': false,
        },
      }, null, 2),
    },
    {
      method: 'PATCH',
      path: '/spreadsheets/:id/rows/:rowId',
      description: 'Update the cells or row_index of an existing row. cells replaces the entire cells object -- include all column values you want to retain.',
      scopes: ['spreadsheets:write'],
      isWrite: true,
      params: [
        { name: 'id', type: 'uuid', required: true, description: 'Spreadsheet ID', in: 'path' },
        { name: 'rowId', type: 'uuid', required: true, description: 'Row ID', in: 'path' },
        { name: 'cells', type: 'object', required: false, description: 'Replacement cells object keyed by column ID', in: 'body' },
        { name: 'row_index', type: 'number', required: false, description: 'New row position (0-based)', in: 'body' },
      ],
    },
    {
      method: 'DELETE',
      path: '/spreadsheets/:id/rows/:rowId',
      description: 'Delete a single row from a spreadsheet.',
      scopes: ['spreadsheets:delete'],
      isWrite: true,
      params: [
        { name: 'id', type: 'uuid', required: true, description: 'Spreadsheet ID', in: 'path' },
        { name: 'rowId', type: 'uuid', required: true, description: 'Row ID', in: 'path' },
      ],
    },
  ],
};
