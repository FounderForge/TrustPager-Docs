import { type ResourceGroup } from './types.js';

// =============================================================================
// PIPELINES
// =============================================================================

export const PIPELINES: ResourceGroup = {
  id: 'pipelines',
  label: 'Pipelines',
  description: 'Manage sales pipelines and their stages. Deals move through pipeline stages to track progress.',
  endpoints: [
    { method: 'GET', path: '/pipelines', description: 'List all pipelines.', scopes: ['pipelines:read'], isWrite: false },
    { method: 'GET', path: '/pipelines/:id', description: 'Retrieve a pipeline with its stages.', scopes: ['pipelines:read'], isWrite: false, params: [{ name: 'id', type: 'uuid', required: true, description: 'Pipeline ID', in: 'path' }] },
    { method: 'POST', path: '/pipelines', description: 'Create a new pipeline. name is required.', scopes: ['pipelines:write'], isWrite: true, params: [{ name: 'name', type: 'string', required: true, description: 'Pipeline name', in: 'body' }] },
    { method: 'PATCH', path: '/pipelines/:id', description: 'Update a pipeline.', scopes: ['pipelines:write'], isWrite: true, params: [{ name: 'id', type: 'uuid', required: true, description: 'Pipeline ID', in: 'path' }] },
    { method: 'DELETE', path: '/pipelines/:id', description: 'Delete a pipeline.', scopes: ['pipelines:write'], isWrite: true, params: [{ name: 'id', type: 'uuid', required: true, description: 'Pipeline ID', in: 'path' }] },
    { method: 'GET', path: '/pipelines/:id/stages', description: 'List stages for a pipeline, ordered by position. Each stage includes a deal_count field (number of deals currently in that stage) so Kanban column headers can render counts without a second query.', scopes: ['pipelines:read'], isWrite: false, params: [{ name: 'id', type: 'uuid', required: true, description: 'Pipeline ID', in: 'path' }] },
    { method: 'POST', path: '/pipelines/:id/stages', description: 'Add a stage to a pipeline.', scopes: ['pipelines:write'], isWrite: true, params: [{ name: 'id', type: 'uuid', required: true, description: 'Pipeline ID', in: 'path' }, { name: 'name', type: 'string', required: true, description: 'Stage name', in: 'body' }] },
    { method: 'PATCH', path: '/pipelines/:id/stages/:stageId', description: 'Update a pipeline stage.', scopes: ['pipelines:write'], isWrite: true, params: [{ name: 'id', type: 'uuid', required: true, description: 'Pipeline ID', in: 'path' }, { name: 'stageId', type: 'uuid', required: true, description: 'Stage ID', in: 'path' }] },
    { method: 'DELETE', path: '/pipelines/:id/stages/:stageId', description: 'Delete a pipeline stage.', scopes: ['pipelines:write'], isWrite: true, params: [{ name: 'id', type: 'uuid', required: true, description: 'Pipeline ID', in: 'path' }, { name: 'stageId', type: 'uuid', required: true, description: 'Stage ID', in: 'path' }] },
    { method: 'GET', path: '/pipelines/:id/deals', description: 'DEPRECATED -- prefer GET /deals?pipeline_id=X. The /deals endpoint returns the same data plus full pipeline placements on every deal and supports additional filters (stage_id, status, search, pagination). This endpoint now also attaches placements for backward compatibility but may be removed in a future version.', scopes: ['pipelines:read', 'deals:read'], isWrite: false, params: [{ name: 'id', type: 'uuid', required: true, description: 'Pipeline ID', in: 'path' }] },
    { method: 'GET', path: '/pipelines/:id/summary', description: 'Get pipeline summary with deal counts and values per stage.', scopes: ['pipelines:read'], isWrite: false, params: [{ name: 'id', type: 'uuid', required: true, description: 'Pipeline ID', in: 'path' }] },
  ],
};
