# State Management Architecture

Complete guide to state management in the KENZ perfume store frontend.

---

## Architecture Overview

The application uses a **clear separation** between **Server State** and **Client State**:

```
┌─────────────────────────────────────────────────────────────┐
│                     State Architecture                       │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  SERVER STATE                    CLIENT STATE                │
│  (TanStack React Query)          (Zustand)                   │
│                                                              │
│  • Products                      • UI state                  │
│  • Categories                    • Theme                     │
│  • Brands                        • Mobile nav open/closed    │
│  • Cart                          • Search overlay            │
│  • Wishlist                      • Cart drawer                │
│  • Orders                        • Modal states              │
│  • User                          • Temporary filters         │
│  • Authentication                • Loading overlays          │
│  • AI chat                                                   │
│  • Payments                                                  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Server State (React Query)

### Responsibilities

TanStack React Query manages all **server-synchronized data**:
- Fetching from API
- Caching responses
- Background refetching
- Stale time management
- Loading/error states
- Mutations
- Cache invalidation
- Optimistic updates

### Configuration

**Location:** `src/lib/query-client.ts`

```typescript
{
  queries: {
    staleTime: 2 * 60 * 1000,        // 2 minutes default
    gcTime: 10 * 60 * 1000,          // 10 minutes garbage collection
    retry: (failureCount, error) => {
      // Don't retry auth errors (401/403)
      // Don't retry client errors (400-499)
      // Retry once for server/network errors
    },
    refetchOnWindowFocus: false,     // Manual refresh only
    refetchOnReconnect: false,       // No auto-refetch
    refetchOnMount: true,            // Refetch if data is stale
  },
  mutations: {
    retry: 0,                        // Never auto-retry mutations
  },
}
```

### Stale Time Strategy

Different data types have different freshness requirements:

| Data Type | Stale Time | Rationale |
|-----------|------------|-----------|
| Cart | 0ms | Always fresh - changes frequently |
| Wishlist | 2 minutes | Relatively stable |
| Products (list) | 5 minutes | Catalog data - infrequent changes |
| Products (detail) | 10 minutes | Individual product - very stable |
| Categories | 5 minutes | Rarely changes |
| Brands | 5 minutes | Rarely changes |
| Orders | 2 minutes | Status can change |
| Current User | 5 minutes | Rarely changes during session |

---

## Query Keys

### Structure

**Location:** `src/lib/query-keys.ts`

Query keys are hierarchical for targeted invalidation:

```typescript
// Hierarchical pattern
['resource']                      // Invalidates everything
['resource', 'list']              // Invalidates all lists
['resource', 'list', filters]     // Invalidates specific list
['resource', 'detail']            // Invalidates all details
['resource', 'detail', id]        // Invalidates specific detail
```

### Examples

```typescript
// Products
queryKeys.products.all              // ['products']
queryKeys.products.lists()          // ['products', 'list']
queryKeys.products.list({ gender: 'MALE' })  // ['products', 'list', { gender: 'MALE' }]
queryKeys.products.details()        // ['products', 'detail']
queryKeys.products.detail('abc123') // ['products', 'detail', 'abc123']

// Cart
queryKeys.cart.all                  // ['cart']
queryKeys.cart.current()            // ['cart', 'current']

// Orders
queryKeys.orders.all                // ['orders']
queryKeys.orders.lists()            // ['orders', 'list']
queryKeys.orders.list({ status: 'PENDING' })  // ['orders', 'list', { status: 'PENDING' }]
queryKeys.orders.detail('order-1')  // ['orders', 'detail', 'order-1']
```

---

## Cache Invalidation Strategy

### Mutation Invalidation Rules

After mutations, invalidate related queries strategically:

#### Products

```typescript
// Create product
useCreateProduct() → invalidate queryKeys.products.lists()

// Update product
useUpdateProduct() → invalidate:
  - queryKeys.products.detail(id)
  - queryKeys.products.lists()

// Delete product
useDeleteProduct() → invalidate queryKeys.products.lists()

// Update stock
useUpdateProductStock() → invalidate:
  - queryKeys.products.detail(id)
  - queryKeys.products.lists()
```

#### Cart

```typescript
// Add to cart
useAddToCart() → optimistic update → setQueryData

// Update cart item
useUpdateCartItem() → optimistic update → setQueryData

// Remove cart item
useRemoveCartItem() → optimistic update → setQueryData

// Clear cart
useClearCart() → invalidate queryKeys.cart.all
```

#### Wishlist

```typescript
// Add to wishlist
useAddToWishlist() → optimistic update → setQueryData

