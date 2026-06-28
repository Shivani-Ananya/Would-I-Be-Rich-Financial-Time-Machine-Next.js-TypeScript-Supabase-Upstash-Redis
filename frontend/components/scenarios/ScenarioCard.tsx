'use client';

import Link from 'next/link';
import { Scenario } from '@/types/scenario.types';
import { formatRunCount } from '@/utils/formatCurrency';
import { getCategoryMeta } from '@/utils/categories';
import { TrendingUp, Users, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import React from 'react';

interface ScenarioCardProps {
  scenario: Scenario;
  /** Slot for triggering a simulation; parent is in charge of navigation */
  onSelect?: (uuid: string) => void;
}

export default function ScenarioCard({ scenario, onSelect }: ScenarioCardProps) {
  const meta = getCategoryMeta(scenario.category);

  const handleClick = () => {
    if (onSelect) onSelect(scenario.uuid);
  };

  return (
    <motion.div
      initial={{ y: 0 }}
      animate={{ y: [0, -8, 0] }}
      transition={{
        duration: 5 + Math.random() * 2,
        repeat: Infinity,
        ease: "easeInOut",
        delay: Math.random() * 5
      }}
      role="button"
      tabIndex={0}
      id={`scenario-card-${scenario.uuid}`}
      aria-label={`Simulate: ${scenario.title}`}
      onClick={handleClick}
      onKeyDown={(e) => e.key === 'Enter' && handleClick()}
      className="
        group relative flex flex-col gap-4 p-6 rounded-2xl cursor-pointer
        bg-card border border-border
        hover:border-brand/40 hover:bg-brand/[0.02]
        hover:shadow-2xl hover:shadow-brand/5
        transition-all duration-500 ease-out
        hover-lift
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand
      "
    >
      {/* Category Badge */}
      <div className="flex items-center justify-between">
        <span
          className={`
            inline-flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full
            ${meta.bgColor} ${meta.color} shadow-sm backdrop-blur-sm
          `}
        >
          <span role="img" aria-label={meta.label}>{meta.emoji}</span>
          {meta.label}
        </span>

        {/* Popularity indicator */}
        <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-tight text-foreground/40">
          <Users size={12} aria-hidden="true" />
          {formatRunCount(scenario.run_count)}
        </span>
      </div>

      {/* Title */}
      <h3 className="text-lg font-bold text-foreground leading-tight group-hover:text-brand transition-colors duration-300">
        {scenario.title}
      </h3>

      {/* Description */}
      <p className="text-sm text-foreground/60 leading-relaxed flex-1 italic font-light">
        {scenario.description}
      </p>

      {/* CTA Row */}
      <div className="flex items-center justify-between pt-4 border-t border-border/50">
        <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-foreground/30">
          <TrendingUp size={12} aria-hidden="true" />
          {scenario.sim_type.replace('_', ' ')}
        </span>
        <span className="
          flex items-center gap-2 text-xs font-black uppercase tracking-tighter text-brand
          group-hover:translate-x-1 transition-transform duration-300
        ">
          Run Simulation
          <ArrowRight size={14} aria-hidden="true" />
        </span>
      </div>

      {/* Subtle mechanical border pulse on hover */}
      <div className="
        absolute inset-0 rounded-2xl border-2 border-brand/0 group-hover:border-brand/10 transition-colors duration-700 pointer-events-none
      " />
    </motion.div>
  );
}
