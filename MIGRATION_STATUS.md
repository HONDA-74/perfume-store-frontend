# Frontend UI Migration Status

## Completed: Phase 1-3 ✅

### Phase 1: Foundation & Adapters ✅
**Status**: Complete

**Created Files**:
- `src/lib/adapters/product-adapter.ts` - Maps backend Product → UI format
- `src/lib/adapters/address-adapter.ts` - Maps backend/frontend address formats
- `src/lib/adapters/enum-adapter.ts` - Maps backend enums → UI labels
- `src/lib/adapters/collection-adapter.ts` - Maps Category → Collection UI
- `src/lib/adapters/index.ts` - Barrel export

**Modified Files**:
- `src/styles/tokens.css` - Added KENZ dark luxury tokens
- `src/styles/globals.css` - Added KENZ utilities and animations
- `src/components/collection/AccordionGallery.tsx` - Fixed React 19 ref callbacks

**Validation**: ✅ TypeScript passes, build succeeds

---

### Phase 2: Shared Components ✅
**Status**: Complete

**Created Components** (all in `src/components/shared/`):
1. `price.tsx` - Real price display with currency formatting
2. `rating.tsx` - Star rating component
3. `product-badge.tsx` - Product badges (NEW, SALE, LOW_STOCK, OUT_OF_STOCK)
4. `quantity-selector.tsx` - Quantity input with +/- controls
5. `empty-state.tsx` - Empty state with icon/title/action
6. `page-loader.tsx` - Full-page loading spinner
7. `section-header.tsx` - Section title with optional subtitle
8. `breadcrumb.tsx` - Breadcrumb navigation
9. `product-card.tsx` - Main product card with real hooks
10. `product-card-compact.tsx` - Compact product card variant

**Hook Integration**:
- ProductCard uses `useAddToCart()`, `useToggleWishlist()`, `useIsInWishlist()`
- All hooks are React Query mutations/queries with proper caching
- No N+1 issues - wishlist query is shared across all ProductCards
- Optimistic updates with rollback on error

**Validation**: ✅ Verified React Query cache behavior is safe

---

### Phase 3: Layouts & Global UI ✅
**Status**: Complete

**Created Layout Components**:
1. **Header** (`src/components/layouts/header.tsx`)
   - Real cart count from `useCartCount()`
   - Real wishlist count from `useWishlistCount()`
   - Real auth state from `useAuthStore()`
   - Desktop + mobile navigation
   - Opens search/cart/mobile nav via `useUIStore()`

2. **CartDrawer** (`src/components/layouts/cart-drawer.tsx`)
   - Uses `useEnrichedCart()` - fetches product data for cart items
   - Real mutations: `useUpdateCartItem()`, `useRemoveCartItem()`
   - Optimistic updates
   - Shares state with /cart page via React Query
   - Quantity controls, remove items, subtotal, checkout/view cart actions

3. **SearchOverlay** (`src/components/layouts/search-overlay.tsx`)
   - Debounced search (300ms)
   - Real `useProducts()` hook with search param
   - Loading, empty, error states
   - Displays ProductCardCompact results

4. **MobileNav** (`src/components/layouts/mobile-nav.tsx`)
   - Real auth state
   - Navigation links match desktop
   - User info display (fullName, email)
   - Login/logout actions

5. **Footer** (`src/components/layouts/footer.tsx`)
   - Real routes only
   - KENZ branding
   - Customer care, shop, info sections

**Updated Files**:
- `src/components/layouts/root-layout.tsx` - Integrated with useUIStore, renders new layouts
- `src/stores/ui.store.ts` - Added `closeAll()` utility
- `src/stores/auth.store.ts` - Added `logout()` method
- `src/lib/query-keys.ts` - Added `cart.enriched()` key

**New Hook**:
- `useEnrichedCart()` in `src/hooks/api/use-cart.ts`
  - Fetches cart from backend
  - Fetches all products for cart items
  - Returns `EnrichedCart` with `items: EnrichedCartItem[]`
  - Each item includes full `product: Product` data

**Architecture Decisions**:
1. **Cart with Product Data**: Backend cart API returns only `{ productId, quantity, priceAtAdd }`. Created `useEnrichedCart()` to fetch products separately. Alternative would be backend endpoint that populates products, but that doesn't exist.

2. **Mutation Invalidation**: All cart mutations invalidate `queryKeys.cart.all` to refresh both `current()` and `enriched()` queries.

3. **Auth State**: `isAuthenticated()` is a function, not boolean. Fixed all components to call it.

