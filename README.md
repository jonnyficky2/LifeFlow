# LifeFlow: Personal Operating System

LifeFlow is a modern, lightweight, and calm personal productivity system designed to unite task tracking, habit consistency grids, calendar scheduling, and note taking under a unified **Local-First** and **Markdown-First** architecture.

Inspired by Obsidian, Notion, Things 3, and Linear, LifeFlow is designed to keep you in the zone with zero visual clutter, absolute data ownership, and instant load performance.

---

## 🌟 Core Philosophies

1. **Local-First & Offline-First**: All core configurations, notes, habits, and tasks operate fully in client-side memory and synchronize to `window.localStorage` instantly. The application works flawlessly in the absence of internet.
2. **Calm & Minimal UX**: Visual aesthetics are premium, dark-mode first, and distraction-free. Micro-interactions and buttons are optimized to minimize cognitive load.
3. **High Performance**: Renders at 60fps. Highly optimized compilation via Vite and strict type safety with TypeScript.
4. **PWA Native**: Fully installable as a standalone application on macOS, iOS, Android, and Windows. All static assets (HTML, CSS, JS, SVGs) are precached locally.

---

## 📁 Repository Directory Structure

```
LifeFlow/
  public/                   # Static assets, PWA icons, webmanifest
  docs/                     # The core Product & Project Documentation Hub
    product/                # Product requirements (PRD), core principles, and visions
    project/                # Active task boards, module registry, development logs
    testing/                # UAT checklists and validation guidelines
  src/
    assets/                 # Images and global stylesheet overrides
    components/             # Reusable UI widgets and layout framework
      layout/               # Sidebar, Navbar, and layout shells
      ui/                   # Skeletons, empty states, and modals
    context/                # Global contexts (App, Auth, and Toast notifications)
    hooks/                  # Custom React hooks (useHabits, useTasks, useNotes)
    pages/                  # Route view pages (lazy loaded dynamically)
    services/               # Backend API connection configurations (Firebase)
    utils/                  # Native utility providers (QuoteProvider, levels)
  legacy_html_version/      # Archive of original HTML codebase (for parity tracking)
```

---

## 🛠️ Local Development & Scripts

To get started with local development:

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Run Local Server (Dev)**:
   ```bash
   npm run dev
   ```

3. **Production Type-Check & Compile (Vite)**:
   ```bash
   npm run build
   ```

4. **Run Linter (Oxlint)**:
   ```bash
   npm run lint
   ```

5. **Preview Production Build**:
   ```bash
   npm run preview
   ```

---

## 🔒 Security & Privacy by Design

No vendor lock-in. Your data belongs exclusively to you and remains stored on your device. Cross-device snapshot backups and recoveries are enabled securely via your private Google Profile in your Settings panel.
