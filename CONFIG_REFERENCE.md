# UI Syntax - Configuration Reference

## Quick Reference

### Essential Files

| File | Purpose | Type |
|------|---------|------|
| `src/app/globals.css` | Global styles + grid | CSS |
| `src/lib/mdx.ts` | Content discovery | TypeScript |
| `src/components/Sidebar.tsx` | Navigation | React/TS |
| `src/app/RootLayout.tsx` | Main layout | React/TS |
| `src/app/page.tsx` | Home page | React/TS |
| `content/components/**/*.mdx` | Documentation | MDX |
| `package.json` | Dependencies | JSON |

---

## Package Dependencies

### Core Framework
```json
{
  "next": "16.1.2",
  "react": "^19.0.0",
  "react-dom": "^19.0.0"
}
```

### Styling
```json
{
  "tailwindcss": "^4.0.0",
  "@tailwindcss/postcss": "^4.0.0"
}
```

### Content & MDX
```json
{
  "next-mdx-remote": "^5.0.0",
  "@mdx-js/react": "^3.0.0",
  "@mdx-js/loader": "^3.0.0",
  "gray-matter": "^4.0.0"
}
```

### Animation & Icons
```json
{
  "framer-motion": "^11.0.0",
  "lucide-react": "^0.425.0"
}
```

### Utilities
```json
{
  "clsx": "^2.0.0"
}
```

### Dev Dependencies
```json
{
  "@types/node": "^20",
  "@types/react": "^18",
  "@types/react-dom": "^18",
  "typescript": "^5",
  "eslint": "^8",
  "eslint-config-next": "16.1.2",
  "@tailwindcss/postcss": "^4.0.0"
}
```

---

## TypeScript Interfaces

### Content System

```typescript
// src/lib/mdx.ts
export interface ComponentMetadata {
  title: string;
  description: string;
  category: string;
  variant?: string;
}

export interface ComponentDoc {
  metadata: ComponentMetadata;
  content: string;
  slug: string;
  filePath: string;
}
```

### Navigation System

```typescript
// src/components/Sidebar.tsx
export interface SidebarItem {
  name: string;
  href?: string;
  children?: SidebarItem[];
  icon?: React.ReactNode;
}

interface SidebarProps {
  items: SidebarItem[];
  title?: string;
  onClose?: () => void;
  isMobile?: boolean;
}

interface SidebarNavItemProps {
  item: SidebarItem;
  depth?: number;
  pathname: string;
}
```

---

## Environment Variables

Create `.env.local` if needed:

```bash
# .env.local
NEXT_PUBLIC_SITE_NAME=UI Syntax
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Access in components:
```typescript
const siteName = process.env.NEXT_PUBLIC_SITE_NAME;
```

---

## Build Configuration

### Next.js Config
```typescript
// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Add options here as needed
  // typescript: { tsconfigPath: './tsconfig.json' },
  // webpack: { /* loader config */ },
};

export default nextConfig;
```

### Tailwind Config
```javascript
// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
export default config
```

### PostCSS Config
```javascript
// postcss.config.mjs
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;
```

### TypeScript Config
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

---

## NPM Scripts

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  }
}
```

### Usage
```bash
npm run dev      # Start dev server (http://localhost:3000)
npm run build    # Create production build
npm start        # Run production build
npm run lint     # Run ESLint
```

---

## Directory Aliases

Configured in `tsconfig.json`:

```typescript
// Use this:
import { Sidebar } from '@/components/Sidebar';

// Instead of:
import { Sidebar } from '../../../components/Sidebar';
```

Available aliases:
- `@/*` → `./src/*`

---

## Route Map

### Static Routes
```
/                          → Home page
/_not-found                → 404 page
```

### Dynamic Routes
```
/docs/[category]/[variant] → Component documentation
```

### Generated Routes (Examples)
```
/docs/button/primary       → Button > Primary
/docs/button/ghost         → Button > Ghost
/docs/modal/basic          → Modal > Basic
/docs/input/text           → Input > Text
/docs/card/default         → Card > Default
/docs/card/elevated        → Card > Elevated
```

---

## CSS Classes Reference

### Layout
```typescript
// Container widths
'max-w-5xl'     // 64rem (1024px)
'max-w-6xl'     // 72rem (1152px)

// Spacing
'p-4', 'px-4', 'py-4'       // 1rem padding
'gap-2', 'gap-3', 'gap-4'   // Gap between items
'space-y-1', 'space-y-4'    // Vertical spacing

// Flexbox
'flex', 'flex-col', 'items-center', 'justify-between'
```