// Remove from wishlist
useRemoveFromWishlist() → optimistic update → setQueryData
```

#### Orders

```typescript
// Create order
useCreateOrder() → invalidate:
  - queryKeys.orders.lists()
  - queryKeys.cart.all (cart is now empty)

// Cancel order
useCancelOrder() → invalidate:
  - queryKeys.orders.detail(id)
  - queryKeys.orders.lists()
```

---

## Optimistic Updates

### When to Use

Optimistic updates improve perceived performance for operations where:
1. User expects instant feedback
2. Operation is likely to succeed
3. Failure can be gracefully rolled back

### Implementation Pattern

```typescript
useMutation({
  mutationFn: apiCall,
  
  // Before mutation
  onMutate: async (variables) => {
    // 1. Cancel outgoing refetches
    await queryClient.cancelQueries({ queryKey });
    
    // 2. Snapshot previous value
    const previous = queryClient.getQueryData(queryKey);
    
    // 3. Optimistically update cache
    queryClient.setQueryData(queryKey, (old) => {
      // Return new optimistic data
    });
    
    // 4. Return context for rollback
    return { previous };
  },
  
  // On success
  onSuccess: (data) => {
    // Update with real server data
    queryClient.setQueryData(queryKey, data);
  },
  
  // On error
  onError: (error, variables, context) => {
    // Rollback to previous value
    if (context?.previous) {
      queryClient.setQueryData(queryKey, context.previous);
    }
  },
  
  // Always
  onSettled: () => {
    // Refetch to ensure consistency
    queryClient.invalidateQueries({ queryKey });
  },
});
```

### Optimistic Operations

| Operation | Optimistic? | Reason |
|-----------|-------------|--------|
| Add to cart | ✅ Yes | High success rate, instant feedback expected |
| Update cart quantity | ✅ Yes | Immediate UI update expected |
| Remove from cart | ✅ Yes | User expects instant removal |
| Clear cart | ❌ No | Destructive, less frequent |
| Add to wishlist | ✅ Yes | Toggle behavior, instant feedback |
| Remove from wishlist | ✅ Yes | Toggle behavior, instant feedback |
| Create order | ❌ No | Financial transaction, must be confirmed |
| Cancel order | ❌ No | Status-dependent, must verify |
| Payment operations | ❌ No | Financial, never optimize |

---

## Client State (Zustand)

### Responsibilities

Zustand manages **browser/application-only state**:
- UI state (modals, drawers, overlays)
- Theme preferences (if not using ThemeProvider)
- Temporary view state
- Client-side filters/preferences
- Loading overlays for blocking operations

### Rules

**NEVER store in Zustand:**
- ❌ Products
- ❌ Categories
- ❌ Brands
- ❌ Cart items
- ❌ Wishlist items
- ❌ Orders
- ❌ User data
- ❌ Any server-synchronized data

**DO store in Zustand:**
- ✅ Mobile nav open/closed
- ✅ Search overlay open/closed
- ✅ Cart drawer open/closed
- ✅ Modal/dialog state
- ✅ Global loading overlays
- ✅ Client-side filter state (before search)
- ✅ Temporary checkout state (before submission)

### Stores

#### UI Store

**Location:** `src/stores/ui.store.ts`

Manages global UI state:

```typescript
interface UIState {
  // Mobile Navigation
  isMobileNavOpen: boolean;
  openMobileNav: () => void;
  closeMobileNav: () => void;
  toggleMobileNav: () => void;

  // Search Overlay
  isSearchOpen: boolean;
  openSearch: () => void;
  closeSearch: () => void;
  toggleSearch: () => void;

  // Cart Drawer
  isCartDrawerOpen: boolean;
  openCartDrawer: () => void;
  closeCartDrawer: () => void;
  toggleCartDrawer: () => void;

  // Global Loading
  isGlobalLoading: boolean;
  setGlobalLoading: (loading: boolean) => void;
}
```

**Usage:**

```typescript
// Component usage - selective subscription
const isCartDrawerOpen = useUIStore((state) => state.isCartDrawerOpen);
const openCartDrawer = useUIStore((state) => state.openCartDrawer);

// Avoid (causes unnecessary re-renders):
const store = useUIStore(); // subscribes to ALL state
```

#### Auth Store

**Location:** `src/stores/auth.store.ts`

Manages authentication tokens and syncs user data from React Query:

```typescript
interface AuthState {
  // Tokens (persisted to localStorage)
  accessToken: string | null;
  refreshToken: string | null;

