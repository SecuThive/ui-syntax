# Recursive Sidebar Component - Deep Dive

## Overview

The Sidebar component in `src/components/Sidebar.tsx` implements a **recursive navigation system** that automatically handles nested categories and variants.

## Architecture

### Component Structure

```typescript
Sidebar (Root Container)
├── Header Section
├── SidebarNavItem (Recursive)
│   ├── Category (with expand/collapse)
│   │   └── SidebarNavItem (depth + 1)
│   │       ├── Variant
│   │       └── SidebarNavItem (depth + 2)
│   │           └── ... more items
│   └── Direct Link (variant)
└── Footer Section
```

### Key Props

```typescript
interface SidebarItem {
  name: string;              // Display name
  href?: string;             // Link URL (optional)
  children?: SidebarItem[];  // Nested items
  icon?: React.ReactNode;    // Custom icon
}

interface SidebarNavItemProps {
  item: SidebarItem;        // Current item to render
  depth?: number;           // Nesting level (0, 1, 2...)
  pathname: string;         // Current route
}
```

## Component Breakdown

### 1. Sidebar Component

The root component that manages the overall layout:

```typescript
export const Sidebar: React.FC<SidebarProps> = ({
  items,
  title = 'UI Syntax',
  onClose,
  isMobile = false,
}) => {
  const pathname = usePathname();

  return (
    <div className="h-full flex flex-col bg-zinc-900/50 border-r border-zinc-800">
      {/* Header */}
      <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
        <h1 className="text-lg font-bold text-zinc-50">{title}</h1>
        {isMobile && onClose && (
          <button onClick={onClose} className="...">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 overflow-y-auto p-2 space-y-1">
        {items.map((item) => (
          <SidebarNavItem 
            key={item.name} 
            item={item} 
            pathname={pathname} 
          />
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-zinc-800 text-xs text-zinc-500">
        <p>© 2026 UI Syntax</p>
      </div>
    </div>
  );
};
```

**Key Points**:
- `usePathname()` tracks current route for active states
- Navigation items passed in as array
- Responsive layout with flex columns
- Footer contains copyright info

### 2. SidebarNavItem Component (Recursive)

The core recursive component:

```typescript
const SidebarNavItem: React.FC<SidebarNavItemProps> = ({ 
  item, 
  depth = 0, 
  pathname 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = item.children && item.children.length > 0;
  const isActive = item.href && pathname === item.href;
  const isActiveCategory = item.children?.some(
    (child) => pathname.startsWith(child.href || '')
  );

  const paddingLeft = `${depth * 16}px`;

  // Render logic below...
};
```

#### State Management

```typescript
const [isOpen, setIsOpen] = useState(false);
```

Each item maintains its own open/closed state:
- `isOpen = true`: Shows children
- `isOpen = false`: Hides children
- Only toggled if `hasChildren = true`

#### Active State Detection

```typescript
// Direct link is active
const isActive = item.href && pathname === item.href;

// Category is active if any child matches the route
const isActiveCategory = item.children?.some(
  (child) => pathname.startsWith(child.href || '')
);
```

Examples:
```
Current route: /docs/button/primary

// Button category
- hasChildren: true
- children: [Primary, Ghost, Neumorphic]
- isActiveCategory: true ✓

// Primary variant
- href: "/docs/button/primary"
- isActive: true ✓

// Ghost variant
- href: "/docs/button/ghost"
- isActive: false ✗
```

#### Nested Indentation

```typescript
const paddingLeft = `${depth * 16}px`;
```

Creates visual hierarchy through left padding:

```
Depth 0 (Category):     0px   →  Home, Docs
Depth 1 (Category):     16px  →  Button, Modal
Depth 2 (Variant):      32px  →  Primary, Ghost
Depth 3+ (Sub-items):   48px+ →  Future use
```

### 3. Rendering Logic

#### For Categories (with children)

```typescript
if (hasChildren) {
  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between ..."
      >
        <span className="flex items-center gap-2">
          {item.icon && <span className="w-4 h-4">{item.icon}</span>}
          <span className="text-sm font-medium">{item.name}</span>
        </span>
        <motion.div
          initial={false}
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </button>
      
      {/* Nested Items with Animation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            {item.children!.map((child) => (
              <SidebarNavItem
                key={child.name}
                item={child}
                depth={depth + 1}
                pathname={pathname}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
```

**Key Features**:
- Button click toggles `isOpen` state
- Chevron icon rotates when expanded
- Nested items rendered recursively with `depth + 1`
- Framer Motion handles expand/collapse animation

#### For Direct Links (no children)

```typescript
else {
  return (
    <Link
      href={item.href || '#'}
      className={clsx(
        'flex items-center gap-2 px-3 py-2 rounded-md transition-colors block',
        isActive
          ? 'bg-zinc-800 text-zinc-50 border-l-2 border-zinc-100'
          : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50'
      )}
      style={{ paddingLeft }}
    >
      {item.icon && <span className="w-4 h-4">{item.icon}</span>}
      <span className="text-sm font-medium">{item.name}</span>
    </Link>
  );
}
```

**Key Features**:
- Direct navigation link
- Active state: darker background + left border
- Hover state: lighter text + background
- Icon support with proper sizing

