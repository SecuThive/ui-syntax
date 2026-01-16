'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <motion.div
      className="space-y-16"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Hero Section */}
      <motion.div className="space-y-6" variants={itemVariants}>
        <div className="space-y-2">
          <h1 className="text-6xl md:text-7xl font-bold text-zinc-50 tracking-tight">
            UI Syntax
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-zinc-400 to-zinc-600" />
        </div>
        <p className="text-xl text-zinc-300 max-w-2xl leading-relaxed">
          A comprehensive collection of beautifully designed UI components. Explore variants, preview in real-time, and copy code with a single click.
        </p>
        <div className="flex items-center gap-4 pt-4">
          <Link href="/docs">
            <motion.button
              className="px-8 py-3 rounded-lg bg-zinc-100 text-zinc-950 font-semibold flex items-center gap-2 hover:bg-zinc-50 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Browse Components
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </Link>
          <button className="px-8 py-3 rounded-lg border border-zinc-700 text-zinc-300 font-semibold hover:bg-zinc-900/50 hover:border-zinc-600 transition-colors">
            Learn More
          </button>
        </div>
      </motion.div>

      {/* Features Grid */}
      <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-6" variants={itemVariants}>
        {[
          {
            icon: '📦',
            title: 'Organized Components',
            desc: 'Browse curated UI components organized by category with multiple design variants.',
          },
          {
            icon: '✨',
            title: 'Live Previews',
            desc: 'See real-time previews of components alongside syntax-highlighted source code.',
          },
          {
            icon: '⚡',
            title: 'Copy & Paste Ready',
            desc: 'Copy component code instantly and integrate into your projects seamlessly.',
          },
        ].map((feature, i) => (
          <motion.div
            key={i}
            className="p-6 rounded-lg border border-zinc-800/50 bg-gradient-to-br from-zinc-900/50 to-zinc-950/50 hover:border-zinc-700 transition-colors group"
            variants={itemVariants}
          >
            <div className="w-12 h-12 rounded-lg bg-zinc-800/50 group-hover:bg-zinc-700/50 flex items-center justify-center mb-4 transition-colors text-lg">
              {feature.icon}
            </div>
            <h3 className="text-lg font-semibold text-zinc-50 mb-2">{feature.title}</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">{feature.desc}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Stats */}
      <motion.div className="grid grid-cols-3 gap-6" variants={itemVariants}>
        {[
          { label: 'Components', value: '7+' },
          { label: 'Variants', value: '15+' },
          { label: 'Categories', value: '4' },
        ].map((stat, i) => (
          <motion.div
            key={i}
            className="text-center p-6 rounded-lg border border-zinc-800 bg-zinc-900/30"
            variants={itemVariants}
          >
            <p className="text-3xl font-bold text-zinc-50 mb-1">{stat.value}</p>
            <p className="text-sm text-zinc-400">{stat.label}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Getting Started Section */}
      <motion.div className="space-y-6 p-8 rounded-lg border border-zinc-800 bg-gradient-to-br from-zinc-900/50 to-zinc-950" variants={itemVariants}>
        <div>
          <h2 className="text-3xl font-bold text-zinc-50 mb-2">How It Works</h2>
          <p className="text-zinc-400">Navigate through components and customize to fit your design needs.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { step: '1', title: 'Browse', desc: 'Start in the docs and explore component categories' },
            { step: '2', title: 'Preview', desc: 'See live previews of different variants' },
            { step: '3', title: 'Inspect', desc: 'Read the syntax-highlighted source code' },
            { step: '4', title: 'Copy', desc: 'Copy and use in your own projects' },
          ].map((item, i) => (
            <motion.div key={i} className="flex gap-4" variants={itemVariants}>
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-zinc-800 text-zinc-50 font-semibold">
                  {item.step}
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-zinc-50 mb-1">{item.title}</h4>
                <p className="text-sm text-zinc-400">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Tech Stack */}
      <motion.div className="space-y-6" variants={itemVariants}>
        <div>
          <h2 className="text-3xl font-bold text-zinc-50 mb-2">Tech Stack</h2>
          <p className="text-zinc-400">Built with modern technologies for performance and developer experience.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            'Next.js 16',
            'TypeScript',
            'Tailwind CSS 4',
            'Framer Motion',
            'Shiki',
            'MDX',
            'Lucide React',
            'Gray Matter',
          ].map((tech) => (
            <motion.div
              key={tech}
              className="p-4 rounded-lg border border-zinc-800 bg-zinc-900/30 text-center hover:border-zinc-700 transition-colors"
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
            >
              <p className="text-sm font-medium text-zinc-300">{tech}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* CTA Section */}
      <motion.div
        className="relative p-12 rounded-lg border border-zinc-800 bg-gradient-to-r from-zinc-900/50 to-zinc-950/50 overflow-hidden"
        variants={itemVariants}
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-r from-zinc-500 to-zinc-900" />
        </div>
        <div className="relative space-y-4 text-center">
          <h3 className="text-2xl font-bold text-zinc-50">Ready to Get Started?</h3>
          <p className="text-zinc-400 max-w-xl mx-auto">
            Explore our component library and find the perfect UI elements for your next project.
          </p>
          <div className="pt-4">
            <Link href="/docs">
              <motion.button
                className="px-8 py-3 rounded-lg bg-zinc-100 text-zinc-950 font-semibold flex items-center gap-2 mx-auto hover:bg-zinc-50 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Explore Components
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </Link>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