  // User (synced from React Query)
  user: User | null;

  // Actions
  setTokens: (accessToken: string, refreshToken: string) => void;
  setUser: (user: User | null) => void;
  clearAuth: () => void;

  // Computed
  isAuthenticated: () => boolean;
  isAdmin: () => boolean;
}
```

**Important:**
- Tokens are persisted to `localStorage` via Zustand persist middleware
- User data is NOT persisted - it's fetched from server via `useCurrentUser()` hook
- Auth store and React Query work together:
  - Store holds tokens
  - React Query holds user data
  - Store syncs user data for convenience

---

## Authentication Flow

### Login/Register

```typescript
const { mutate: login } = useLogin();

login(credentials, {
  onSuccess: (data) => {
    // Automatically handled by hook:
    // 1. Store tokens in auth store
    // 2. Set user in auth store
    // 3. Set user in React Query cache
  },
});
```

### Token Refresh

**Location:** `src/lib/axios.ts`

Automatic token refresh on 401:

```
1. Request fails with 401
   ↓
2. Interceptor checks if refresh is in progress
   ↓
3. If yes: Queue request
   If no: Start refresh
   ↓
4. Call /auth/refresh with refresh token
   ↓
5. On success:
   - Store new tokens
   - Retry original request
   - Retry all queued requests
   ↓
6. On failure:
   - Clear tokens
   - Reject all queued requests
   - Let app handle logout
```

### Logout

```typescript
const { mutate: logout } = useLogout();

logout(undefined, {
  onSuccess: () => {
    // Automatically handled by hook:
    // 1. Clear auth store (tokens + user)
    // 2. Clear React Query cache
    // 3. Navigate to login (app responsibility)
  },
});
```

### Current User

```typescript
const { data: user, isLoading } = useCurrentUser();

// Hook automatically:
// - Only fetches if tokens exist
// - Syncs user data to auth store
// - Sets user to null on error
```

---

## Error Handling

### Error Normalization

**Location:** `src/lib/api-error-handler.ts`

All API errors are normalized to consistent structure:

```typescript
interface NormalizedApiError {
  status: number;
  message: string;
  type: 'network' | 'timeout' | 'validation' | 'unauthorized' | 
        'forbidden' | 'not_found' | 'conflict' | 'rate_limit' | 
        'server' | 'unknown';
  validationErrors?: Record<string, string[]>;
  code?: string;
  originalError?: unknown;
}
```

### Error Handling Pattern

```typescript
const { mutate, error, isError } = useMutation({
  mutationFn: apiCall,
  onError: (error: NormalizedApiError) => {
    // Handle different error types
    if (error.type === 'validation') {
      // Show field-level errors
      error.validationErrors?.forEach((field, errors) => {
        // Display errors for field
      });
    } else if (error.type === 'unauthorized') {
      // Redirect to login (token refresh already attempted)
    } else {
      // Show generic error toast
      toast.error(error.message);
    }
  },
});
```

---

## Toast Handling

### Pattern

**DO NOT** call `toast()` directly from API services. Use mutation callbacks:

```typescript
// ❌ WRONG - Inside API service
export async function createProduct(data) {
  const response = await apiClient.post('/products', data);
  toast.success('Product created!'); // NO!
  return response;
}

// ✅ CORRECT - In mutation callback
const { mutate } = useCreateProduct();

mutate(productData, {
  onSuccess: () => {
    toast.success('Product created successfully!');
  },
  onError: (error) => {
    toast.error(error.message);
  },
});
```

### Layer Separation

```
API Service
    ↓
React Query Mutation
    ↓
Success/Error Callback
    ↓
Toast (Sonner)
```

This keeps API layer framework-agnostic and testable.

---

## Persistence

### What to Persist

| Data | Persist? | Location | Reason |
|------|----------|----------|--------|
| Auth tokens | ✅ Yes | localStorage | Maintain session |
| User data | ❌ No | Memory only | Always fresh from server |
| Cart | ❌ No | Server | Synced with backend |
| Wishlist | ❌ No | Server | Synced with backend |
| Theme | ✅ Yes | localStorage | User preference |
| UI state | ❌ No | Memory only | Transient |

### Implementation

```typescript
// Zustand persist middleware
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // ... store implementation
    }),
    {
      name: 'kenz-auth-storage',
      partialize: (state) => ({
        // Only persist tokens
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      }),
    }
  )
);
```

---

## Performance

### Selective Subscriptions

```typescript
// ❌ BAD - Subscribes to entire store
const store = useUIStore();