### 4. Mobile Drawer

```typescript
export const SidebarDrawer: React.FC<SidebarDrawerProps> = ({
  items,
  title,
  isOpen,
  onClose,
}) => {
  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ duration: 0.2 }}
            className="fixed left-0 top-0 h-full w-[280px] z-50 md:hidden"
          >
            <Sidebar items={items} title={title} onClose={onClose} isMobile={true} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
```

**Features**:
- Slides in from left (-280px to 0)
- Backdrop click closes drawer
- Hidden on desktop (md:hidden)
- Reuses Sidebar component

## Usage Example

### Building the Navigation Tree

```typescript
const categoryStructure = await getCategoryStructure();

const sidebarItems: SidebarItem[] = [
  {
    name: 'Home',
    href: '/',
    icon: <Code2 className="w-full h-full" />,
  },
  {
    name: 'Docs',
    icon: <FileText className="w-full h-full" />,
    children: categoryStructure.map((cat) => ({
      name: cat.category,                    // "Button"
      icon: <SquareMenu className="w-full h-full" />,
      children: cat.variants.map((variant) => ({
        name: variant.charAt(0).toUpperCase() + variant.slice(1),
        href: `/docs/${cat.category.toLowerCase()}/${variant.toLowerCase()}`,
      })),
    })),
  },
];
```

### Result Structure

```typescript
[
  {
    name: 'Home',
    href: '/',
    children: undefined
  },
  {
    name: 'Docs',
    children: [
      {
        name: 'Button',
        children: [
          { name: 'Primary', href: '/docs/button/primary' },
          { name: 'Ghost', href: '/docs/button/ghost' },
          { name: 'Neumorphic', href: '/docs/button/neumorphic' }
        ]
      },
      {
        name: 'Modal',
        children: [
          { name: 'Basic', href: '/docs/modal/basic' }
        ]
      }
    ]
  }
]
```

## Animation Details

### Chevron Animation

```typescript
<motion.div
  initial={false}
  animate={{ rotate: isOpen ? 180 : 0 }}
  transition={{ duration: 0.2 }}
>
  <ChevronDown className="w-4 h-4" />
</motion.div>
```

- Rotates 0° when closed
- Rotates 180° when open
- Smooth 200ms transition

### Expand/Collapse Animation

```typescript
<motion.div
  initial={{ opacity: 0, height: 0 }}
  animate={{ opacity: 1, height: 'auto' }}
  exit={{ opacity: 0, height: 0 }}
  transition={{ duration: 0.2 }}
>
  {/* Children render here */}
</motion.div>
```

- Fades in/out smoothly
- Height animates from 0 to auto
- Covers both open and close

## Styling Classes

### Active States

```typescript
// Active category
'bg-zinc-800 text-zinc-50'

// Active link
'bg-zinc-800 text-zinc-50 border-l-2 border-zinc-100'

// Hover state
'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50'
```

### Responsive

```typescript
// Hidden on mobile
'md:hidden'

// Only on desktop
'hidden md:flex'

// Responsive z-index
'z-40'  // Backdrop
'z-50'  // Drawer
```

## Performance Considerations

### Recursion Depth

The component can theoretically render unlimited depth, but practical use cases typically limit to 3-4 levels:

```
Level 0: Home, Docs (2 items)
Level 1: Button, Modal, Input, Card (4 items)
Level 2: Primary, Ghost, Neumorphic... (up to 20 items)
Level 3: Sub-variants (rarely used)
```

### State Management

Each `SidebarNavItem` maintains its own state, so:
- Expanding one category doesn't affect others
- State is isolated per component instance
- No parent re-renders when children toggle

### Memoization

For large category trees, consider memoizing:

```typescript
const SidebarNavItem = React.memo(SidebarNavItemComponent);
```

This prevents unnecessary re-renders when props haven't changed.

## Customization Hooks

### Add Icons to Categories

```typescript
children: categoryStructure.map((cat) => ({
  name: cat.category,
  icon: getIconForCategory(cat.category), // Custom function
  children: ...
}))
```

### Custom Active Highlighting

Modify the `isActive` calculation:

```typescript
const isActive = item.href && (
  pathname === item.href ||
  pathname.startsWith(item.href + '/')
);
```

### Keyboard Navigation

Add keyboard support:

```typescript
<button
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      setIsOpen(!isOpen);
    }
  }}
>
  {/* ... */}
</button>
```

## Future Enhancements

1. **Search/Filter**: Add a search input to filter categories
2. **Drag & Drop**: Reorder categories/variants
3. **Favorites**: Pin frequently used components
4. **Recently Viewed**: Track component view history
5. **Breadcrumbs**: Show navigation path at top
6. **Keyboard Shortcuts**: Navigate with arrow keys

---

## Summary

The recursive Sidebar component provides:

- ✅ **Automatic nesting** of categories and variants
- ✅ **Smooth animations** with Framer Motion
- ✅ **Active state detection** for current routes
- ✅ **Mobile drawer** for responsive design
- ✅ **Icon support** for visual identification
- ✅ **Infinite nesting depth** (practical limit 3-4)
- ✅ **Performance optimized** state management

Perfect for any content hierarchy! 🎯