4. **UI State Management**: useUIStore manages overlay open/close state globally. RootLayout listens to route changes and closes all overlays.

**Validation**: ✅ TypeScript passes, build succeeds, no console errors

---

## Remaining: Phase 4-8

### Phase 4: Storefront Pages ⏳
**Status**: Not Started

**Pages to Implement**:

#### 1. Shop Page (`src/pages/shop-page.tsx`)
**Requirements**:
- Use `useProducts({ ...filters, page, limit })`
- Use `useBrands()` and `useCategories()` for filter options
- URL-based filter state (`useSearchParams`)
- Reset page to 1 when filters change
- Pagination controls
- Sort options (featured, newest, price asc/desc, rating)
- Filter sidebar: brands, categories, gender, concentration, price range, in stock
- Grid of ProductCard components
- Empty state when no results
- Loading state with PageLoader

**Implementation Pattern**:
```tsx
const [searchParams, setSearchParams] = useSearchParams();
const page = parseInt(searchParams.get('page') || '1');
const brandId = searchParams.get('brandId') || undefined;
// ... other filters

const { data, isLoading } = useProducts({ page, brandId, ... });

// When filter changes:
setSearchParams({ ...currentFilters, page: '1' });
```

**Reference**: `figma-ui/src/app/pages/ShopPage.tsx` for UI structure

---

#### 2. Product Detail Page (`src/pages/product-detail-page.tsx`)
**Requirements**:
- Use `useProduct(slug)` from route param
- Display: gallery, name, brand, price, discount, description, notes, rating, stock, sizeMl
- Add to cart: `useAddToCart()`
- Add to wishlist: `useToggleWishlist()`
- Quantity selector
- Backend only supports single `sizeMl` - no size selection needed
- Breadcrumb navigation
- Related products (optional)

**Implementation Pattern**:
```tsx
const { slug } = useParams();
const { data: product, isLoading } = useProduct(slug!);
const addToCart = useAddToCart();

const handleAddToCart = async () => {
  await addToCart.mutateAsync({
    productId: product.id,
    quantity,
  });
};
```

**Reference**: `figma-ui/src/app/pages/ProductPage.tsx`

---

#### 3. Brands Page (`src/pages/brands-page.tsx`)
**Requirements**:
- Use `useBrands()` to fetch all brands
- Grid display with brand cards (logo, name, product count)
- Link to `/brands/:slug` for brand detail

**Implementation Pattern**:
```tsx
const { data: brands, isLoading } = useBrands();
```

---

#### 4. Brand Detail Page (`src/pages/brand-detail-page.tsx`)
**Requirements**:
- Use `useBrand(slug)` for brand info
- Use `useProducts({ brandId })` for brand's products
- Display brand info + product grid

**Reference**: `figma-ui/src/app/pages/BrandPage.tsx`

---

#### 5. Search Page (`src/pages/search-page.tsx`)
**Requirements**:
- Similar to Shop page but focused on search query
- Use `useProducts({ search: query })`
- Display search query in header
- No complex filters, just sort options

---

#### 6. Cart Page (`src/pages/cart-page.tsx`)
**Requirements**:
- Use same `useEnrichedCart()` as CartDrawer
- Same mutations: `useUpdateCartItem()`, `useRemoveCartItem()`
- Display cart items in table/list format
- Quantity controls
- Remove buttons
- Subtotal, tax estimate (if applicable), total
- Checkout button → `/checkout`
- Continue shopping link

**Architecture**: Must share exact same React Query state as CartDrawer. No duplicate cart logic.

---

#### 7. Wishlist Page (`src/pages/wishlist-page.tsx`)
**Requirements**:
- Use `useWishlist()`
- Fetch products for wishlist items (similar pattern to cart)
- Display ProductCard grid
- Remove from wishlist button
- Add to cart button
- Empty state

**Implementation Pattern**:
```tsx
const { data: wishlist } = useWishlist();
const removeFromWishlist = useRemoveFromWishlist();

// Fetch products for wishlist items
const productQueries = useQueries({
  queries: wishlist?.items.map(item => ({
    queryKey: queryKeys.products.detail(item.productId),
    queryFn: () => productsApi.getProduct(item.productId),
  })) || [],
});
```

---

#### 8. Checkout Page (`src/pages/checkout-page.tsx`)
**Requirements**:
- Use `useEnrichedCart()` for cart summary
- Form: shipping address, payment method
- Address fields must map to backend `CreateOrderDto`:
  ```
  recipientName → split to firstName + lastName
  address + apartment → combine
  city, postalCode, country, phone
  ```