// ✅ GOOD - Subscribes to specific slice
const isSearchOpen = useUIStore((state) => state.isSearchOpen);
const openSearch = useUIStore((state) => state.openSearch);
```

### Query Optimization

```typescript
// Enable only when needed
useQuery({
  queryKey: ['user', userId],
  queryFn: () => fetchUser(userId),
  enabled: !!userId, // Don't fetch if no userId
});

// Use stale time appropriately
useQuery({
  queryKey: ['products'],
  queryFn: fetchProducts,
  staleTime: 5 * 60 * 1000, // 5 minutes for catalog data
});
```

---

## Development Patterns

### Adding New Server State

1. Create API service function in `src/services/api/[domain]/`
2. Add query key to `src/lib/query-keys.ts`
3. Create React Query hook in `src/hooks/api/use-[domain].ts`
4. Use hook in component

Example:

```typescript
// 1. Service
export async function getReviews(productId: string) {
  const { data } = await apiClient.get(`/products/${productId}/reviews`);
  return data.data;
}

// 2. Query key
queryKeys.reviews = {
  all: ['reviews'] as const,
  list: (productId: string) => [...queryKeys.reviews.all, productId] as const,
};

// 3. Hook
export function useReviews(productId: string) {
  return useQuery({
    queryKey: queryKeys.reviews.list(productId),
    queryFn: () => getReviews(productId),
    enabled: !!productId,
  });
}

// 4. Component
const { data: reviews, isLoading } = useReviews(productId);
```

### Adding New Client State

1. Determine if state is truly client-only
2. Add to appropriate Zustand store (or create new store)
3. Use selective subscription in components

```typescript
// 1. Add to store
interface UIState {
  isFilterDrawerOpen: boolean;
  openFilterDrawer: () => void;
  closeFilterDrawer: () => void;
}

// 2. Use in component
const isOpen = useUIStore((state) => state.isFilterDrawerOpen);
const close = useUIStore((state) => state.closeFilterDrawer);
```

---

## Anti-Patterns

### ❌ DON'T

```typescript
// Don't store server data in Zustand
interface ProductsStore {
  products: Product[];
  fetchProducts: () => Promise<void>;
}

// Don't duplicate React Query in Zustand
const useCartStore = create((set) => ({
  cart: null,
  fetchCart: async () => {
    const cart = await getCart();
    set({ cart });
  },
}));

// Don't mix concerns
const useStore = create((set) => ({
  products: [],      // Server state ❌
  isNavOpen: false,  // Client state ✅
}));
```

### ✅ DO

```typescript
// Server state in React Query
const { data: products } = useProducts();

// Client state in Zustand
const isNavOpen = useUIStore((state) => state.isMobileNavOpen);

// Clear separation
```

---

## Summary

### State Responsibilities

| Concern | Tool | Location |
|---------|------|----------|
| Server data | React Query | `src/hooks/api/` |
| API calls | Axios + Services | `src/services/api/` |
| Query keys | Constants | `src/lib/query-keys.ts` |
| Query config | QueryClient | `src/lib/query-client.ts` |
| Client UI state | Zustand | `src/stores/ui.store.ts` |
| Auth tokens | Zustand | `src/stores/auth.store.ts` |
| Error handling | Axios interceptor | `src/lib/api-error-handler.ts` |

### Decision Tree

```
Is this data from the server?
├─ Yes → Use React Query
│  ├─ Create API service
│  ├─ Add query key
│  └─ Create React Query hook
│
└─ No → Use Zustand
   ├─ Is it global UI state? → ui.store
   ├─ Is it auth-related? → auth.store
   └─ Is it domain-specific? → Create new store
```

### Key Principles

1. **Never duplicate server state** - React Query is the single source of truth
2. **Use optimistic updates sparingly** - Only for safe, user-expected operations
3. **Invalidate strategically** - Don't clear entire cache unnecessarily
4. **Separate concerns** - API services ≠ Toast calls
5. **Persist only what's necessary** - Most state should be transient
6. **Use selective subscriptions** - Avoid unnecessary re-renders

---

## Next Steps

When implementing features:

1. ✅ Use existing hooks from `src/hooks/api/`
2. ✅ Use existing stores from `src/stores/`
3. ✅ Follow established patterns
4. ✅ Add new hooks/stores only when genuinely needed
5. ✅ Maintain clear separation between server/client state

The state architecture is **production-ready** and designed to scale with the application.
