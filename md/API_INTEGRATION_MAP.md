# API Integration Map

Complete mapping of backend API endpoints to frontend Data Layer implementation.

**Backend Base URL:** `http://localhost:3000/api/v1`  
**Environment Variable:** `VITE_API_BASE_URL`

---

## Authentication

| Endpoint | Method | Auth | Role | Service | Hook | Query Key | Description |
|----------|--------|------|------|---------|------|-----------|-------------|
| `/auth/register` | POST | ❌ | Public | `authApi.register()` | `useRegister()` | - | Register new user |
| `/auth/login` | POST | ❌ | Public | `authApi.login()` | `useLogin()` | - | Login user |
| `/auth/logout` | POST | ✅ | Any | `authApi.logout()` | `useLogout()` | - | Logout user |
| `/auth/refresh` | POST | ❌ | Public | `authApi.refreshToken()` | - | - | Refresh access token |
| `/auth/me` | GET | ✅ | Any | `authApi.getCurrentUser()` | `useCurrentUser()` | `auth.user()` | Get current user |

### Request/Response Contracts

**Register/Login Response:**
```typescript
{
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    fullName: string;
    role: 'CUSTOMER' | 'ADMIN';
  };
}
```

**Refresh Response:**
```typescript
{
  accessToken: string;
  refreshToken: string;
}
```

### Cache Invalidation
- Login/Register → Set `auth.user()` cache
- Logout → Clear all cache

---

## Products

| Endpoint | Method | Auth | Role | Service | Hook | Query Key | Description |
|----------|--------|------|------|---------|------|-----------|-------------|
| `/products` | GET | ❌ | Public | `productsApi.getProducts()` | `useProducts()` | `products.list(filters)` | List products with pagination/filters |
| `/products/:idOrSlug` | GET | ❌ | Public | `productsApi.getProduct()` | `useProduct()` | `products.detail(id)` | Get single product |
| `/products` | POST | ✅ | ADMIN | `productsApi.createProduct()` | `useCreateProduct()` | - | Create product |
| `/products/:id` | PATCH | ✅ | ADMIN | `productsApi.updateProduct()` | `useUpdateProduct()` | - | Update product |
| `/products/:id` | DELETE | ✅ | ADMIN | `productsApi.deleteProduct()` | `useDeleteProduct()` | - | Delete product |
| `/products/:id/stock` | PATCH | ✅ | ADMIN | `productsApi.updateProductStock()` | `useUpdateProductStock()` | - | Update product stock |

### Request/Response Contracts

**Product Shape:**
```typescript
{
  id: string;
  name: string;
  slug: string;
  sku: string;
  categoryId: string;
  brandId: string;
  description: string;
  price: number;
  discountPrice?: number;
  stockQuantity: number;
  gender: 'MALE' | 'FEMALE' | 'UNISEX';
  concentration: 'PARFUM' | 'EDP' | 'EDT' | 'EDC';
  sizeMl: number;
  notes: {
    top: string[];
    middle: string[];
    base: string[];
  };
  images: string[];
  isActive: boolean;
  isFeatured: boolean;
  ratingAverage: number;
  ratingCount: number;
  createdAt: string;
  updatedAt: string;
}
```

**Query Parameters:**
- `page`, `limit` (pagination)
- `brandId`, `categoryId` (filtering)
- `gender`, `concentration` (filtering)
- `minPrice`, `maxPrice` (filtering)
- `inStock`, `featured` (filtering)
- `search` (text search)

### Cache Invalidation
- Create/Update/Delete Product → Invalidate `products.lists()`
- Update Stock → Invalidate specific product and lists

---

## Categories

| Endpoint | Method | Auth | Role | Service | Hook | Query Key | Description |
|----------|--------|------|------|---------|------|-----------|-------------|
| `/categories` | GET | ❌ | Public | `categoriesApi.getCategories()` | `useCategories()` | `categories.list()` | List all categories |
| `/categories/:idOrSlug` | GET | ❌ | Public | `categoriesApi.getCategory()` | `useCategory()` | `categories.detail(id)` | Get single category |
| `/categories` | POST | ✅ | ADMIN | `categoriesApi.createCategory()` | `useCreateCategory()` | - | Create category |
| `/categories/:id` | PATCH | ✅ | ADMIN | `categoriesApi.updateCategory()` | `useUpdateCategory()` | - | Update category |
| `/categories/:id` | DELETE | ✅ | ADMIN | `categoriesApi.deleteCategory()` | `useDeleteCategory()` | - | Delete category |

### Cache Invalidation
- Create/Update/Delete Category → Invalidate `categories.lists()`

---

## Brands

