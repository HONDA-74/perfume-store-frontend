# UI/UX Specification: Landing Page

**Status:** OFFICIAL SPECIFICATION

**Scope:** Landing Page (Home)

**Target Brand Feel:** Editorial Luxury (Inspired by Apple, Aesop, Dior, Chanel, Stripe)

---

## 1. Page Purpose & Strategic Intent

The Landing Page serves as the digital flagship storefront for KENZ. Its core mission is to transition the user from passive browsing to active immersion. It balances sensory storytelling (fragrance note profiles, visual craftsmanship) with friction-free e-commerce conversion triggers.

---

## 2. User Goals & Business Intent

### User Goals

- **Discover:** Explore signature collections, novelties, and curated olfactory stories.
- **Feel:** Experience an atmosphere of exclusivity, quality, and artisan heritage.
- **Navigate:** Intuitively find specific fragrance categories (e.g., Woody, Floral, Unisex) or jump directly to shop access.
- **Decide:** Identify hero products via high-visibility social proof and scent note breakdowns.

### Business Intent

- **Brand Positioning:** Establish high-end market positioning via refined visual presentation.
- **Conversion Optimization:** Direct high-intent traffic directly to the Product Detail Page (PDP) or Catalog through strategically placed call-to-action (CTA) triggers.
- **Customer Retention:** Capture email subscriptions via newsletter onboarding incentives.

---

## 3. Information Hierarchy

1. **Announcement / Utility Bar:** Key logistics updates (e.g., complimentary global shipping, bespoke sample sets).
2. **Global Header:** Brand identity navigation, discovery triggers, and transaction access points (Search, Account, Cart count).
3. **Hero Section:** High-impact visual headline, brand mission statement, and main entry action.
4. **Brand Heritage / Storytelling Spotlight:** Establishing craftsmanship, rarity, and raw ingredient origins.
5. **Featured Collection (Carousel / Grid):** Key seasonal items with instant add-to-cart/view triggers.
6. **Interactive Olfactory Pyramids (Scent Finder):** Experiential feature showcasing Top, Heart, and Base notes visually.
7. **Editorial Lookbook / Brand Campaign:** High-contrast visual immersion featuring lifestyle/product imagery.
8. **Social Proof & Editorial Reviews:** Reviews from publications, master perfumers, and verified buyers.
9. **AI Fragrance Concierge Entry Point:** Interactive quiz/assistant entry section for personal scent matching.
10. **Curated Newsletter Onboarding:** Exclusive access membership capture.
11. **Global Footer:** Comprehensive structural sitemap, legal documentation, and localized currency selection.

---

## 4. Section-by-Section Structural Breakdown

### Section 1: Global Navigation Header

- **Structural Layout:** Sticky top bar. Three split regions: Left (Navigation links), Center (Serif Brand Mark), Right (Search, Account, Wishlist, Cart Drawer Trigger).
- **Components Used:** `Navbar`, `IconButton`, `Badge` (Cart count).
- **Visual Emphasis:** Ultra-thin border baseline, high translucency with backdrop blur for depth when scrolling over dark or light sections.

### Section 2: Hero Section ("The Masterpiece Entry")

- **Structural Layout:** Full-viewport display ($100\text{vh}$). Centered text content superimposed over high-contrast product liquid textures with subtle background movement.
- **Content Elements:**
- _Sub-headline / Category:_ "COLLECTION PRIVÉE" (Upper-case caption tracking).
- _Main Title:_ Display-XL editorial headline (e.g., "The Essence of Unspoken Luxury").
- _Description:_ Body-LG brief paragraph describing scent craftsmanship.
- _Action Pair:_ Primary Gold Solid Button ("Explore Collection"), Ghost Outline Button ("Discover Scent Finder").

- **Components Used:** `Button`, Display Typography Tokens.

### Section 3: Brand Heritage & Craftsmanship (Editorial Feature)

- **Structural Layout:** Two-column split (50% Media / 50% Narrative). Asymmetrical desktop alignment.
- **Content Elements:**
- _Left Column:_ Macro liquid imagery inside floating container with rounded edges.
- _Right Column:_ "Sourced from Grasse, Bottled for the Individual." Narrative block detailing rare botanical extractions, aged ouds, and sustainable luxury. Includes interactive statistics (e.g., "100% Organic Distillation", "Aged 24 Months").

- **Components Used:** `Card` (Bordered/Flat), `Badge`.

### Section 4: Signature Curated Showcase (Product Grid)

- **Structural Layout:** 4-column responsive grid showcasing the top 4 flagship fragrances.
- **Content Elements per Card:**
- Product Image (High contrast, studio lighting on subtle dark slate base).
- Dynamic Badges ("Bestseller", "Limited Edition").
- Product Title, Concentration (e.g., "Extrait de Parfum"), Price.
- Hover Action: Quick Add to Cart overlay trigger + Wishlist Heart button.

- **Components Used:** `Product Card Tile`, `Badge`, `IconButton`, `Button`.

### Section 5: Olfactory Scent Pyramid Interactive Module

- **Structural Layout:** Centered single-column section transitioning into a 3-tier horizontal interactive tab block (Top, Heart, Base notes).
- **Content Elements:**
- Interactive tabs allowing users to switch between scent levels.
- Visual representation of ingredient cards (e.g., Calabrian Bergamot, Rare Oud Wood, Black Amber) featuring ingredient notes, origin, and aromatic intensity indicators.

- **Components Used:** `Tabs`, `Card`, `Skeleton` (for transitions).

### Section 6: AI Scent Concierge Teaser Section

- **Structural Layout:** Full-width dark slate block (`Canvas Dark / Noir`) with luxury gold metallic highlight borders.
- **Content Elements:**
- Headline: "Find Your Signature Olfactory Identity."
- Description: Short copy explaining how the AI concierge analyzes preferences, seasons, and mood.
- Action: Primary Gold Button ("Begin 2-Minute Scent Quiz").

- **Components Used:** `Card` (Gold border variant), `Button`.

### Section 7: Editorial Reviews & Press Highlights

- **Structural Layout:** 3-column minimalist layout without cards—pure text and subtle gold quote dividers.
- **Content Elements:**
- Quotes from Vogue, Harper’s Bazaar, and Master Perfumers.
- Publication Logo / Name + Star Rating micro-copy.

- **Components Used:** Typography Tokens (`body-lg`, `caption`).

### Section 8: Private Club Newsletter Onboarding

- **Structural Layout:** Centered layout within focused container width ($480\text{px}$).
- **Content Elements:**
- Title: "Join The Private Registry."
- Subtitle: "Receive invitations to private vault drops and sample releases."
- Input Group: Email Input field + "Subscribe" CTA Button.
- Privacy Micro-copy: Reassuring statement on data protection.

- **Components Used:** `Input`, `Button`, `Form Group`.

### Section 9: Global Footer

