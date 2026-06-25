# Design System: LifeFlow

## 1. Typography
* **Font Family**: 'Inter' (Primary, for UI elements and reading) and 'JetBrains Mono' (for code snippets in notes).
* **Headings**:
  * H1: 32px, Bold, Tracking -2% (Page Titles)
  * H2: 24px, SemiBold, Tracking -1% (Section Titles)
  * H3: 20px, Medium (Card Titles)
* **Body**:
  * Body Large: 16px, Regular, Line height 1.5
  * Body Medium: 14px, Regular, Line height 1.4 (Default text)
  * Body Small: 12px, Regular (Metadata, timestamps)

## 2. Color Palette
**Theme**: Minimalist Light / Dark mode support.
* **Primary**: `#4F46E5` (Indigo 600) - Used for primary actions, active states.
* **Secondary**: `#10B981` (Emerald 500) - Success, completion, positive habits.
* **Accent**: `#F59E0B` (Amber 500) - Warnings, current active task, streaks.
* **Background**:
  * Light: `#FFFFFF` (Main), `#F9FAFB` (Sidebar/Off-canvas)
  * Dark: `#0F172A` (Main), `#1E293B` (Sidebar/Cards)
* **Text**:
  * Light: `#111827` (Primary), `#4B5563` (Secondary), `#9CA3AF` (Tertiary)
  * Dark: `#F9FAFB` (Primary), `#D1D5DB` (Secondary), `#6B7280` (Tertiary)
* **Borders**: `#E5E7EB` (Light), `#374151` (Dark)

## 3. Spacing & Layout
* **Grid**: 8pt grid system.
* **Spacing Scale**: 4px, 8px, 16px, 24px, 32px, 48px, 64px.
* **Max Width**: 1200px for desktop layouts to maintain readability.

## 4. Border Radius
* **Small**: 4px (Checkboxes, small tags)
* **Medium**: 8px (Buttons, Inputs, small cards)
* **Large**: 12px (Main content cards, Modals)
* **Full**: 9999px (Avatars, circular buttons)

## 5. Shadows & Elevation
* **Level 1 (Hover states)**: `0 1px 3px rgba(0,0,0,0.12)`
* **Level 2 (Cards, Dropdowns)**: `0 4px 6px rgba(0,0,0,0.1)`
* **Level 3 (Modals, Floating Action Buttons)**: `0 10px 15px rgba(0,0,0,0.1)`

## 6. Icons
* **Library**: Phosphor Icons, Lucide, or Radix Icons (clean, consistent stroke width).
* **Size**: 16px (inline), 20px (standard button), 24px (sidebar/nav).
* **Weight**: Regular (1.5px stroke).

## 7. UI Components
### Buttons
* **Primary**: Solid background (`#4F46E5`), white text. Medium radius.
* **Secondary**: Outline border (`#E5E7EB`), text (`#111827`), transparent background. Hover: `#F3F4F6`.
* **Ghost**: No border, text primary color. Hover: faint background.

### Inputs
* **Standard Input**: 1px solid border (`#D1D5DB`), 8px radius, 14px text. Focus state: 2px ring (`#4F46E5`) with no offset.
* **Textarea**: Same as standard input, minimum height 120px.

### Cards
* **Base Card**: White background, Level 1 shadow or 1px border. 16px padding.
* **Interactive Card**: Scales up 1% on hover, Level 2 shadow.

### Modals
* **Backdrop**: Black 40% opacity, backdrop-blur 4px.
* **Container**: Centered, max-width 480px, Level 3 shadow, 12px radius.

### Toast Notifications
* **Position**: Bottom-Right.
* **Styles**: Success (Emerald edge), Error (Red edge), Info (Indigo edge).
* **Behavior**: Auto-dismiss after 3000ms.