| Endpoint | Method | Auth | Role | Service | Hook | Query Key | Description |
|----------|--------|------|------|---------|------|-----------|-------------|
| `/brands` | GET | ❌ | Public | `brandsApi.getBrands()` | `useBrands()` | `brands.list()` | List all brands |
| `/brands/:idOrSlug` | GET | ❌ | Public | `brandsApi.getBrand()` | `useBrand()` | `brands.detail(id)` | Get single brand |
| `/brands` | POST | ✅ | ADMIN | `brandsApi.createBrand()` | `useCreateBrand()` | - | Create brand |
| `/brands/:id` | PATCH | ✅ | ADMIN | `brandsApi.updateBrand()` | `useUpdateBrand()` | - | Update brand |
| `/brands/:id` | DELETE | ✅ | ADMIN | `brandsApi.deleteBrand()` | `useDeleteBrand()` | - | Delete brand |

### Cache Invalidation
- Create/Update/Delete Brand → Invalidate `brands.lists()`

---

## Cart

| Endpoint | Method | Auth | Role | Service | Hook | Query Key | Description |
|----------|--------|------|------|---------|------|-----------|-------------|
| `/cart` | GET | ✅ | CUSTOMER | `cartApi.getCart()` | `useCart()` | `cart.current()` | Get user's cart |
| `/cart` | DELETE | ✅ | CUSTOMER | `cartApi.clearCart()` | `useClearCart()` | - | Clear cart |
| `/cart/items` | POST | ✅ | CUSTOMER | `cartApi.addToCart()` | `useAddToCart()` | - | Add item to cart |
| `/cart/items/:productId` | PATCH | ✅ | CUSTOMER | `cartApi.updateCartItem()` | `useUpdateCartItem()` | - | Update cart item quantity |
| `/cart/items/:productId` | DELETE | ✅ | CUSTOMER | `cartApi.removeCartItem()` | `useRemoveCartItem()` | - | Remove cart item |

### Request/Response Contracts

**Cart Shape:**
```typescript
{
  id: string;
  userId: string;
  items: Array<{
    productId: string;
    quantity: number;
    priceAtAdd: number;
  }>;
  subtotal: number;
  total: number;
  createdAt: string;
  updatedAt: string;
}
```

**IMPORTANT:** Cart items contain minimal data. Use `productId` to fetch full product details if needed.

### Cache Invalidation
- Add/Update/Remove Cart Item → Update `cart.current()` cache
- Clear Cart → Invalidate `cart.all`

---

## Wishlist

| Endpoint | Method | Auth | Role | Service | Hook | Query Key | Description |
|----------|--------|------|------|---------|------|-----------|-------------|
| `/wishlist` | GET | ✅ | CUSTOMER | `wishlistApi.getWishlist()` | `useWishlist()` | `wishlist.current()` | Get user's wishlist |
| `/wishlist/items/:productId` | POST | ✅ | CUSTOMER | `wishlistApi.addToWishlist()` | `useAddToWishlist()` | - | Add item to wishlist |
| `/wishlist/items/:productId` | DELETE | ✅ | CUSTOMER | `wishlistApi.removeFromWishlist()` | `useRemoveFromWishlist()` | - | Remove item from wishlist |

### Request/Response Contracts

**Wishlist Shape:**
```typescript
{
  id: string;
  userId: string;
  items: Array<{
    productId: string;
    addedAt: string;
  }>;
  createdAt: string;
  updatedAt: string;
}
```

**IMPORTANT:** `productId` is in URL path, not request body.

### Cache Invalidation
- Add/Remove Wishlist Item → Update `wishlist.current()` cache

---

## Orders

| Endpoint | Method | Auth | Role | Service | Hook | Query Key | Description |
|----------|--------|------|------|---------|------|-----------|-------------|
| `/orders` | GET | ✅ | CUSTOMER | `ordersApi.getOrders()` | `useOrders()` | `orders.list(filters)` | List user's orders |
| `/orders/:id` | GET | ✅ | CUSTOMER | `ordersApi.getOrder()` | `useOrder()` | `orders.detail(id)` | Get single order |
| `/orders` | POST | ✅ | CUSTOMER | `ordersApi.createOrder()` | `useCreateOrder()` | - | Create order from cart |
| `/orders/:id/status` | PATCH | ✅ | ADMIN | `ordersApi.updateOrderStatus()` | - | - | Update order status |
| `/orders/:id/cancel` | PATCH | ✅ | CUSTOMER | `ordersApi.cancelOrder()` | `useCancelOrder()` | - | Cancel order |

### Request/Response Contracts

**Create Order Request:**
```typescript
{
  addressId: string; // References saved address
}
```

