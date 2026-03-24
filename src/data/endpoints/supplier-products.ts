import { type ResourceGroup } from './types.js';

// =============================================================================
// SUPPLIER PRODUCTS
// =============================================================================

export const SUPPLIER_PRODUCTS: ResourceGroup = {
  id: 'supplier-products',
  label: 'Supplier Products',
  description: 'Manage supplier product catalogues for cost tracking on deals.',
  endpoints: [
    { method: 'GET', path: '/supplier-products', description: 'List all supplier products.', scopes: ['products:read'], isWrite: false },
    { method: 'GET', path: '/supplier-products/:id', description: 'Retrieve a supplier product.', scopes: ['products:read'], isWrite: false, params: [{ name: 'id', type: 'uuid', required: true, description: 'Supplier product ID', in: 'path' }] },
    { method: 'POST', path: '/supplier-products', description: 'Create a supplier product.', scopes: ['products:write'], isWrite: true, params: [{ name: 'name', type: 'string', required: true, description: 'Product name', in: 'body' }] },
    { method: 'PATCH', path: '/supplier-products/:id', description: 'Update a supplier product.', scopes: ['products:write'], isWrite: true, params: [{ name: 'id', type: 'uuid', required: true, description: 'Supplier product ID', in: 'path' }] },
    { method: 'DELETE', path: '/supplier-products/:id', description: 'Delete a supplier product.', scopes: ['products:write'], isWrite: true, params: [{ name: 'id', type: 'uuid', required: true, description: 'Supplier product ID', in: 'path' }] },
  ],
};