### Colors
```typescript
// Background
'bg-zinc-950'      // #09090b (main bg)
'bg-zinc-900'      // #18181b (slightly lighter)
'bg-zinc-800'      // #27272a (active state)

// Text
'text-zinc-50'     // #fafafa (primary text)
'text-zinc-100'    // #f4f4f5 (secondary text)
'text-zinc-300'    // #d4d4d8
'text-zinc-400'    // #a1a1a6
'text-zinc-500'    // #71717a

// Borders
'border-zinc-800'  // 1px border color
'border-l-2'       // Left border
'border-b'         // Bottom border
'border-r'         // Right border
```

### Interactions
```typescript
// Hover states
'hover:bg-zinc-900/50'
'hover:text-zinc-200'
'hover:shadow-xl'

// Focus states
'focus:border-zinc-500'
'focus:outline-none'

// Transitions
'transition-colors'   // For color changes
'transition-shadow'   // For shadow changes
'duration-200'        // 200ms timing
```

### Responsive
```typescript
'md:hidden'         // Hidden on desktop
'md:flex'           // Flex on desktop
'hidden md:flex'    // Mobile: hidden, Desktop: flex
'md:w-[280px]'      // Custom width on desktop
```

---

## Font Configuration

### System Fonts
```typescript
// In globals.css
font-family: system-ui, -apple-system, sans-serif;

// Or using Geist
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
```

### Typography Scale
```css
/* Headings */
h1 { font-size: 2.25rem; font-weight: 700; }
h2 { font-size: 1.875rem; font-weight: 700; }
h3 { font-size: 1.125rem; font-weight: 600; }

/* Body */
p { font-size: 1rem; font-weight: 400; }
small { font-size: 0.875rem; }
```

---

## Animation Configuration

### Framer Motion
```typescript
// Chevron rotation
<motion.div
  animate={{ rotate: isOpen ? 180 : 0 }}
  transition={{ duration: 0.2 }}
/>

// Drawer slide
<motion.div
  initial={{ x: -280 }}
  animate={{ x: 0 }}
  exit={{ x: -280 }}
  transition={{ duration: 0.2 }}
/>

// Expand/collapse
<motion.div
  initial={{ opacity: 0, height: 0 }}
  animate={{ opacity: 1, height: 'auto' }}
  exit={{ opacity: 0, height: 0 }}
/>
```

---

## Accessibility Features

### Keyboard Navigation
```typescript
<button
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      setIsOpen(!isOpen);
    }
  }}
/>
```

### ARIA Labels
```typescript
<button aria-label="Close sidebar" onClick={onClose}>
  <X />
</button>
```

### Focus States
```css
focus:border-zinc-500
focus:outline-none
```

### Color Contrast
- Text: zinc-50 on zinc-950 (WCAG AA ✓)
- Links: zinc-300 on zinc-900 (WCAG AA ✓)

---

## Performance Optimization

### Static Pre-rendering
```bash
npm run build
# All routes are pre-rendered at build time
```

### Code Splitting
Next.js automatically splits code per route.

### CSS Optimization
- Tailwind purges unused styles
- Production CSS ~50KB gzipped

### Image Optimization
Use `next/image` for any images:
```typescript
import Image from 'next/image';

<Image
  src="/image.png"
  alt="Description"
  width={100}
  height={100}
/>
```

---

## Debugging

### Enable Debug Logging
```typescript
// In components/Sidebar.tsx
console.log('Active category:', isActiveCategory);
console.log('Current pathname:', pathname);
```

### Next.js Debug Mode
```bash
DEBUG=* npm run dev
```

### Browser DevTools
- React DevTools: Inspect component state
- Network tab: Check bundle sizes
- Lighthouse: Performance audit

---

## Deployment Checklist

- [ ] All MDX files have valid front matter
- [ ] No broken links in sidebar
- [ ] Build completes successfully
- [ ] Test all routes locally
- [ ] Check mobile responsiveness
- [ ] Verify images/assets load
- [ ] Test on target browsers
- [ ] Performance audit (Lighthouse)
- [ ] SEO meta tags added
- [ ] Security headers configured

---

## Troubleshooting Commands

```bash
# Clear build cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules
npm install

# Full clean build
npm run build

# Dev server with verbose logging
DEBUG=* npm run dev

# Build with analysis
npm run build -- --debug

# Check TypeScript errors
npx tsc --noEmit
```

---

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Framer Motion Documentation](https://www.framer.com/motion)
- [MDX Documentation](https://mdxjs.com)
- [Lucide React Icons](https://lucide.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)

---

## Version Information

```
Next.js: 16.1.2
React: 19.0.0
TypeScript: 5.x
Tailwind CSS: 4.x
Node.js: 18+
```

---

**Last Updated**: January 2026  
**Status**: Production Ready ✅
