# services/

Reserved for feature-agnostic, cross-cutting API service modules — e.g. a
generic file-upload client, or a thin wrapper other features compose with.

**This scaffold intentionally ships this folder empty of real API calls.**
No endpoints are connected yet, per scope.

## Intended pattern (for when real integration begins)

Most API calls should live inside their owning feature, e.g.:

```text
src/features/products/services/products.service.ts
src/features/products/services/products.types.ts
```

using the shared Axios instance from `src/lib/axios.ts`:

```ts
import { apiClient } from '@/lib/axios';
import type { ApiSuccessResponse, PaginatedData } from '@/types';

export async function getProducts(params: ProductQueryParams) {
  const { data } = await apiClient.get<ApiSuccessResponse<PaginatedData<Product>>>(
    '/products',
    { params },
  );
  return data.data;
}
```

Only promote a service module here, to `src/services/`, if more than one
feature needs it and it has no single feature owner — mirrors the backend's
`shared/` vs. module-owned boundary (SYSTEM_ARCHITECTURE.md §5–6).
