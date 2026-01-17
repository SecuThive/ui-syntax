'use server';

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface ComponentMetadata {
  title: string;
  description: string;
  category: string;
  variant?: string;
  code?: string;
}

export interface ComponentDoc {
  metadata: ComponentMetadata;
  content: string;
  slug: string;
  filePath: string;
}

const contentDirectory = path.join(process.cwd(), 'content', 'components');

export async function getAllComponents(): Promise<ComponentDoc[]> {
  const components: ComponentDoc[] = [];

  function walkDir(dir: string, parentCategory = ''): void {
    try {
      const files = fs.readdirSync(dir);

      for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
          // Recursively walk subdirectories
          const category = file;
          walkDir(filePath, category);
        } else if (file.endsWith('.mdx')) {
          const fileContent = fs.readFileSync(filePath, 'utf-8');
          const { data, content } = matter(fileContent);

          const relativePath = path.relative(contentDirectory, filePath);
          const slug = relativePath
            .replace(/\.mdx$/, '')
            .split(path.sep)
            .join('/');

          components.push({
            metadata: {
              title: data.title || file.replace('.mdx', ''),
              description: data.description || '',
              category: data.category || parentCategory,
              variant: data.variant,
              code: data.code,
            },
            content,
            slug,
            filePath,
          });
        }
      }
    } catch (error) {
      console.error(`Error reading directory ${dir}:`, error);
    }
  }

  if (fs.existsSync(contentDirectory)) {
    walkDir(contentDirectory);
  }

  return components;
}

export async function getComponentsByCategory(): Promise<Record<string, Record<string, ComponentDoc>>> {
  const allComponents = await getAllComponents();
  const grouped: Record<string, Record<string, ComponentDoc>> = {};

  for (const component of allComponents) {
    const category = component.metadata.category;
    const variant = component.metadata.variant || 'default';

    if (!grouped[category]) {
      grouped[category] = {};
    }

    grouped[category][variant] = component;
  }

  return grouped;
}

export async function getComponentBySlug(slug: string): Promise<ComponentDoc | null> {
  const components = await getAllComponents();
  return components.find((c) => c.slug === slug) || null;
}

export async function getCategoryStructure(): Promise<
  {
    category: string;
    variants: string[];
  }[]
> {
  const grouped = await getComponentsByCategory();
  return Object.entries(grouped).map(([category, variants]) => ({
    category,
    variants: Object.keys(variants).sort(),
  }));
}