- Payment method: enum from backend
- Use `useCreateOrder()` mutation
- On success: navigate to `/order-success/:orderId`

**Backend Contract**: Check `perfume-store-backend/src/modules/orders/dto/create-order.dto.ts`

**Implementation Pattern**:
```tsx
const createOrder = useCreateOrder();

const handleSubmit = async (formData) => {
  const order = await createOrder.mutateAsync({
    shippingAddress: {
      firstName: formData.firstName,
      lastName: formData.lastName,
      address: `${formData.address}, ${formData.apartment}`,
      city: formData.city,
      postalCode: formData.postalCode,
      country: formData.country,
      phone: formData.phone,
    },
    paymentMethod: formData.paymentMethod,
  });
  navigate(`/order-success/${order.id}`);
};
```

---

#### 9. Order Confirmed Page (`src/pages/order-confirmed-page.tsx`)
**Requirements**:
- Get orderId from route params
- Use `useOrder(orderId)` to fetch order details
- Display order number, items, total, shipping address
- "Continue Shopping" button

---

### Phase 5: Account Pages ⏳
**Status**: Not Started

#### 1. Account Dashboard (`src/pages/account/dashboard-page.tsx`)
**Requirements**:
- Use `useCurrentUser()` for user info
- Display user name, email
- Links to orders, profile, addresses
- Recent orders summary

---

#### 2. Orders Page (`src/pages/account/orders-page.tsx`)
**Requirements**:
- Use `useOrders()` to fetch user orders
- Display order list: order number, date, status, total
- Link to order detail

---

#### 3. Order Detail Page (`src/pages/account/order-detail-page.tsx`)
**Requirements**:
- Use `useOrder(id)` from route param
- Display full order: items, shipping address, payment, status, tracking
- Cancel button if status allows (use `useCancelOrder()`)

---

#### 4. Profile Page (`src/pages/account/profile-page.tsx`)
**Requirements**:
- Display user fullName, email, role
- **IMPORTANT**: Backend has NO PATCH /users/me endpoint
- Display form but disable save, or show "Profile editing not yet supported"
- DO NOT fake profile updates

---

#### 5. Addresses Page (`src/pages/account/addresses-page.tsx`)
**Requirements**:
- Backend has NO address persistence endpoints
- Display message: "Address management coming soon"
- Or show saved addresses from past orders (read-only)
- DO NOT fake address CRUD

---

### Phase 6: Scent Finder ⏳
**Status**: Not Started

**Page**: `src/pages/scent-finder-page.tsx`

**Requirements**:
- Check existing AI hooks: `src/hooks/api/use-ai.ts`
- Backend endpoint: POST /ai/chat
- Multi-step questionnaire UI
- Use `useAIChat()` or similar mutation
- Display AI recommendations
- Show recommended products
- Link to product pages

**DO NOT**:
- Use `figma-ui/src/app/lib/scentFinder.ts` mock logic
- Generate fake AI responses

---

### Phase 7: Admin Pages ⏳
**Status**: Not Started

**Pages to Implement**:
1. Admin Dashboard
2. Admin Products (CRUD)
3. Admin Brands (CRUD)
4. Admin Categories (CRUD)
5. Admin Orders (view, update status)

**Requirements**:
- All use existing admin hooks: `useCreateProduct()`, `useUpdateProduct()`, `useDeleteProduct()`, etc.
- Confirmation modals for destructive actions
- Error handling
- Success feedback
- Query invalidation after mutations

**DO NOT**:
- Use `figma-ui/src/app/lib/adminMockData.ts`
- Display fake dashboard metrics
- If analytics endpoint doesn't exist, show "Analytics coming soon" or derive safe metrics from existing data

---

### Phase 8: Cleanup & Verification ⏳
**Status**: Not Started

**Tasks**:
1. Search entire frontend for imports from:
   - `StoreContext`
   - `mockData`
   - `mockOrders`
   - `adminMockData`
   - `scentFinder` (the mock one)

2. Remove all mock data files after verifying no production imports

3. Remove old/replaced UI components from figma-ui if no longer needed

4. Remove duplicate/unused imports

5. Final verification:
   ```bash
   npm run typecheck
   npm run lint
   npm run build
   ```

6. Manual testing of major flows:
   - Landing → Shop → Product → Add to Cart → Checkout → Order Confirmed
   - Search → Results → Product
   - Account → Orders → Order Detail
   - Admin → Products → Create/Update/Delete

---

