# UI Syntax - Component Documentation Site

A modern, SyntaxUI-inspired documentation site built with Next.js 15, TypeScript, Tailwind CSS, and MDX.

## 🎨 Features

- **Deep Dark Mode**: Zinc-950 background with subtle grid patterns
- **Hierarchical Sidebar Navigation**: Organized component categories with nested variants
- **Responsive Design**: Desktop sidebar with mobile drawer layout
- **Live Code Previews**: Component previews with syntax-highlighted code
- **MDX Support**: Write component documentation as MDX files
- **Smooth Animations**: Framer Motion for sidebar interactions
- **Fully Typed**: Built with TypeScript for type safety

## 🚀 Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## 📁 Project Structure

```
src/
├── app/
│   ├── layout.tsx                  # Root layout
│   ├── page.tsx                    # Home page
│   ├── RootLayout.tsx              # Main wrapper with sidebar
│   ├── docs/
│   │   ├── layout.tsx              # Docs layout
│   │   └── [category]/[variant]/page.tsx  # Component pages
├── components/
│   ├── Sidebar.tsx                 # Recursive sidebar
│   └── ComponentPreview.tsx
└── lib/
    └── mdx.ts                      # MDX utilities

content/
└── components/
    ├── button/
    │   ├── primary.mdx
    │   ├── ghost.mdx
    │   └── neumorphic.mdx
    ├── modal/
    │   └── basic.mdx
    └── input/
        └── text.mdx
```

## 🛠️ Technology Stack

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- MDX with Next MDX Remote
- Framer Motion
- Lucide React Icons
- Shiki (syntax highlighting)
- Gray Matter (front matter parsing)

## ✨ Key Features

### Hierarchical Sidebar Navigation

The sidebar automatically generates from your MDX files with recursive nesting:

```
Home
Docs
├── Button
│   ├── Primary
│   ├── Ghost
│   └── Neumorphic
├── Modal
│   └── Basic
└── Input
    └── Text
```

### Responsive Design

- **Desktop**: Sidebar visible alongside content (280px)
- **Mobile**: Hamburger menu that opens drawer overlay
- **Smooth transitions**: Framer Motion animations

### SyntaxUI Aesthetic

- Deep dark mode (zinc-950)
- Subtle 40px grid background pattern
- 1px refined borders (zinc-800)
- Clean system typography
- Active state highlighting (zinc-800)

### Dynamic Routes

Routes are automatically generated from MDX files:

- `/docs/button/primary`
- `/docs/modal/basic`
- `/docs/input/text`

## 📝 Adding Components

1. Create an MDX file:

```bash
content/components/[category]/[variant].mdx
```

2. Add front matter:

```mdx
---
title: Component Name
description: Brief description
category: Category
variant: VariantName
---
```

3. Write your documentation with markdown and embedded JSX

## 🎯 Developer Experience

The sidebar acts as a precise filter allowing users to:

1. Browse high-level component categories
2. Drill down to specific design variants
3. View live previews
4. Copy component code instantly

## 📱 Responsive Behavior

- Desktop: Full-width sidebar (280px) + collapsible sections
- Tablet: Sidebar drawer on toggle
- Mobile: Bottom navigation with slide-in drawer

## 🚀 Build & Deploy

```bash
npm run build      # Static pre-rendering
npm start          # Production server
```

All component pages are pre-rendered at build time for maximum performance.

## 📄 License

MIT

---

**Built with ❤️ using Next.js 15 and Tailwind CSS**
