'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface Design {
  id: string;
  title: string;
  createdAt: string;
}

interface DesignSelectorProps {
  category: string;
  variant: string;
  currentDesignId?: string;
}

export default function DesignSelector({ category, variant, currentDesignId }: DesignSelectorProps) {
  const [designs, setDesigns] = useState<Design[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedId = searchParams.get('design') || currentDesignId;

  useEffect(() => {
    async function fetchDesigns() {
      try {
        const res = await fetch(`/api/designs?category=${category}&variant=${variant}&status=published`);
        const data = await res.json();
        setDesigns(data.designs || []);
      } catch (error) {
        console.error('Failed to fetch designs:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchDesigns();
  }, [category, variant]);

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-zinc-400">
        <span>Loading designs...</span>
      </div>
    );
  }

  if (designs.length <= 1) {
    // Only show selector if there are multiple designs
    return null;
  }

  const handleChange = (designId: string) => {
    const url = new URL(window.location.href);
    if (designId) {
      url.searchParams.set('design', designId);
    } else {
      url.searchParams.delete('design');
    }
    router.push(url.pathname + url.search);
  };

  return (
    <div className="flex items-center gap-3">
      <label htmlFor="design-selector" className="text-sm font-medium text-zinc-300">
        Design:
      </label>
      <select
        id="design-selector"
        value={selectedId || ''}
        onChange={(e) => handleChange(e.target.value)}
        className="bg-zinc-900 border border-zinc-700 text-zinc-200 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 px-3 py-2 hover:bg-zinc-800 transition-colors"
      >
        <option value="">Latest</option>
        {designs.map((design) => (
          <option key={design.id} value={design.id}>
            {design.title}
          </option>
        ))}
      </select>
      <span className="text-xs text-zinc-500">
        ({designs.length} {designs.length === 1 ? 'design' : 'designs'})
      </span>
    </div>
  );
}
