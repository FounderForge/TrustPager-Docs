import { type ResourceGroup } from './types.js';

// =============================================================================
// SUPPLIER CATALOG (renamed from /supplier-products to /supplier-catalog)
// =============================================================================

export const SUPPLIER_PRODUCTS: ResourceGroup = {
  id: 'supplier-catalog',
  label: 'Supplier Catalog',
  description: 'Manage supplier product catalogues for cost tracking on deals. The endpoint path is /supplier-catalog.',
  endpoints: [
    { method: 'GET', path: '/supplier-catalog', description: 'List all supplier products in the catalog.', scopes: ['products:read'], isWrite: false, params: [{ name: 'supplier_id', type: 'uuid', required: false, description: 'Filter by supplier UUID', in: 'query' }, { name: 'product_id', type: 'uuid', required: false, description: 'Filter by product UUID', in: 'query' }, { name: 'is_active', type: 'boolean', required: false, description: 'Filter by active status', in: 'query' }] },
    { method: 'GET', path: '/supplier-catalog/:id', description: 'Retrieve a supplier product from the catalog.', scopes: ['products:read'], isWrite: false, params: [{ name: 'id', type: 'uuid', required: true, description: 'Supplier product ID', in: 'path' }] },
    { method: 'POST', path: '/supplier-catalog', description: 'Create a supplier product in the catalog. supplier_id and supplier_price are required.', scopes: ['products:write'], isWrite: true, params: [{ name: 'supplier_id', type: 'uuid', required: true, description: 'Supplier (customer) UUID', in: 'body' }, { name: 'supplier_price', type: 'number', required: true, description: 'Supplier price', in: 'body' }, { name: 'product_id', type: 'uuid', required: false, description: 'Link to existing product UUID', in: 'body' }, { name: 'product_name', type: 'string', required: false, description: 'New product name if not linking to existing', in: 'body' }, { name: 'supplier_sku', type: 'string', required: false, description: 'Supplier SKU', in: 'body' }, { name: 'lead_time_days', type: 'number', required: false, description: 'Lead time in days', in: 'body' }, { name: 'minimum_order_qty', type: 'number', required: false, description: 'Minimum order quantity', in: 'body' }] },
    { method: 'PATCH', path: '/supplier-catalog/:id', description: 'Update a supplier product in the catalog.', scopes: ['products:write'], isWrite: true, params: [{ name: 'id', type: 'uuid', required: true, description: 'Supplier product ID', in: 'path' }] },
    { method: 'DELETE', path: '/supplier-catalog/:id', description: 'Delete a supplier product from the catalog.', scopes: ['products:write'], isWrite: true, params: [{ name: 'id', type: 'uuid', required: true, description: 'Supplier product ID', in: 'path' }] },
  ],
};