- **Structural Layout:** 4-column link layout (Catalog, Heritage, Customer Care, Legal) + Bottom row for copyright and compliance.
- **Components Used:** `Footer`, `Breadcrumb`.

---

## 5. Spacing & Typography Hierarchy Strategy

### Spacing Strategy

- **Global Section Padding:** `py-24` ($96\text{px}$) on desktop for maximum breathing room, scaling down to `py-12` ($48\text{px}$) on mobile to ensure fast vertical scan times.
- **Internal Component Gaps:** Consistently built on the $4\text{px}$ grid baseline. Gaps between headlines and body text maintain strict `space-4` ($16\text{px}$) or `space-6` ($24\text{px}$) rhythm.

### Typography Application Blueprint

- **Main Hero Title:** `display-xl` ($3.75\text{rem}$ / $60\text{px}$, tracking $-0.02\text{em}$, line height $1.1$).
- **Section Titles:** `h1` ($2.25\text{rem}$ / $36\text{px}$, tracking $0.00\text{em}$, line height $1.2$).
- **Card Headings:** `h3` ($1.25\text{rem}$ / $20\text{px}$, tracking $0.01\text{em}$, line height $1.3$).
- **Body Narrative:** `body-lg` ($1.125\text{rem}$ / $18\text{px}$, line height $1.6$) for editorial stories; `body-md` ($1.00\text{rem}$ / $16\text{px}$) for UI state controls and product details.
- **Metadata & Accents:** `caption` ($0.75\text{rem}$ / $12\text{px}$, tracking $0.05\text{em}$ UPPERCASE) for scent categories, tags, and small descriptors.

---

## 6. Visual Emphasis & Palette Mapping

- **Primary Background:** `Off-White / Soft Silk` for standard light mode background.
- **High-Contrast Anchors:** Deep `Canvas Dark / Noir` applied to the AI Concierge module and dynamic hero media overlays to ground visual weight.
- **Accent Color Strategy:** Reserved strictly for primary call-to-action buttons, active interactive tabs, focus rings, and signature badges (`Luxury Gold`).
- **Borders & Dividers:** Subdued `Neutral Slate` at $10\%$ opacity to preserve zero-clutter visual separation.

---

## 7. Responsive Layout Strategy

| Viewport                                    | Grid Layout | Adjustments                                                                                 |
| ------------------------------------------- | ----------- | ------------------------------------------------------------------------------------------- |
| **Desktop ($1280\text{px}+$)**              | 12-Column   | Full-width media grids, visible nav links, 4-card horizontal showcase.                      |
| **Tablet ($768\text{px} - 1024\text{px}$)** | 8-Column    | 2-column product grid, standard hero image stack, collapsible mobile nav drawer.            |
| **Mobile ($<768\text{px}$)**                | 4-Column    | 1-column product stack, stacked hero buttons, full-width touch-friendly actions (`w-full`). |

---

## 8. Deterministic Screen States

### Initial / Idle State

- Complete content presentation with calm, resting UI elements awaiting user interaction.

### Loading State

- **Hero:** Displaying custom structural background placeholder.
- **Product Showcase Grid:** Replaced with 4 rectangular `Skeleton` shimmer blocks matching precise card aspect ratios ($3:4$ aspect ratio) to prevent layout shifts.
- **Text Blocks:** Shimmer lines matching precise line height tokens.

### Success / Populated State

- Full rendering of high-resolution images, real-time prices, live inventory indicators, and active shopping options.

### Empty State

- If dynamic collections fail to populate or dynamic items are out of stock, render a clean card layout with:
- _Headline:_ "Catalog Selection Updating."
- _Message:_ "Our private inventory is currently being replenished. Explore our permanent collection."
- _Action:_ "View All Perfumes" primary action.

### Error State

- Non-disruptive inline card presentation replacing failed dynamic sections:
- _Visual:_ Neutral error card with clear warning messaging.
- _Message:_ "Unable to load seasonal recommendations."
- _Action:_ "Try Again" CTA trigger for user-initiated retry query.

---

## 9. Motion & Interaction Specifications

- **Page Scroll Entry:** Subtle upward entrance transition ($15\text{px}$ Y-axis shift, $400\text{ms}$ duration) for editorial headers upon crossing viewport threshold.
- **Product Card Hover Effect:** Smooth GPU-accelerated elevation transform (`scale(1.02)`) over $250\text{ms}$ ease-out deceleration curve, accompanied by a soft background blur layer lift.
- **Interactive Tabs Transition:** Cross-fade opacity shift ($150\text{ms}$) when toggling between Top, Heart, and Base scent notes to guarantee immediate UI feedback without jank.
- **Reduced Motion Fallback:** Automatically disables Y-axis transforms and opacity shifts for users with `prefers-reduced-motion: reduce` enabled.

---

## 10. Accessibility Specifications (WCAG 2.1 AA)

- **Contrast Compliance:** All text elements adhere strictly to minimum $4.5:1$ contrast ratios against light or dark background elements.
- **Keyboard Navigation:** Full structural focus ring visual indicator (`ring-2 ring-gold-500 ring-offset-2`) when navigating through interactive elements via `Tab`.
- **Screen Reader Labelling:** All interactive icon buttons (Cart, Search, Wishlist toggle) include mandatory, descriptive `aria-label` declarations. Dynamic live updates (such as updating cart counts) utilize `aria-live="polite"`.

---

## 11. AI Touchpoints Strategy

- **Location:** Integrated into Section 6 ("AI Fragrance Concierge").
- **Behavior & Goal:** Acts as an interactive visual entry trigger. It initiates an intelligent multi-step modal quiz that maps user preferences (desired mood, favorite scents, intended wear occasions) directly to optimal scent profiles using natural language understanding.

# OFFICIAL UI/UX SPECIFICATIONS

**Status:** OFFICIAL & FROZEN SPECIFICATIONS

**Scope:** Complete Storefront Pages & Components (Items 1 to 20)

**Locale Scope:** Strictly English-Only (en-US, LTR)

---

## 1. Shop / Catalog Page Specification

### 1. Page Purpose

The primary discovery hub designed to present the full KENZ fragrance collection, empowering users to filter, sort, and discover products efficiently while upholding brand prestige.

### 2. User Goals & Business Goals

- **User:** Easily filter products by gender, category, concentration, fragrance notes, and price range. Quick-add items to cart or wishlist.
- **Business:** Maximize product discovery, drive catalog interaction, and guide users efficiently to product detail pages.

### 3. Information Hierarchy

1. Breadcrumbs & Catalog Banner Title
2. Sticky Filter Sidebar & Active Filter Chips Bar
3. Sorting Controls & Total Product Count
4. Product Grid (Responsive Cards)
5. Pagination Controls

### 4. Layout Structure & Sections