**Order Shape:**
```typescript
{
  id: string;
  orderNumber: string;
  userId: string;
  items: Array<{
    productId: string;
    nameSnapshot: string;
    priceSnapshot: number;
    quantity: number;
    lineTotal: number;
  }>;
  shippingAddress: Address;
  subtotal: number;
  discountTotal: number;
  shippingFee: number;
  total: number;
  status: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  paymentStatus: 'UNPAID' | 'PAID' | 'FAILED' | 'REFUNDED';
  placedAt: string;
  cancelledAt: string | null;
  createdAt: string;
  updatedAt: string;
}
```

**IMPORTANT:** Backend converts cart items into order items. Frontend only sends `addressId`.

### Cache Invalidation
- Create Order → Invalidate `orders.lists()` and `cart.all`
- Cancel Order → Invalidate specific order and `orders.lists()`

---

## Payments

| Endpoint | Method | Auth | Role | Service | Hook | Query Key | Description |
|----------|--------|------|------|---------|------|-----------|-------------|
| `/payments/create-intent` | POST | ✅ | CUSTOMER | `paymentsApi.createPaymentIntent()` | `useCreatePaymentIntent()` | - | Create Stripe payment intent |
| `/payments/webhook` | POST | ❌ | Stripe | - | - | - | Stripe webhook (not called by frontend) |
| `/payments/refund/:orderId` | POST | ✅ | ADMIN | `paymentsApi.refundOrder()` | `useRefundOrder()` | - | Refund order |

### Request/Response Contracts

**Create Payment Intent:**
```typescript
Request: {
  orderId: string;
}

Response: {
  clientSecret: string;
  amount: number;
  currency: string;
}
```

**IMPORTANT:** Webhook endpoint is for Stripe only. Not exposed in frontend Data Layer.

---

## AI Chat

| Endpoint | Method | Auth | Role | Service | Hook | Query Key | Description |
|----------|--------|------|------|---------|------|-----------|-------------|
| `/ai/chat` | POST | ✅ | CUSTOMER | `aiApi.sendChatMessage()` | `useSendChatMessage()` | - | Send AI chat message (normal) |
| `/ai/chat/stream` | POST | ✅ | CUSTOMER | `aiApi.sendChatMessageStream()` | `useSendChatMessageStream()` | - | Send AI chat message (streaming SSE) |

### Request/Response Contracts

**Chat Request:**
```typescript
{
  messages: Array<{
    role: 'user' | 'assistant';
    content: string;
  }>;
}
```

**Normal Response:**
```typescript
{
  message: string;
  recommendations?: string[];
}
```

**Streaming:** Uses Server-Sent Events (SSE). Each chunk:
```typescript
{
  delta: string;
  done: boolean;
}
```

**IMPORTANT:** Streaming uses native `fetch` API, not Axios, for proper SSE support.

---

## Authentication Flow

### Token Storage
- Access Token: Short-lived, sent in `Authorization: Bearer <token>` header
- Refresh Token: Long-lived, used to obtain new access token

### Token Refresh
1. Request fails with 401
2. Interceptor attempts refresh using `/auth/refresh`
3. If refresh succeeds:
   - Store new tokens
   - Retry original request
   - Process queued requests
4. If refresh fails:
   - Clear tokens
   - Reject all queued requests
   - Allow app to handle logout

### Concurrent 401 Handling
- Only one refresh attempt at a time
- Additional 401 requests queue and wait
- All queued requests retry with new token

---

## Error Handling

All errors are normalized to:
```typescript
{
  status: number;
  message: string;
  type: 'network' | 'timeout' | 'validation' | 'unauthorized' | 'forbidden' | 'not_found' | 'conflict' | 'rate_limit' | 'server' | 'unknown';
  validationErrors?: Record<string, string[]>;
  code?: string;
  originalError?: unknown;
}
```

### HTTP Status Codes
- `400` - Bad Request (validation)
- `401` - Unauthorized (triggers token refresh)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `409` - Conflict
- `422` - Validation Error (with field-level errors)
- `429` - Rate Limited
- `500+` - Server Error

---

## Pagination

List endpoints return:
```typescript
{
  data: T[];
  meta: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
}
```

Query parameters:
- `page` - Page number (1-indexed)
- `limit` - Items per page

---

## Summary

### Total Endpoints: 38

- **Auth:** 5 endpoints
- **Products:** 6 endpoints
- **Categories:** 5 endpoints
- **Brands:** 5 endpoints
- **Cart:** 5 endpoints
- **Wishlist:** 3 endpoints
- **Orders:** 5 endpoints
- **Payments:** 3 endpoints (1 not exposed to frontend)
- **AI:** 2 endpoints

### Implementation Status: ✅ Complete

All 38 backend endpoints are integrated in the frontend Data Layer with:
- Type-safe service functions
- React Query hooks
- Proper cache management
- Token refresh flow
- Normalized error handling
- SSE streaming support for AI
