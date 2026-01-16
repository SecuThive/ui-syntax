'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Menu, X } from 'lucide-react';

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

// 간단한 네비 아이템
interface NavItemProps {
  item: SidebarItem;
  pathname: string;
  depth?: number;
}

const NavItem: React.FC<NavItemProps> = ({ item, pathname, depth = 0 }) => {
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = (item.children?.length ?? 0) > 0;
  const isActive = item.href === pathname;
  const isActiveChild = item.children?.some(child => pathname.includes(child.href || ''));

  if (hasChildren) {
    return (
      <div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full text-left px-3 py-2 rounded text-xs font-medium flex items-center justify-between transition-colors ${
            isActiveChild
              ? 'bg-zinc-800 text-zinc-50'
              : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50'
          }`}
        >
          <span>{item.name}</span>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="w-3.5 h-3.5" />
          </motion.div>
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="py-1 space-y-0.5 pl-2 border-l border-zinc-800/50 ml-2">
                {item.children?.map((child) => (
                  <NavItem
                    key={child.name}
                    item={child}
                    pathname={pathname}
                    depth={depth + 1}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <Link href={item.href || '#'}>
      <div
        className={`px-3 py-2 rounded text-xs font-medium transition-colors ${
          isActive
            ? 'bg-zinc-100 text-zinc-950 font-semibold'
            : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50'
        }`}
        style={{ marginLeft: depth > 0 ? '8px' : '0' }}
      >
        {item.name}
      </div>
    </Link>
  );
};

export const Sidebar: React.FC<SidebarProps> = ({
  items,
  title = 'UI Syntax',
  onClose,
  isMobile = false,
}) => {
  const pathname = usePathname();

  return (
    <div className="h-full flex flex-col bg-zinc-950 border-r border-zinc-800">
      {/* Header */}
      <div className="px-4 py-4 border-b border-zinc-800 flex items-center justify-between flex-shrink-0">
        <h1 className="text-xs font-bold text-zinc-100 uppercase tracking-widest">{title}</h1>
        {isMobile && onClose && (
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-zinc-800/50 rounded text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-2 py-2 space-y-0.5">
        {items.map((item) => (
          <NavItem key={item.name} item={item} pathname={pathname} />
        ))}
      </nav>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-zinc-800 text-xs text-zinc-600 flex-shrink-0">
        © 2026
      </div>
    </div>
  );
};

interface SidebarDrawerProps extends SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SidebarDrawer: React.FC<SidebarDrawerProps> = ({
  items,
  title,
  isOpen,
  onClose,
}) => {
  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ duration: 0.2 }}
            className="fixed left-0 top-0 h-screen w-72 z-50 md:hidden"
          >
            <Sidebar items={items} title={title} onClose={onClose} isMobile />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

interface SidebarToggleProps {
  onClick: () => void;
}

export const SidebarToggle: React.FC<SidebarToggleProps> = ({ onClick }) => (
  <button
    onClick={onClick}
    className="p-2 hover:bg-zinc-800 rounded-md text-zinc-400 hover:text-zinc-200 md:hidden"
  >
    <Menu className="w-5 h-5" />
  </button>
);