- **Top Banner:** Minimal editorial heading (`Catalog / Luxury Fragrance Collection`).
- **Main Container (Split Layout):** \* Left Column ($250\text{px}$ fixed on desktop): Vertical Accordion Filter Sidebar (Category, Gender, Brand, Price, Fragrance Notes).
- Right Column (Fluid): Controls Bar (Active Filters, Sort Select `price_asc`, `price_desc`, `newest`) + Product Grid ($3$-column desktop, $2$-column tablet, $1$-column mobile).

### 5. Components Used

`Breadcrumb`, `Typography`, `Accordion`, `Checkbox`, `Slider` (Price), `Badge` (Active filters), `Select` (Sort), `ProductCard`, `Pagination`, `Skeleton`.

### 6. Typography Usage

- Banner Title: `h1` Serif ($48\text{px}$)
- Section Headings: `h3` Serif ($20\text{px}$)
- Filter Labels & Product Names: `body-md` Sans-Serif ($16\text{px}$)
- Prices & Micro-copy: `caption` Sans-Serif ($14\text{px}$ / $12\text{px}$)

### 7. Spacing Strategy

- Section Container: `py-16 px-6` desktop. Grid Gap: `gap-8`. Filter Item Gap: `space-y-4`.

### 8. Responsive Behavior

- Mobile ($<768\text{px}$): Filter sidebar collapses into a slide-over Filter Drawer triggered by a fixed floating "Filter & Sort" button. Grid shifts to single column.

### 9. Screen States

- **Loading:** 6-card `Skeleton` grid with shimmer animation matching $3:4$ aspect ratio.
- **Empty State:** "No fragrances match your selected criteria." button to "Reset All Filters".
- **Error State:** "Failed to load catalog. Please retry." button triggering API refetch.
- **Success State:** Grid populated with interactive cards.

### 10. Motion & Interactions

- Soft hover elevation (`scale(1.02)`) on product cards over $200\text{ms}$. Smooth drawer slide-in ($300\text{ms}$ ease-out) on mobile.

### 11. Accessibility

- Filter accordions support `aria-expanded`. Active filter tags feature keyboard-removable focus states (`Tab` + `Enter`/`Space`).

### 12. API Integration Points

- `GET /api/v1/products?page=1&limit=12&sort=-createdAt&category=...&brand=...&search=...`

### 13. AI Touchpoints

- "AI Match Suggestion" tag highlighted over products matching user profile (if quiz previously completed).

---

## 2. Product Details Page (PDP) Specification

### 1. Page Purpose

The definitive conversion engine. Provides deep visual immersion, craftsmanship narrative, note profiles, and seamless purchasing options.

### 2. User Goals & Business Goals

- **User:** View high-res images, explore olfactory notes (Top, Heart, Base), select bottle volumes ($50\text{ml}$, $100\text{ml}$), check availability, and add to cart.
- **Business:** Drive high conversion, increase Average Order Value (AOV) through volume upsells, and communicate brand value.

### 3. Information Hierarchy

1. Breadcrumb Navigation
2. Dual-Column Display: Left (Interactive Gallery), Right (Sticky Purchase Console)
3. Olfactory Notes & Accord Breakdown Section
4. Brand Narrative & Sustainability Section
5. Related Products Recommendations

### 4. Layout Structure & Sections

- **Hero Split ($50/50$ Desktop):** Left column contains main high-res product visual with vertical thumb-strip. Right column contains Brand Name, Title, Price, Volume Select Pills, Quantity Counter, Primary "Add to Cart" CTA, Secondary "Wishlist" Icon Button.
- **Tabbed Information Section:** Detailed description, Olfactory Pyramid, Ingredients, Application Advice.
- **Recommended Grid:** 4-card horizontal carousel.

### 5. Components Used

`Breadcrumb`, `ImageGallery`, `Badge`, `RadioGroup` (Volume), `QuantitySelector`, `Button`, `Tabs`, `Accordion`, `ProductCard`.

### 6. Typography Usage

- Product Title: `h1` Serif ($36\text{px}$)
- Price: `h2` Sans-Serif ($28\text{px}$)
- Note Titles: `h4` Serif ($18\text{px}$)
- Narrative Body: `body-lg` Sans-Serif ($18\text{px}$)

### 7. Spacing Strategy

- Section Padding: `py-20 px-8`. Dual Column Gap: `gap-16`. Controls Vertical Gap: `space-y-6`.

### 8. Responsive Behavior

- Mobile ($<768\text{px}$): Image Gallery turns into a horizontal swipe carousel with dot indicators. Purchase panel un-sticks and stacks below gallery. Sticky bottom "Add to Cart" bar appears on scroll.

### 9. Screen States

- **Loading:** Image gallery and description skeleton pulses.
- **Empty State (Out of Stock):** Volume selector disabled; CTA switches to "Notify Me When Available" (Email input form).
- **Error State:** "Product unavailable or missing." Link to return to Shop.
- **Success State:** Interactive page with live volume selection updating price dynamically.

### 10. Motion & Interactions

- Image thumbnail switch cross-fades ($150\text{ms}$). Toast notification slides down from top-right upon successful "Add to Cart".

### 11. Accessibility

- ARIA volume selector `role="radiogroup"`. Quantity selector announces changes via `aria-live="polite"`.

### 12. API Integration Points

- `GET /api/v1/products/:idOrSlug`
- `POST /api/v1/cart/items`

### 13. AI Touchpoints

- "Why this fits you": Personalized AI micro-insight explaining why this fragrance matches the user's recorded preferences.

---

## 3. Search Overlay & Search Results Page Specification

### 1. Page Purpose

Provides instant, real-time live search overlays alongside a comprehensive dedicated Search Results Page for broad catalog queries.

### 2. User Goals & Business Goals

- **User:** Rapidly find specific perfumes, notes, or brands with instant keyboard-driven feedback.
- **Business:** Reduce bounce rates by providing frictionless search access and predictive suggestions.

### 3. Information Hierarchy

1. Full-screen Search Overlay Input Bar
2. Instant Predictive Results (Products, Categories, Brands)
3. Direct Search Page Layout: Query Summary Header + Standard Product Grid + Filter Sidebar

### 4. Layout Structure & Sections

- **Modal Overlay:** Semi-transparent backdrop (`backdrop-blur-md`). Full-width input at top with instant predictive auto-complete dropdown split into 3 columns: Popular Queries, Direct Products, Top Categories.
- **Dedicated Results Page:** Identical to Catalog structure, prefixed with `Results for "[Query]"` ($X$ items found).

### 5. Components Used

`Modal`, `SearchInput`, `Badge`, `ProductCard`, `EmptyState`, `Skeleton`.

### 6. Typography Usage

- Search Input Text: `h2` Sans-Serif ($28\text{px}$)
- Results Count Header: `h2` Serif ($32\text{px}$)
- Category Links: `caption` Upper-case ($12\text{px}$)

### 7. Spacing Strategy

- Overlay Padding: `pt-16 px-12`. Result Item Spacing: `py-3 border-b`.

