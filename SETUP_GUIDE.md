# UI Syntax - Complete Setup & Architecture Guide

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Setup Instructions](#setup-instructions)
4. [File Structure](#file-structure)
5. [Component Documentation](#component-documentation)
6. [Sidebar Navigation](#sidebar-navigation)
7. [Responsive Design](#responsive-design)
8. [Customization Guide](#customization-guide)
9. [Deployment](#deployment)

---

## Project Overview

**UI Syntax** is a modern component documentation site that combines:

- **Next.js 15 App Router**: Server Components and optimized rendering
- **SyntaxUI Aesthetic**: Deep dark mode with refined typography
- **MDX Integration**: Markdown + JSX for flexible documentation
- **Hierarchical Navigation**: Smart sidebar with collapsible categories

### Key Characteristics

```
┌─────────────────────────────────────────┐
│          UI SYNTAX AESTHETIC            │
├─────────────────────────────────────────┤
│ Background:  zinc-950 (#09090b)         │
│ Text:        zinc-50 (#fafafa)          │
│ Borders:     1px zinc-800 (#27272a)     │
│ Grid:        40px, 5% opacity zinc      │
│ Radius:      0.375-0.5rem (typical)     │
│ Shadows:     Subtle, layered            │
│ Transitions: 200-300ms smooth           │
└─────────────────────────────────────────┘
```

---

## Architecture

### Component Hierarchy

```
Layout (Root)
├── RootLayout (Sidebar + Main)
│   ├── Sidebar (Desktop)
│   │   └── SidebarNavItem (Recursive)
│   ├── SidebarDrawer (Mobile)
│   └── Main Content
│       ├── Page Content
│       └── Dynamic Routes
```

### Data Flow

```
MDX Files
    ↓
Gray Matter (Parse Front Matter)
    ↓
getCategoryStructure() [mdx.ts]
    ↓
Sidebar Tree Generation
    ↓
Active State Tracking
    ↓
Dynamic Route Rendering
```

### Key Systems

#### 1. **Content System**
- MDX files in `content/components/[category]/[variant].mdx`
- Front matter metadata (title, description, category, variant)
- Automatic file discovery at build time

#### 2. **Navigation System**
- Recursive sidebar component
- Automatic category detection
- Active route highlighting
- Collapsible sections with smooth animations

#### 3. **Rendering System**
- Static pre-rendering for all component pages
- Server-side MDX parsing
- Client-side sidebar state management

---

## Setup Instructions

### Prerequisites

```bash
Node.js 18+
npm or yarn or pnpm
```

### Initial Setup

```bash
# Clone or navigate to project
cd ui-syntax

# Install dependencies
npm install

# Start development server
npm run dev

# Open in browser
# http://localhost:3000
```

### Build for Production

```bash
# Create optimized build
npm run build

# Preview production build locally
npm start
```

---

## File Structure

### Complete Project Layout

```
ui-syntax/
│
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root HTML/Body wrapper
│   │   ├── page.tsx                # Home page (/)
│   │   ├── globals.css             # Global styles + grid pattern
│   │   ├── RootLayout.tsx          # Main layout with sidebar
│   │   │
│   │   └── docs/
│   │       ├── layout.tsx          # Docs layout wrapper
│   │       └── [category]/
│   │           └── [variant]/
│   │               └── page.tsx    # Component page renderer
│   │
│   ├── components/
│   │   ├── Sidebar.tsx             # Sidebar component (desktop)
│   │   ├── ComponentPreview.tsx    # Preview wrapper
│   │   └── SimpleComponentPreview.tsx
│   │
│   └── lib/
│       └── mdx.ts                  # Content utilities
│
├── content/
│   └── components/
│       ├── button/
│       │   ├── primary.mdx
│       │   ├── ghost.mdx
│       │   └── neumorphic.mdx
│       ├── modal/
│       │   └── basic.mdx
│       ├── input/
│       │   └── text.mdx
│       └── card/
│           ├── default.mdx
│           └── elevated.mdx
│
├── public/              # Static assets
├── node_modules/        # Dependencies
├── .git/               # Git repository
│
├── next.config.ts      # Next.js configuration
├── tailwind.config.ts  # Tailwind CSS config
├── tsconfig.json       # TypeScript config
├── postcss.config.mjs  # PostCSS config
├── package.json        # Dependencies
├── package-lock.json   # Lock file
└── README.md           # Project documentation
```

### Critical Files

#### `src/app/globals.css`
Defines the SyntaxUI aesthetic:
```css
- Deep dark background (zinc-950)
- Subtle grid pattern (40px)
- Custom scrollbar styling
- Selection colors
```

#### `src/lib/mdx.ts`
Content discovery system:
```typescript
- getAllComponents()      # Scan all MDX files
- getComponentBySlug()    # Get single component
- getComponentsByCategory() # Group by category
- getCategoryStructure()  # Generate navigation tree
```

#### `src/components/Sidebar.tsx`
Navigation component:
```typescript
- Recursive rendering of nested items
- Framer Motion animations
- Active state detection
- Desktop/Mobile variants
```

#### `content/components/[category]/[variant].mdx`
Documentation format:
```markdown
---
title: Component Name
description: Brief description
category: Category
variant: VariantName
---

Documentation content...
```

---

## Component Documentation

### MDX File Format

Every component gets an MDX file with:

#### 1. **Front Matter**
```yaml
---
title: Component Name          # Displayed in sidebar
description: What it does      # Meta description
category: Category             # Group name
variant: VariantName           # Specific variant
---
```

#### 2. **Documentation Content**
```mdx
Brief description of the component...

**Preview:**

<component code here />

**Code:**

\`\`\`tsx
component code...
\`\`\`

## Features

- Feature 1
- Feature 2
```

### Example: Primary Button

```mdx
---
title: Primary Button
description: Main call-to-action button
category: Button
variant: Primary
---

The primary button is used for main actions...

**Preview:**

<button className="px-4 py-2 bg-zinc-100 text-zinc-950 rounded">
  Primary Button
</button>

**Code:**

\`\`\`tsx
<button className="px-4 py-2 bg-zinc-100 text-zinc-950 rounded">
  Primary Button
</button>
\`\`\`
```

### Adding a New Component Category

1. **Create folder structure**
```bash
mkdir -p content/components/badge
```

2. **Create variant files**
```bash
touch content/components/badge/default.mdx
touch content/components/badge/success.mdx
```

3. **Add MDX content with front matter**

4. **Rebuild the project**
```bash
npm run build
npm run dev
```

The sidebar will automatically update!

---

## Sidebar Navigation

### Structure

The sidebar auto-generates from your file structure:

```
content/components/
├── button/
│   ├── primary.mdx      → Button > Primary
│   ├── ghost.mdx        → Button > Ghost
│   └── neumorphic.mdx   → Button > Neumorphic
├── modal/
│   └── basic.mdx        → Modal > Basic
└── input/
    └── text.mdx         → Input > Text
```

### Navigation Behavior

| Action | Behavior |
|--------|----------|
| Click category | Expands/collapses |
| Click variant | Navigates to page |
| Visit page | Category expands, variant highlighted |
| Scroll | Sidebar stays fixed (desktop) |
| Mobile | Drawer overlays content |

### Active States

```typescript
// Category active if any child is selected
const isActiveCategory = item.children?.some(child => 
  pathname.startsWith(child.href)
);

// Variant active if exact match
const isActive = item.href && pathname === item.href;
```

### Styling

```typescript
// Active category
bg-zinc-800 text-zinc-50

// Hover state
hover:text-zinc-200 hover:bg-zinc-900/50

// Inactive
text-zinc-400
```

---

## Responsive Design

### Breakpoints

- **Mobile**: < 768px (default)
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### Layout Changes

#### Desktop (md and above)
```
┌─────────────────────────────────────┐
│ ┌──────┐ ┌──────────────────────┐  │
│ │      │ │                      │  │
│ │ 280  │ │    Main Content      │  │
│ │  px  │ │                      │  │
│ │      │ │                      │  │
│ └──────┘ └──────────────────────┘  │
└─────────────────────────────────────┘
```

#### Mobile (below md)
```
┌──────────────────────┐
│ ☰  UI SYNTAX         │
├──────────────────────┤
│                      │
│    Main Content      │
│                      │
│                      │
└──────────────────────┘
```

### Components

```typescript
<Sidebar />          // Desktop sidebar (md:flex, hidden)
<SidebarDrawer />    // Mobile overlay drawer
<SidebarToggle />    // Hamburger menu button
```

---

## Customization Guide

### 1. **Change Colors**

Edit global CSS in `src/app/globals.css`:

```css
body {
  @apply bg-zinc-950;  /* Change to your color */
}
```

Or in Tailwind classes:
- Replace `zinc-950` with `gray-950`, `slate-950`, etc.
- Replace `zinc-800` with your brand colors

### 2. **Adjust Sidebar Width**

Find sidebar width in `src/app/RootLayout.tsx`:

```typescript
<div className="hidden md:flex md:w-[280px]">
  {/* Change 280px to desired width */}
</div>
```

### 3. **Modify Grid Pattern**

In `src/app/globals.css`:

```css
background-image: 
  linear-gradient(rgba(113, 113, 122, 0.05) 1px, transparent 1px),
  linear-gradient(90deg, rgba(113, 113, 122, 0.05) 1px, transparent 1px);
background-size: 40px 40px;  /* Change grid size */
```

### 4. **Update Typography**

Edit Tailwind theme or font sizes in component classes.

### 5. **Add Custom Icons**

Lucide React icons are already integrated:

```typescript
import { ChevronDown, Menu, X } from 'lucide-react';
```

Browse more at [lucide.dev](https://lucide.dev)

### 6. **Extend MDX Components**

In `src/app/docs/[category]/[variant]/page.tsx`:

```typescript
const components = {
  // Add custom components here
  Alert: (props) => <CustomAlert {...props} />,
};
```

---

## Deployment

### Vercel (Recommended)

```bash
# Push to GitHub
git push origin main

# Connect via Vercel dashboard
# Auto-deploys on push
```

### Self-Hosted (Docker)

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY .next ./
EXPOSE 3000
CMD ["npm", "start"]
```

```bash
docker build -t ui-syntax .
docker run -p 3000:3000 ui-syntax
```

### Static Export

```bash
# In next.config.ts
const nextConfig: NextConfig = {
  output: 'export',
};
```

```bash
npm run build
# Output in out/ folder
```

---

## Advanced Topics

### Extending the Content System

Add custom metadata to front matter:

```mdx
---
title: Component
category: Category
variant: Variant
tags: [button, interactive]
status: experimental
since: 1.0.0
---
```

Update `ComponentMetadata` interface in `src/lib/mdx.ts`.

### Adding Search Functionality

```typescript
// Filter components by query
const filteredComponents = allComponents.filter(c =>
  c.metadata.title.toLowerCase().includes(query) ||
  c.metadata.description.toLowerCase().includes(query)
);
```

### Performance Optimization

- ✅ Static pre-rendering (all pages at build time)
- ✅ Code splitting (per-route chunks)
- ✅ Image optimization (via Next.js)
- ✅ CSS minification (Tailwind)

---

## Troubleshooting

### Build Fails

**Problem**: MDX file not found  
**Solution**: Check file exists in `content/components/[category]/[variant].mdx`

**Problem**: Front matter invalid  
**Solution**: Ensure YAML syntax is correct

### Sidebar Not Updating

**Problem**: New components don't appear  
**Solution**: Run `npm run build`, then `npm run dev`

### Routes Not Generated

**Problem**: `/docs/category/variant` returns 404  
**Solution**: Ensure MDX file exists and build is complete

---

## Best Practices

1. ✅ **Organize by category**: Group similar components
2. ✅ **Clear descriptions**: Help users understand purpose
3. ✅ **Consistent naming**: Use descriptive variant names
4. ✅ **Copy-paste ready code**: Users should be able to use code directly
5. ✅ **Visual hierarchy**: Use headings and sections
6. ✅ **Mobile-first**: Test on all breakpoints

---

## Summary

UI Syntax provides a complete, modern solution for component documentation with:

- 📁 **File-based routing** via MDX structure
- 🎨 **SyntaxUI aesthetic** with dark mode
- 📱 **Fully responsive** design
- ⚡ **Static pre-rendering** for performance
- 🎯 **Hierarchical navigation** for discovery
- 🚀 **Zero-config** setup with Next.js

Start building your component library today! 🎉

---

**For more information, see [DOCUMENTATION.md](./DOCUMENTATION.md)**
