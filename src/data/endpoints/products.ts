import { type ResourceGroup } from './types.js';

// =============================================================================
// PRODUCTS
// =============================================================================

export const PRODUCTS: ResourceGroup = {
  id: 'products',
  label: 'Products',
  description: 'Manage products and services that can be added to deals.',
  endpoints: [
    { method: 'GET', path: '/products', description: 'List all products.', scopes: ['products:read'], isWrite: false },
    { method: 'GET', path: '/products/:id', description: 'Retrieve a product by ID.', scopes: ['products:read'], isWrite: false, params: [{ name: 'id', type: 'uuid', required: true, description: 'Product ID', in: 'path' }] },
    { method: 'POST', path: '/products', description: 'Create a product. name and price are required.', scopes: ['products:write'], isWrite: true, params: [{ name: 'name', type: 'string', required: true, description: 'Product name', in: 'body' }, { name: 'price', type: 'number', required: true, description: 'Unit price', in: 'body' }, { name: 'currency', type: 'string', required: false, description: 'Currency (default: AUD)', in: 'body' }, { name: 'sku', type: 'string', required: false, description: 'SKU code', in: 'body' }, { name: 'images', type: 'string[]', required: false, description: 'Array of product image URLs', in: 'body' }, { name: 'is_active', type: 'boolean', required: false, description: 'Whether the product is active (default: true)', in: 'body' }, { name: 'work_order_config', type: 'object', required: false, description: 'Product-specific work order field configuration (fields + statuses). Null = use company default.', in: 'body' }] },
    { method: 'PATCH', path: '/products/:id', description: 'Update a product. Writable fields include: name, sku, price, currency, category, description, unit, benefits, deposit_percent, default_expiry_days, images, track_inventory, track_batches, low_stock_threshold, is_active, metadata.', scopes: ['products:write'], isWrite: true, params: [{ name: 'id', type: 'uuid', required: true, description: 'Product ID', in: 'path' }, { name: 'images', type: 'string[]', required: false, description: 'Array of product image URLs (field name is "images", not "image_url")', in: 'body' }, { name: 'work_order_config', type: 'object', required: false, description: 'Product-specific work order field configuration. Set to null to revert to company defaults.', in: 'body' }] },
    { method: 'DELETE', path: '/products/:id', description: 'Delete a product.', scopes: ['products:write'], isWrite: true, params: [{ name: 'id', type: 'uuid', required: true, description: 'Product ID', in: 'path' }] },
    { method: 'GET', path: '/products/:id/costs', description: 'List cost entries for a product.', scopes: ['products:read'], isWrite: false, params: [{ name: 'id', type: 'uuid', required: true, description: 'Product ID', in: 'path' }] },
    { method: 'POST', path: '/products/:id/costs', description: 'Create a cost entry for a product.', scopes: ['products:write'], isWrite: true, params: [{ name: 'id', type: 'uuid', required: true, description: 'Product ID', in: 'path' }, { name: 'label', type: 'string', required: false, description: 'Cost label', in: 'body' }, { name: 'cost_price', type: 'number', required: false, description: 'Cost price', in: 'body' }, { name: 'quantity', type: 'number', required: false, description: 'Quantity', in: 'body' }, { name: 'supplier_id', type: 'uuid', required: false, description: 'Supplier customer ID', in: 'body' }, { name: 'supplier_product_id', type: 'uuid', required: false, description: 'Supplier product ID', in: 'body' }] },
    { method: 'PATCH', path: '/products/:id/costs/:costId', description: 'Update a product cost entry.', scopes: ['products:write'], isWrite: true, params: [{ name: 'id', type: 'uuid', required: true, description: 'Product ID', in: 'path' }, { name: 'costId', type: 'uuid', required: true, description: 'Cost entry ID', in: 'path' }] },
    { method: 'DELETE', path: '/products/:id/costs/:costId', description: 'Delete a product cost entry.', scopes: ['products:write'], isWrite: true, params: [{ name: 'id', type: 'uuid', required: true, description: 'Product ID', in: 'path' }, { name: 'costId', type: 'uuid', required: true, description: 'Cost entry ID', in: 'path' }] },
  ],
};