### 8. Responsive Behavior

- Mobile: Full-screen coverage without margin overlays. Input includes auto-focus and clear button (`X`).

### 9. Screen States

- **Loading:** Inline spinner within input field + skeleton lines in auto-complete dropdown.
- **Empty State:** "No fragrances found matching '[Query]'." Offers curated popular collections.
- **Error State:** Non-blocking error toast: "Search service unavailable."

### 10. Motion & Interactions

- Overlay fades in ($200\text{ms}$). Instant debounce filter ($300\text{ms}$) updates results smoothly.

### 11. Accessibility

- `role="combobox"` on search input with `aria-autocomplete="list"` and full keyboard arrow key navigation.

### 12. API Integration Points

- `GET /api/v1/products?search=:query&page=1&limit=8`

### 13. AI Touchpoints

- Natural language search interpretation (e.g., typing "warm winter woody scent" matches Oud and Cedarwood notes).

---

## 4. Wishlist Specification

### 1. Page Purpose

Allows registered users to save desired fragrances for future purchasing or evaluation.

### 2. User Goals & Business Goals

- **User:** Review saved products, monitor stock status, and transfer items directly to the active cart.
- **Business:** Capture user intent, gather analytics on high-demand items, and convert secondary intent into orders.

### 3. Information Hierarchy

1. Page Header ("My Private Wishlist")
2. Product Grid of Saved Items
3. Batch Action Controls ("Move All to Cart")

### 4. Layout Structure & Sections

- **Header:** Centered title with total item count subtitle.
- **Main Grid:** $3$-column grid. Each card displays product image, title, price, stock status badge, "Move to Cart" button, and an top-right "Remove" trash icon button.

### 5. Components Used

`Typography`, `ProductCardTile`, `Button`, `IconButton`, `Badge`, `EmptyState`.

### 6. Typography Usage

- Title: `h1` Serif ($36\text{px}$)
- Product Title: `h3` Serif ($20\text{px}$)
- Action Button: `body-md` Sans-Serif ($14\text{px}$ bold)

### 7. Spacing Strategy

- Layout: `py-16 max-w-7xl mx-auto`. Grid Gap: `gap-8`.

### 8. Responsive Behavior

- Mobile: 1-column product cards with full-width action buttons.

### 9. Screen States

- **Loading:** 3-card skeleton shimmer blocks.
- **Empty State:** Minimalist luxury graphic + "Your wishlist is currently empty." CTA: "Explore Catalog".
- **Success State:** Full grid display with instant removal animations.

### 10. Motion & Interactions

- Card item fade/scale-out ($200\text{ms}$) when removed from wishlist.

### 11. Accessibility

- Interactive buttons possess distinct `aria-label` declarations (e.g., `aria-label="Remove Royal Oud from Wishlist"`).

### 12. API Integration Points

- `GET /api/v1/wishlist`
- `POST /api/v1/wishlist/items`
- `DELETE /api/v1/wishlist/items/:productId`

---

## 5. Cart Drawer Specification

### 1. Page Purpose

A sliding slide-over container providing quick access to review items, edit quantities, apply promo codes, and initiate checkout without leaving the active page.

### 2. User Goals & Business Goals

- **User:** Quick review of selected items, total cost calculation, item removal, and fast transition to checkout.
- **Business:** Reduce purchase friction, encourage immediate conversion, and showcase shipping threshold progress.

### 3. Information Hierarchy

1. Header: Drawer Title ("Your Cart") + Close Button (`X`)
2. Free Shipping Progress Bar Indicator
3. Scrollable Line Item List
4. Summary Footer: Subtotal, Shipping Estimate, Checkout Button

### 4. Layout Structure & Sections

- **Slide-over Panel ($450\text{px}$ width right-aligned):** \* Header: Sticky top.
- Body: Vertical list of items (Thumbnail, Name, Concentration, Volume, Quantity counter, Price, Remove action).
- Footer: Sticky bottom with dark canvas background. Subtotal calculation block + Primary Gold Checkout CTA Button.

### 5. Components Used

`Drawer`, `ProgressBar`, `QuantitySelector`, `IconButton`, `Button`, `Divider`.

### 6. Typography Usage

- Title: `h2` Serif ($24\text{px}$)
- Item Name: `h4` Serif ($16\text{px}$)
- Price/Subtotal: `body-lg` Sans-Serif ($18\text{px}$ bold)

### 7. Spacing Strategy

- Inner Padding: `p-6`. Item Vertical Spacing: `space-y-6`.

### 8. Responsive Behavior

- Mobile: Covers $100\%$ viewport width.

### 9. Screen States

- **Loading:** Line item skeletons pulse inside drawer body.
- **Empty State:** Centered bag icon + "Your bag is empty." CTA: "Discover Scents".
- **Success State:** Populated line items with reactive subtotal changes.

### 10. Motion & Interactions

- Drawer slides from right ($300\text{ms}$ cubic-bezier). Backdrop blur fades in.

### 11. Accessibility

- Focus trapped within active drawer (`FocusTrap`). Focus restores to trigger button on close.

### 12. API Integration Points

- `GET /api/v1/cart`
- `PATCH /api/v1/cart/items/:productId`
- `DELETE /api/v1/cart/items/:productId`

---

## 6. Cart Page Specification

### 1. Page Purpose

The dedicated full-page alternative to the Cart Drawer, optimized for desktop users wanting detailed order adjustments before final payment.

### 2. User Goals & Business Goals

- **User:** Detailed inspection of order line items, gift note entry, delivery option choices, and total breakdown.
- **Business:** Clear layout to prevent abandonments and validate cart item availability prior to checkout lock.

### 3. Information Hierarchy

1. Page Header ("Shopping Bag")
2. Main Content Split: Left (Line Item Table/List), Right (Order Summary Card)
3. Complimentary Samples Selection Carousel

### 4. Layout Structure & Sections

- **Left Column ($65\%$ width):** Detailed item table including thumbnail, details, unit price, quantity control, total line price, remove action. Gift packaging checkbox + input text area.
- **Right Column ($35\%$ width):** Sticky Card containing Order Summary, Subtotal, Estimated Taxes, Estimated Shipping, Promo Code input, and "Proceed to Checkout" primary action.

### 5. Components Used

`Table`, `QuantitySelector`, `Input`, `Card`, `Button`, `Divider`.

### 6. Typography Usage

- Header: `h1` Serif ($36\text{px}$)
- Summary Subtotals: `body-md` ($16\text{px}$)
- Main Total: `h2` Sans-Serif ($28\text{px}$)

### 7. Spacing Strategy

- Page Padding: `py-16 max-w-7xl`. Layout Gap: `gap-12`.

### 8. Responsive Behavior

- Mobile: Table switches to stacked cards view. Order summary card moves to bottom of page.

### 9. Screen States

