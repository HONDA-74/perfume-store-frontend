/**
 * Orders API service.
 * Matches backend orders endpoints exactly.
 * 
 * Backend endpoints:
 * POST   /api/v1/orders
 * GET    /api/v1/orders
 * GET    /api/v1/orders/:id
 * PATCH  /api/v1/orders/:id/status (admin)
 * PATCH  /api/v1/orders/:id/cancel (customer)
 */

import { apiClient } from '@/lib';
import { normalizePaginatedResponse } from '@/services/api/pagination';
import type {
  ApiPaginatedResponse,
  ApiSuccessResponse,
  PaginatedData,
  Order,
  CreateOrderDto,
  OrderQueryParams,
  OrderStatus,
} from '@/types';

/**
 * Fetch paginated list of user's orders.
 */
export async function getOrders(
  params?: OrderQueryParams
): Promise<PaginatedData<Order>> {
  const { data } = await apiClient.get<ApiPaginatedResponse<Order>>(
    '/orders',
    { params }
  );
  return normalizePaginatedResponse(data);
}

/**
 * Fetch single order by ID.
 */
export async function getOrder(id: string): Promise<Order> {
  const { data } = await apiClient.get<ApiSuccessResponse<Order>>(
    `/orders/${id}`
  );
  return data.data;
}

/**
 * Create new order from cart.
 * Backend converts cart items and references the saved address.
 */
export async function createOrder(payload: CreateOrderDto): Promise<Order> {
  const { data } = await apiClient.post<ApiSuccessResponse<Order>>(
    '/orders',
    payload
  );
  return data.data;
}

/**
 * Update order status (admin only).
 */
export async function updateOrderStatus(
  id: string,
  status: OrderStatus
): Promise<Order> {
  const { data } = await apiClient.patch<ApiSuccessResponse<Order>>(
    `/orders/${id}/status`,
    { status }
  );
  return data.data;
}

/**
 * Cancel order (customer).
 */
export async function cancelOrder(id: string): Promise<Order> {
  const { data } = await apiClient.patch<ApiSuccessResponse<Order>>(
    `/orders/${id}/cancel`
  );
  return data.data;
}
