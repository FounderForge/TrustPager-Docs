import { type ResourceGroup } from './types.js';

// =============================================================================
// TASKS
// =============================================================================

export const TASKS: ResourceGroup = {
  id: 'tasks',
  label: 'Tasks',
  description: 'Create, assign, and manage tasks linked to deals and contacts.',
  endpoints: [
    { method: 'GET', path: '/tasks', description: 'List all tasks with filters.', scopes: ['tasks:read'], isWrite: false },
    { method: 'GET', path: '/tasks/:id', description: 'Retrieve a task.', scopes: ['tasks:read'], isWrite: false, params: [{ name: 'id', type: 'uuid', required: true, description: 'Task ID', in: 'path' }] },
    { method: 'POST', path: '/tasks', description: 'Create a task. title is required.', scopes: ['tasks:write'], isWrite: true, params: [{ name: 'title', type: 'string', required: true, description: 'Task title', in: 'body' }, { name: 'deal_id', type: 'uuid', required: false, description: 'Link to deal', in: 'body' }, { name: 'assigned_to', type: 'uuid', required: false, description: 'Assign to user ID', in: 'body' }] },
    { method: 'PATCH', path: '/tasks/:id', description: 'Update a task.', scopes: ['tasks:write'], isWrite: true, params: [{ name: 'id', type: 'uuid', required: true, description: 'Task ID', in: 'path' }] },
    { method: 'DELETE', path: '/tasks/:id', description: 'Delete a task.', scopes: ['tasks:write'], isWrite: true, params: [{ name: 'id', type: 'uuid', required: true, description: 'Task ID', in: 'path' }] },
    { method: 'GET', path: '/tasks/categories', description: 'List task categories.', scopes: ['tasks:read'], isWrite: false },
    { method: 'POST', path: '/tasks/categories', description: 'Create a task category.', scopes: ['tasks:write'], isWrite: true, params: [{ name: 'name', type: 'string', required: true, description: 'Category name', in: 'body' }, { name: 'color', type: 'string', required: false, description: 'Category color', in: 'body' }] },
    { method: 'PATCH', path: '/tasks/categories/:id', description: 'Update a task category.', scopes: ['tasks:write'], isWrite: true, params: [{ name: 'id', type: 'uuid', required: true, description: 'Category ID', in: 'path' }] },
    { method: 'DELETE', path: '/tasks/categories/:id', description: 'Delete a task category.', scopes: ['tasks:write'], isWrite: true, params: [{ name: 'id', type: 'uuid', required: true, description: 'Category ID', in: 'path' }] },
    { method: 'POST', path: '/tasks/reorder', description: 'Reorder tasks by providing an array of task IDs in desired order.', scopes: ['tasks:write'], isWrite: true, params: [{ name: 'order', type: 'uuid[]', required: true, description: 'Array of task IDs in desired order', in: 'body' }] },
  ],
};