- **Loading:** Table rows display shimmer skeletons.
- **Empty State:** Full-width empty container with direct collection quick-links.

### 10. Motion & Interactions

- Immediate dynamic recalculation of summary numbers upon quantity adjustment.

### 11. Accessibility

- Table structure utilizes proper HTML5 standard semantic elements (`table`, `thead`, `tbody`, `th`, `td`).

### 12. API Integration Points

- `GET /api/v1/cart`
- `PATCH /api/v1/cart/items/:productId`

---

## 7. Checkout Flow Specification

### 1. Page Purpose

A multi-step, distraction-free transactional funnel focused strictly on conversion efficiency, address verification, and secure order placement.

### 2. User Goals & Business Goals

- **User:** Complete order fast with minimal cognitive load, select shipping address, choose delivery method, and pay securely.
- **Business:** Maximize checkout completion rate, ensure data validation accuracy, and prevent cart abandonment.

### 3. Information Hierarchy

1. Distraction-Free Header (Logo only + Secure SSL Indicator)
2. Checkout Stepper Indicator (1. Information $\rightarrow$ 2. Shipping $\rightarrow$ 3. Payment)
3. Left Column: Active Step Form Console
4. Right Column: Sticky Mini Order Summary Sidebar

### 4. Layout Structure & Sections

- **Step 1 (Information):** Guest Email or Account Login trigger; Shipping Address Form (First Name, Last Name, Street, Apartment, City, Postal Code, Phone).
- **Step 2 (Shipping Method):** Radio card options (Standard Express, Bespoke Courier with delivery timeframes and prices).
- **Step 3 (Payment):** Payment Gateway selection (Credit Card form, Apple Pay, PayPal). Express One-Click button option.
- **Sticky Right Sidebar:** Collapsible order items summary, coupon input, subtotal, shipping tax breakdown, final total.

### 5. Components Used

`Stepper`, `Form`, `Input`, `Select`, `RadioGroup`, `Button`, `Card`, `Badge`.

### 6. Typography Usage

- Step Titles: `h2` Serif ($24\text{px}$)
- Form Labels: `body-md` Sans-Serif ($14\text{px}$ medium)
- Order Total: `h2` Sans-Serif ($24\text{px}$)

### 7. Spacing Strategy

- Screen Container: `max-w-6xl py-12`. Form Field Spacing: `gap-4`.

### 8. Responsive Behavior

- Mobile: Order summary moves into top collapsible accordion panel ("Show order summary — $XXX").

### 9. Screen States

- **Loading:** Button loading state with spinner during step validation and API processing.
- **Error State:** Field-level validation messages ("Postal code invalid") in red accent text. Global toast on payment failure.

### 10. Motion & Interactions

- Accordion transition between steps ($250\text{ms}$). Form validation feedback triggers in real time.

### 11. Accessibility

- Standard form inputs feature explicit `<label>` tags with matching `for` attributes. Explicit `aria-invalid` state handling.

### 12. API Integration Points

- `GET /api/v1/users/me/addresses`
- `POST /api/v1/orders`

---

## 8. Order Success Page Specification

### 1. Page Purpose

The post-purchase destination confirming transaction success, establishing trust, providing order tracking details, and encouraging account onboarding.

### 2. User Goals & Business Goals

- **User:** Receive immediate order confirmation, view order number, inspect summary, and track delivery status.
- **Business:** Reinforce buyer confidence, lower post-purchase anxiety, and drive account registration for guest checkout users.

### 3. Information Hierarchy

1. Success Visual Indicator (Checkmark Accent Graphic)
2. Thank You & Order Number Heading
3. Delivery Estimation Card
4. Order Summary & Shipping Address Details Grid
5. Action Buttons ("Continue Shopping", "View Order Status")

### 4. Layout Structure & Sections

- **Centered Hero Container:** Animated checkmark vector, "Thank You, [Name]", Subtitle "Order #[OrderNumber] placed successfully. Confirmation sent to [Email]".
- **2-Column Details Block:** Left column (Shipping address, Chosen shipping method). Right column (Purchased items list + Price breakdown summary).
- **Account Creation Prompt (If Guest):** "Create an account to track your delivery in real-time." Password entry input field + CTA.

### 5. Components Used

`Icon`, `Typography`, `Card`, `Divider`, `Button`, `Input`.

### 6. Typography Usage

- Heading: `h1` Serif ($36\text{px}$)
- Order Number Accent: `h3` Sans-Serif ($20\text{px}$ bold)
- Body Text: `body-md` ($16\text{px}$)

### 7. Spacing Strategy

- Main Wrapper: `py-20 max-w-4xl mx-auto px-4`. Element Spacing: `space-y-8`.

### 8. Responsive Behavior

- Mobile: 2-column details block collapses into single stacked card layout.

### 9. Screen States

- **Success State Only:** Displays immutable confirmation snapshot fetched from order payload.

### 10. Motion & Interactions

- Animated draw-in of green checkmark icon ($500\text{ms}$ ease-out). Page elements slide up sequentially.

### 11. Accessibility

- Screen reader live region announces "Order successfully placed. Your order number is [Order Number]."

### 12. API Integration Points

- `GET /api/v1/orders/:id`

---

## 9. Login Modal Specification

### 1. Page Purpose

A clean authentication dialog enabling returning customers to log in without losing their current page context.

### 2. User Goals & Business Goals

- **User:** Fast, secure account authentication using credentials.
- **Business:** Ensure secure user identification and seamless transition into personalized account states.

### 3. Information Hierarchy

1. Header Title ("Welcome Back") + Subtitle
2. Form: Email Address Input, Password Input
3. Options Row: "Remember Me" Checkbox + "Forgot Password?" Link
4. Actions: Primary "Sign In" Button + Switch to Register link

### 4. Layout Structure & Sections

- **Centered Modal Dialog ($420\text{px}$ Width):** High-density dark/light card overlay with top-right close icon. Vertical stacked form inputs.

### 5. Components Used

`Modal`, `Input`, `Checkbox`, `Button`, `Link`.

### 6. Typography Usage

- Title: `h2` Serif ($28\text{px}$)
- Labels & Inputs: `body-md` ($14\text{px}$)

### 7. Spacing Strategy

- Internal Padding: `p-8`. Form Field Stack: `space-y-5`.

### 8. Responsive Behavior

- Mobile: Fits full mobile screen size with top-aligned navigation.

### 9. Screen States

- **Idle:** Clean input fields with focus indicators.
- **Loading:** Disabled button with active inline spinner.
- **Error State:** Banner at top of form ("Invalid email or password").

### 10. Motion & Interactions

- Modal scale-in transition ($200\text{ms}$ opacity + scale $0.95 \rightarrow 1.0$).

### 11. Accessibility

- Trapped keyboard navigation within modal (`FocusTrap`). Close on `Escape` key press.

### 12. API Integration Points

- `POST /api/v1/auth/login`

