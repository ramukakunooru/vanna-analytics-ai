# Design Guidelines: AI-Powered Analytics Dashboard

## Design Approach
**System Selected:** Carbon Design System + Modern Dashboard Patterns  
**Rationale:** This is a data-intensive, enterprise analytics application requiring clarity, consistency, and efficient information processing. Carbon's approach to data visualization, tables, and structured content aligns perfectly with the technical requirements.

## Core Design Principles
1. **Data First:** Visual hierarchy emphasizes insights over decoration
2. **Scanning Efficiency:** Users should quickly locate critical metrics
3. **Progressive Disclosure:** Complex data revealed through interaction
4. **Consistent Patterns:** Reduce cognitive load with predictable layouts

---

## Typography

**Font Family:** Inter (Google Fonts) - excellent readability for data
- **Headlines/Metrics:** 600 weight, varying sizes
- **Body/Labels:** 400 weight
- **Data Values:** 500 weight (medium) for emphasis

**Hierarchy:**
- Dashboard Title: text-2xl font-semibold
- Section Headers: text-lg font-semibold  
- Card Titles: text-sm font-medium uppercase tracking-wide
- Metric Values: text-3xl font-semibold
- Metric Labels: text-xs uppercase tracking-wider
- Table Headers: text-xs font-medium uppercase
- Body Text: text-sm
- Captions/Meta: text-xs

---

## Layout System

**Spacing Primitives:** Tailwind units of 2, 4, 6, 8, 12, 16  
**Container:** max-w-7xl mx-auto px-4 lg:px-8

**Dashboard Grid:**
- Overview cards: grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4
- Chart sections: grid-cols-1 lg:grid-cols-2 gap-6
- Full-width table: Single column with rounded container

**Consistent Spacing:**
- Card padding: p-6
- Section spacing: space-y-8
- Component gaps: gap-4 to gap-6
- Page margins: py-8

---

## Component Library

### 1. Overview Metric Cards
- Rounded corners: rounded-lg
- Border: border with subtle treatment
- Padding: p-6
- Structure:
  - Label (text-xs uppercase tracking-wider)
  - Large metric value (text-3xl font-semibold)
  - Trend indicator (small icon + percentage in green/red)
  - Optional sparkline mini-chart below

### 2. Chart Containers
- Same card styling as metric cards
- Header with title + optional time range selector (dropdown)
- Chart area: minimum h-80 for visibility
- Legend positioned outside chart area
- Responsive: reduce height on mobile (h-64)

**Chart Types:**
- **Line Chart** (Invoice Trends): Smooth curves, grid lines, two y-axes (volume + value)
- **Horizontal Bar** (Top 10 Vendors): Left-aligned labels, values on bars
- **Pie/Donut Chart** (Category Spend): Interactive segments, external labels
- **Bar Chart** (Cash Outflow): Grouped/stacked bars, clear axis labels

### 3. Data Table (Invoices)
- Container: rounded-lg border
- Header: Sticky with search/filter controls (flex justify-between items-center p-4)
- Table styling:
  - Dense rows (py-3 px-4)
  - Alternating row backgrounds for readability
  - Sortable columns with arrow indicators
  - Status badges: rounded-full px-3 py-1 text-xs font-medium
  - Hover state on rows
  - Pagination footer
- Search bar: w-full md:w-80 with icon prefix

### 4. Chat Interface (Sidebar)
**Layout:** Two-panel split on desktop (70/30), tab-based on mobile

**Chat Panel:**
- Full height: h-screen with internal scroll
- Messages area: flex-1 overflow-y-auto space-y-4 p-6
- Input area: Sticky bottom with border-t p-4

**Message Bubbles:**
- User messages: ml-auto max-w-2xl rounded-lg p-4
- AI responses: mr-auto max-w-2xl rounded-lg p-4
- SQL code block: bg-slate-900 rounded p-4 with syntax highlighting
- Results table: Compact version of main data table
- Optional chart: h-64 embedded visualization

**Input Box:**
- Rounded: rounded-full
- With send button (icon only) absolute right-2
- Placeholder: "Ask about your data..."
- Multi-line support (textarea, max 4 rows)

### 5. Navigation
**Top Bar:**
- h-16 border-b
- Logo left (h-8)
- Navigation items: flex gap-8 (Dashboard, Chat, Reports)
- User menu right: Avatar + dropdown
- Mobile: Hamburger menu

**No Sidebar:** Dashboard uses full-width layout; Chat is separate view/tab

---

## Interaction Patterns

### Loading States
- Skeleton screens for cards/charts (animate-pulse)
- Spinner for chat responses
- Progressive loading for table (paginated)

### Empty States  
- Centered icon + message
- Suggested actions (e.g., "Upload invoices to see analytics")

### Streaming Chat
- Typing indicator (three dots animation)
- Progressive SQL display (character by character)
- Results fade in after SQL completes

---

## Responsive Behavior

**Breakpoints:**
- Mobile: base (stacked layout)
- Tablet: md (2-column grids)
- Desktop: lg (4-column cards, 2-column charts)

**Mobile Optimizations:**
- Cards: Full width, reduced padding (p-4)
- Charts: Reduced height, simplified legends
- Table: Horizontal scroll with sticky first column
- Chat: Full-screen overlay, hide dashboard

---

## Images

**No hero image required** - This is a utility dashboard, not marketing.  

**Icon Usage:**
- Heroicons (via CDN) for UI controls
- Chart.js/Recharts icons for data viz legend items
- Status indicators: Colored dots/badges, not icons

**Optional Illustrations:**
- Empty states: Simple line illustrations (unDraw style)
- Onboarding: Optional walkthrough graphics

---

## Performance Considerations
- Lazy load charts below fold
- Virtual scrolling for large tables (100+ rows)
- Debounced search (300ms)
- Cached chart data (5min refresh)