## Critical Architecture Decisions

### 1. Backend Limitations Handled
- **No Collections API**: Used `collection-adapter.ts` to map Categories → Collections in UI
- **No Size Variants**: Backend has single `sizeMl` per product, no selectable sizes
- **No User Profile PATCH**: Profile page shows read-only or "not yet supported"
- **No Address Book API**: Addresses page shows message or past order addresses (read-only)
- **Cart Items Without Products**: Created `useEnrichedCart()` to fetch products separately

### 2. API Field Mappings
- `name` → `title` (product title in UI)
- `notes.middle` → `heartNotes`
- `ratingAverage` → `rating`
- `ratingCount` → `reviewCount`
- `brand.name` → `brandName` (when displaying)
- `recipientName` ↔ `firstName + lastName`
- `address + apartment` ↔ `street`

### 3. React Query Architecture
- **Cart**: `useCart()` (raw), `useEnrichedCart()` (with products)
- **Wishlist**: `useWishlist()`, shared across ProductCards
- **Mutations**: All use optimistic updates with rollback
- **Cache Invalidation**: Mutations invalidate parent query keys (e.g., `cart.all` invalidates both `current()` and `enriched()`)
- **Stale Time**:
  - Cart: 0ms (always fresh)
  - Wishlist: 2 minutes
  - Products: 5 minutes
  - Product detail: 10 minutes

### 4. State Management
- **Auth**: Zustand (`useAuthStore`) - tokens + user sync from React Query
- **UI**: Zustand (`useUIStore`) - overlays, modals, loading states
- **Server Data**: React Query exclusively - NO duplication in Zustand

---

## Verification Commands

```bash
# TypeScript
npm run typecheck

# Linting
npm run lint

# Build
npm run build

# Dev server
npm run dev
```

---

## Next Steps for Developer

1. **Implement Phase 4 Pages** (Shop, Product, Cart, Wishlist, Checkout, Order Confirmed)
   - Follow patterns above
   - Use existing hooks
   - Match figma-ui styling

2. **Implement Phase 5 Pages** (Account section)
   - Handle backend limitations gracefully
   - Don't fake unsupported features

3. **Implement Phase 6** (Scent Finder)
   - Use real AI hooks
   - Remove mock logic

4. **Implement Phase 7** (Admin)
   - CRUD for products/brands/categories/orders
   - Use existing admin hooks

5. **Execute Phase 8** (Cleanup)
   - Remove all mock data
   - Final verification

---

## Files Created/Modified Summary

### Created (Phase 1-3):
- `src/lib/adapters/*` (5 files)
- `src/components/shared/*` (10 components)
- `src/components/layouts/header.tsx`
- `src/components/layouts/cart-drawer.tsx`
- `src/components/layouts/search-overlay.tsx`
- `src/components/layouts/mobile-nav.tsx`
- `src/components/layouts/footer.tsx`

### Modified (Phase 1-3):
- `src/styles/tokens.css`
- `src/styles/globals.css`
- `src/components/layouts/root-layout.tsx`
- `src/stores/ui.store.ts`
- `src/stores/auth.store.ts`
- `src/lib/query-keys.ts`
- `src/hooks/api/use-cart.ts` (added `useEnrichedCart()`)
- `src/components/shared/product-card.tsx` (fixed wishlist integration)

### Verification Status:
- ✅ TypeScript: 0 errors
- ✅ Build: Success
- ✅ Runtime: No console errors
- ✅ Architecture: React Query cache verified safe

---

## Important Notes

1. **Do Not Stop at Each Phase**: Continue implementation through all phases. This document provides patterns and requirements.

2. **Backend Contract**: Always check backend DTO types before implementing forms. Located in `perfume-store-backend/src/modules/*/dto/`.

3. **No Mock Data in Production**: After migration, search for and remove all mock data imports.

4. **Shared State**: Cart/Wishlist state is managed by React Query. CartDrawer and /cart page share the same queries.

5. **Auth Functions**: `isAuthenticated()` and `isAdmin()` are functions, not properties. Call them: `auth Store.isAuthenticated()`.

6. **EmptyState Component**: Takes `icon` as ReactNode, not component: `<EmptyState icon={<Icon className="..." />} />`

7. **Product Images**: Backend returns `images: string[]`, not objects with `.url` property.

8. **User Name**: Use `user.fullName`, not `user.name`.

9. **PaginatedData**: Structure is `{ items: T[], meta: PaginationMeta }`, not `{ data: T[] }`.

---

**End of Migration Status Document**