---

## 10. Register Modal Specification

### 1. Page Purpose

An onboarding modal designed to convert guest visitors into registered members of the luxury brand.

### 2. User Goals & Business Goals

- **User:** Create a new profile quickly to save preferences, track orders, and join the exclusive registry.
- **Business:** Build first-party customer relationships and capture user demographics.

### 3. Information Hierarchy

1. Header Title ("Join The Registry") + Subtitle
2. Form: First Name, Last Name, Email, Password, Confirm Password
3. Terms & Privacy Policy Checkbox
4. Actions: Primary "Create Account" Button + Switch to Login link

### 4. Layout Structure & Sections

- **Centered Modal Overlay ($480\text{px}$ Width):** Balanced vertical layout featuring 2-column grid for First/Last name, followed by full-width fields for Email and Password.

### 5. Components Used

`Modal`, `Input`, `Checkbox`, `Button`, `Link`.

### 6. Typography Usage

- Title: `h2` Serif ($28\text{px}$)
- Legal Micro-copy: `caption` ($12\text{px}$)

### 7. Spacing Strategy

- Modal Padding: `p-8`. Field Grid Gap: `gap-4`.

### 8. Responsive Behavior

- Mobile: Name fields stack vertically into single column.

### 9. Screen States

- **Loading:** Button disabled with spinner.
- **Error State:** Form validation errors under specific inputs ("Password must be at least 8 characters").

### 10. Motion & Interactions

- Modal entrance matching Login modal ($200\text{ms}$).

### 11. Accessibility

- Mandatory checkbox for Terms contains proper aria-required tags.

### 12. API Integration Points

- `POST /api/v1/auth/register`

---

## 11. Customer Dashboard Specification

### 1. Page Purpose

The central account hub providing users with an overview of recent orders, personal info, default shipping address, and personalized fragrance profiles.

### 2. User Goals & Business Goals

- **User:** Access primary account navigation links, view active delivery statuses, and manage profile data.
- **Business:** Encourage account retention and streamline customer self-service support.

### 3. Information Hierarchy

1. Welcome Banner ("Hello, [Customer Name]")
2. Account Navigation Sidebar / Tabs
3. Overview Dashboard Cards: Recent Order Summary Card, Default Address Card, AI Scent Profile Match Summary Card

### 4. Layout Structure & Sections

- **2-Column Workspace ($250\text{px}$ Sidebar / Fluid Content):** Left Column contains links (Overview, Orders, Profile, Addresses, Wishlist, Logout). Right Column contains 3 grid overview modules.

### 5. Components Used

`SidebarNav`, `Card`, `Badge`, `Button`, `Avatar`.

### 6. Typography Usage

- Dashboard Title: `h1` Serif ($32\text{px}$)
- Card Title: `h3` Serif ($20\text{px}$)

### 7. Spacing Strategy

- Layout Margin: `py-12 max-w-7xl mx-auto`. Grid Spacing: `gap-6`.

### 8. Responsive Behavior

- Mobile: Sidebar converts into top horizontal scroll tab strip.

### 9. Screen States

- **Loading:** Profile overview card skeletons display loading states.

### 10. Motion & Interactions

- Smooth fade-in of content when switching dashboard tabs.

### 11. Accessibility

- Navigation sidebar wrapped in semantic `<nav>` tag with `aria-label="Account Navigation"`.

### 12. API Integration Points

- `GET /api/v1/users/me`
- `GET /api/v1/orders?page=1&limit=1`

---

## 12. My Orders Page Specification

### 1. Page Purpose

A comprehensive order history ledger enabling users to track current shipments and view historical purchases.

### 2. User Goals & Business Goals

- **User:** Search past orders, inspect fulfillment status, and download invoices or re-order products.
- **Business:** Reduce support ticket volume regarding order status inquiries.

### 3. Information Hierarchy

1. Page Title ("Order History")
2. Order Status Filter Tabs (All, Processing, Shipped, Delivered)
3. Order History List / Card Stack

### 4. Layout Structure & Sections

- **Vertical Card Layout:** Each card represents an order entity: Header (Order ID, Date Placed, Total Amount, Status Badge), Body (Thumbnails of items included), Footer Actions ("View Order Details", "Track Package").

### 5. Components Used

`Tabs`, `Card`, `Badge`, `Button`, `Pagination`.

### 6. Typography Usage

- Title: `h2` Serif ($28\text{px}$)
- Card Metadata: `body-md` ($14\text{px}$ bold)

### 7. Spacing Strategy

- Padding: `py-12 max-w-5xl`. Card Vertical Gap: `space-y-6`.

### 8. Responsive Behavior

- Mobile: Card header metadata stacks into vertical column layout.

### 9. Screen States

- **Loading:** 3 Order card skeletons shimmer.
- **Empty State:** "You have no order history." Button to catalog.

### 10. Motion & Interactions

- Hover state accent outline on order cards.

### 11. Accessibility

- Order status badges feature semantic color contrast and text descriptions (not relying solely on color).

### 12. API Integration Points

- `GET /api/v1/orders?page=1&limit=10`

---

## 13. Order Details Page Specification

### 1. Page Purpose

A granular breakdown view of a single specific past or active order.

### 2. User Goals & Business Goals

- **User:** Inspect specific items purchased, view tracking numbers, inspect billing/shipping addresses, and print receipt.
- **Business:** Deliver complete transaction transparency.

### 3. Information Hierarchy

1. Breadcrumbs (`Account / Orders / #10042`)
2. Order Header (ID, Date, Status, Live Tracking Link)
3. Line Items Table
4. Address & Payment Information Grid

### 4. Layout Structure & Sections

- **Top Bar:** Order ID + Fulfillment Status Badge + Action Button ("Download PDF Invoice").
- **2-Column Split:** Left (Line items list with individual product thumbnails, prices, volumes, quantity), Right (Shipping address, Billing address, Payment method summary, Order price calculation box).

### 5. Components Used

`Breadcrumb`, `Badge`, `Table`, `Card`, `Button`, `Divider`.

### 6. Typography Usage

- Order Title: `h1` Serif ($32\text{px}$)
- Section Headers: `h4` Serif ($18\text{px}$)

### 7. Spacing Strategy

- Page Layout: `py-12 max-w-6xl`. Gap: `gap-8`.

### 8. Responsive Behavior

- Mobile: Table switches to itemized list. Address cards stack vertically.

### 9. Screen States

- **Loading:** Line item table skeleton loader.
- **Error State:** "Order not found or permission denied."

### 10. Motion & Interactions

- Standard crisp page load transition.

### 11. Accessibility

- Accessible table accessibility attributes and standard ARIA region markers.

### 12. API Integration Points

- `GET /api/v1/orders/:id`

---

## 14. Profile Settings Specification

### 1. Page Purpose

Allows logged-in users to update their personal information, email address, phone number, and account password.

### 2. User Goals & Business Goals

- **User:** Keep personal data updated and manage security credentials safely.
- **Business:** Maintain accurate customer records and robust platform account security.

### 3. Information Hierarchy

1. Section Title ("Profile Settings")
2. Personal Information Form Section
3. Password Change Security Form Section

### 4. Layout Structure & Sections

- **Vertical Stacked Form Cards:** \* Card 1 (Personal Info): First Name, Last Name, Email, Phone number inputs + "Save Changes" button.
- Card 2 (Security): Current Password, New Password, Confirm New Password inputs + "Update Password" button.

### 5. Components Used

`Card`, `Input`, `Button`, `Toast`.

### 6. Typography Usage

- Page Heading: `h2` Serif ($28\text{px}$)
- Card Title: `h3` Serif ($20\text{px}$)

### 7. Spacing Strategy

- Wrapper: `max-w-4xl py-12`. Card Separation: `space-y-8`.

### 8. Responsive Behavior

- Mobile: 2-column input rows collapse to single column.

### 9. Screen States

- **Loading:** Input forms display gray loading placeholders while profile data fetches.
- **Success State:** Non-blocking Toast notification ("Profile updated successfully").

### 10. Motion & Interactions

- Real-time password strength validation bar indicator dynamically transitions color (`Red` $\rightarrow$ `Yellow` $\rightarrow$ `Green`).

### 11. Accessibility

- Password fields include "Show/Hide Password" toggle button with explicit `aria-label`.

### 12. API Integration Points

- `GET /api/v1/users/me`
- `PATCH /api/v1/users/me`

---

## 15. Address Book Specification

### 1. Page Purpose

Enables users to manage multiple shipping and billing addresses for fast checkout selection.

### 2. User Goals & Business Goals

- **User:** Add, edit, remove, and select default shipping addresses.
- **Business:** Streamline repeat checkouts by caching validated addresses.

### 3. Information Hierarchy

1. Header ("Address Book") + "Add New Address" Action Button
2. Address Cards Grid (Default marked with a Badge)
3. Add / Edit Address Drawer Modal Form

### 4. Layout Structure & Sections

- **Grid Layout ($2$-column desktop):** Each address is contained within a Card displaying Recipient Name, Street Address, City, Postal Code, Country, Phone, Default Badge, and action links ("Edit", "Delete", "Set as Default").

### 5. Components Used

`Card`, `Badge`, `Button`, `IconButton`, `Modal`, `Input`, `Select`.

### 6. Typography Usage

- Header: `h2` Serif ($28\text{px}$)
- Recipient Name: `h4` Serif ($18\text{px}$)

### 7. Spacing Strategy

- Page Layout: `py-12 max-w-5xl`. Grid Gap: `gap-6`.

### 8. Responsive Behavior

- Mobile: Address cards collapse into a single column.

### 9. Screen States

- **Loading:** 2 card shimmer skeletons.
- **Empty State:** "No addresses saved." Prompt button to add first address.

### 10. Motion & Interactions

- Deleting an address card triggers an exit fade animation ($200\text{ms}$).

### 11. Accessibility

- Confirm Delete dialog modal prevents accidental deletion (`role="alertdialog"`).

### 12. API Integration Points

- `GET /api/v1/users/me/addresses`
- `POST /api/v1/users/me/addresses`
- `DELETE /api/v1/users/me/addresses/:addressId`

---

## 16. AI Scent Matchmaker Specification

### 1. Page Purpose

An interactive, high-end guided olfactory quiz that analyzes user preferences to generate bespoke fragrance recommendations.

### 2. User Goals & Business Goals

- **User:** Discover tailored fragrance matches without needing prior olfactory expertise.
- **Business:** Capture user preference data, drive hyper-personalized conversion, and position brand innovation.

### 3. Information Hierarchy

1. Quiz Progress Bar Indicator
2. Conversational Question Header
3. Visual Option Cards Choice Grid
4. Final Results Page: Top 3 Recommended Fragrance Matches with Match Percentage Scores

### 4. Layout Structure & Sections

- **Centered Step Container ($800\text{px}$ Width):** \* Step 1: Mood Selection (e.g., Evening Opulence, Fresh Dawn, Mysterious Velvet).
- Step 2: Preferred Scents & Notes (e.g., Smoky Wood, Fresh Citrus, Floral Bloom).
- Step 3: Intensity & Occasion (e.g., Daily Wear, Signature Evening).
- Step 4 (Results): Animated match loader transitioning into 3 featured recommended product cards with "Why this matches you" breakdown.

### 5. Components Used

`ProgressBar`, `Card` (Selectable visual state), `Button`, `ProductCard`, `Badge`.

### 6. Typography Usage

- Question Title: `h1` Serif ($36\text{px}$)
- Choice Card Label: `h3` Serif ($20\text{px}$)
- Match Percentage: `h2` Sans-Serif Gold Accent ($28\text{px}$)

### 7. Spacing Strategy

- Container: `py-20 max-w-4xl mx-auto`. Choice Grid Gap: `gap-6`.

### 8. Responsive Behavior

- Mobile: Choice cards shift to single-column full-width selectable rows.

### 9. Screen States

- **Processing State:** "Analyzing Olfactory Signature..." circular gold animation during AI calculation step.

### 10. Motion & Interactions

- Step transition slides horizontally ($300\text{ms}$ ease-in-out). Selectable choice cards feature active gold halo border animation upon selection.

### 11. Accessibility

- Option selection cards function as an accessible radio group (`role="radiogroup"`) navigable via arrow keys.

### 12. API Integration Points

- `POST /api/v1/products` (Filtered recommendation query payload based on scent vector mapping).

---

## 17. Global Header Specification

### 1. Page Purpose

The primary navigation element present on all pages, providing persistent brand identity, global search access, catalog navigation, and cart visibility.

### 2. User Goals & Business Goals

- **User:** Navigate easily to product categories, access search, view wishlist, access profile, and open cart.
- **Business:** Maintain instant access to essential conversion pathways (Cart, Search, Shop).

### 3. Information Hierarchy

1. Announcement Bar (Top micro-strip)
2. Main Header: Brand Mark (Center), Primary Navigation (Left), Action Icons (Right: Search, Profile, Wishlist, Cart Drawer Trigger)

### 4. Layout Structure & Sections

- **Fixed / Sticky Bar:** Glassmorphic background blur (`backdrop-blur-md`). Height $80\text{px}$. Left side links: "Collections", "Perfumes", "Heritage", "Scent Finder". Center: Brand Serif Logo. Right side: Search Icon, Wishlist Icon with count badge, Cart Bag Icon with count badge.

### 5. Components Used

`Navbar`, `IconButton`, `Badge`, `Link`, `DropdownMenu`.

### 6. Typography Usage

- Brand Logo: `Display Title` Serif ($24\text{px}$)
- Navigation Links: `body-md` Sans-Serif Upper-case tracking-wide ($13\text{px}$)

### 7. Spacing Strategy

- Layout: `px-8 h-20 flex items-center justify-between`. Icon Gap: `space-x-4`.

### 8. Responsive Behavior

- Mobile ($<1024\text{px}$): Navigation links hide; Mobile Menu Hamburger Icon appears on left. Brand logo aligns center. Action icons remain on right.

### 9. Screen States

- **Sticky Scroll State:** Transitions from transparent to solid soft silk background with ultra-thin bottom border on scroll down.

### 10. Motion & Interactions

- Dynamic hover underline animation on navigation links ($150\text{ms}$). Cart count badge scales dynamically when an item is added.

### 11. Accessibility

- Wrapped in semantic `<header>` and `<nav>`. Focus indicator clearly visible on icon buttons.

### 12. API Integration Points

- Integrates client cart context to update count badge in real time.

---

## 18. Footer Specification

### 1. Page Purpose

The foundational anchor containing structural sitemap links, brand philosophy statement, newsletter sign-up, and regulatory compliance disclosures.

### 2. User Goals & Business Goals

- **User:** Access customer support info, review shipping/returns policy, change currency settings, and join newsletter.
- **Business:** Capture emails, provide required legal compliance disclosures, and support SEO navigation crawlability.

### 3. Information Hierarchy

1. Newsletter Registry Capture Bar
2. 4-Column Structural Sitemap Links
3. Copyright, Legal Terms, and Compliance Row

### 4. Layout Structure & Sections

- **Dark Slate Background Section (`Canvas Dark / Noir`):**
- Top Block: Newsletter headline + Email input field + Gold Subscribe button.
- Middle Block (4 Columns):
- Col 1: Brand philosophy text & social links.
- Col 2: Shop links (Perfumes, Discovery Sets, Candle Collections).
- Col 3: Customer Care (Contact Us, Shipping & Returns, Order Tracking, FAQ).
- Col 4: Legal & Corporate (Privacy Policy, Terms of Service, Sustainability).

- Bottom Bar: Copyright string + Payment icon badges.

### 5. Components Used

`Footer`, `Input`, `Button`, `Divider`, `Icon`.

### 6. Typography Usage

- Column Titles: `h4` Serif Gold ($16\text{px}$)
- Links & Text: `body-sm` Sans-Serif ($14\text{px}$)

### 7. Spacing Strategy

- Section Padding: `py-20 px-12`. Column Gap: `gap-12`.

### 8. Responsive Behavior

- Mobile: 4 columns collapse into single-column expandable accordions to optimize vertical height.

### 9. Screen States

- **Newsletter Action States:** Inline success message ("Thank you for registering.") upon submitting email.

### 10. Motion & Interactions

- Subdued opacity hover shift ($80\% \rightarrow 100\%$) on footer text links.

### 11. Accessibility

- All link groups structured using semantic standard HTML5 lists (`<ul>`, `<li>`).

### 12. API Integration Points

- Newsletter submission hook.

---

## 19. Mobile Navigation Specification

### 1. Page Purpose

A slide-over navigation overlay designed specifically for mobile touch viewports to ensure fast full-site access.

### 2. User Goals & Business Goals

- **User:** Effortlessly explore store sections on mobile devices using comfortable touch targets.
- **Business:** Retain mobile traffic engagement through clear, responsive navigation pathways.

### 3. Information Hierarchy

1. Drawer Header (Brand Logo + Close Button `X`)
2. Primary Catalog Links Stack
3. Customer Account Shortcuts (My Account, Wishlist, Order Tracking)
4. Scent Matchmaker Banner CTA

### 4. Layout Structure & Sections

- **Full-screen Slide Drawer ($100\text{vw}$ Left Alignment):** Vertical list of large navigation targets separated by faint dividers. Bottom fixed panel containing direct Account Access button and AI Scent Quiz banner.

### 5. Components Used

`Drawer`, `Button`, `Divider`, `Icon`.

### 6. Typography Usage

- Nav Links: `h2` Serif ($28\text{px}$)
- Sub-links: `body-lg` Sans-Serif ($18\text{px}$)

### 7. Spacing Strategy

- Item Vertical Padding: `py-4 px-6`. Container Stack: `space-y-2`.

### 8. Responsive Behavior

- Mobile Exclusive ($<1024\text{px}$). Hidden automatically on desktop screens.

### 9. Screen States

- **Active State:** Opens instantly on hamburger icon tap.

### 10. Motion & Interactions

- Slide-in transition from left edge ($250\text{ms}$ ease-out).

### 11. Accessibility

- Locks background body scrolling (`body-scroll-lock`) while open. Close button explicitly labeled `aria-label="Close Navigation Menu"`.

### 12. API Integration Points

- Client router navigation triggers.

---

## 20. Global Search Experience Specification

### 1. Page Purpose

An architecture-wide search ecosystem combining instant predictive overlays, keyboard-driven navigation, and structured result listings across all devices.

### 2. User Goals & Business Goals

- **User:** Instantly find fragrances by entering names, ingredients, scent notes, or mood terms.
- **Business:** Convert high-intent search queries directly into product detail views.

### 3. Information Hierarchy

1. Global Search Trigger (Header Bar)
2. Interactive Search Modal Overlay
3. Structured Predictive Sections:

- Direct Product Matches (Image + Title + Price)
- Category / Note Matches (Direct link chips)
- Popular Suggested Terms

### 4. Layout Structure & Sections

- **Overlay Dialog:** Appears suspended over the page. Focuses directly on a clean Search Input with keyboard shortcuts (`Cmd + K` or `/`). Below input, real-time updated results render in 2 column groups: Left (Categories & Recommended Queries), Right (Top 4 Direct Product Matches).

### 5. Components Used

`Modal`, `SearchInput`, `ProductCardTile`, `Badge`, `Skeleton`.

### 6. Typography Usage

- Input Text: `h2` Sans-Serif ($24\text{px}$)
- Result Titles: `h4` Serif ($16\text{px}$)

### 7. Spacing Strategy

- Overlay Container: `max-w-3xl mx-auto mt-20 p-6`. Gap: `gap-6`.

### 8. Responsive Behavior

- Mobile: Displays full screen with direct virtual keyboard focus and clear button.

### 9. Screen States

- **Empty / Zero-state:** Displays recent search history + trending fragrances.
- **Loading State:** Shimmer rows update while user types.
- **No Results State:** Guidance text suggesting broader search terms or direct access to AI Scent Finder.

### 10. Motion & Interactions

- Keyboard navigation highlights items using a clean gold background tint. Immediate debounce response ($200\text{ms}$).

### 11. Accessibility

- Complies fully with WAI-ARIA Combobox pattern. Down Arrow focuses first search item; `Escape` closes search overlay instantly.

### 12. API Integration Points

- `GET /api/v1/products?search=:query&limit=5`
