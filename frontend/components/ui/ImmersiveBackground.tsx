'use client';

import React, { useEffect, useState, useRef } from 'react';
import { motion, useSpring, useMotionValue, useTransform } from 'framer-motion';

const PARTICLE_COUNT = 60;

export default function ImmersiveBackground() {
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Mouse tracking with spring physics for that "premium lag"
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const springConfig = { damping: 40, stiffness: 80 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  // Perspective transforms (Must be at top level)
  const gridX = useTransform(springX, [0, 2000], [50, -50]);
  const gridY = useTransform(springY, [0, 1200], [50, -50]);

  useEffect(() => {
    setMounted(true);
    
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  if (!mounted) return <div className="fixed inset-0 -z-10 bg-background" />;

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 -z-10 overflow-hidden pointer-events-none transition-colors duration-1000"
      aria-hidden="true"
    >
      {/* ─── Layer 1: Chromatic Mesh Drift ─── */}
      <div className="absolute inset-0 mesh-gradient scale-150 animate-drift opacity-30 dark:opacity-10" />

      {/* ─── Layer 2: 3D Perspective Grid ─── */}
      <div className="absolute inset-0 perspective-grid">
        <motion.div 
          style={{
            x: gridX,
            y: gridY,
          }}
          className="grid-plane opacity-40 dark:opacity-20 transition-opacity duration-1000" 
        />
      </div>

      {/* ─── Layer 3: Sentient Particles (Digital Dust) ─── */}
      <svg className="absolute inset-0 w-full h-full">
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        {Array.from({ length: PARTICLE_COUNT }).map((_, i) => (
          <Particle key={i} />
        ))}
      </svg>

      {/* ─── Layer 4: Interactive Cursor Flare (The "Pulse") ─── */}
      <motion.div
        style={{
          x: springX,
          y: springY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        className="absolute top-0 left-0 w-[600px] h-[600px] rounded-full 
                   bg-brand/10 blur-[120px] mix-blend-plus-lighter pointer-events-none [.light_&]:opacity-40"
      />

      {/* ─── Layer 5: Chromatic "Aura" Spheres ─── */}
      <div className="absolute inset-0 transition-opacity duration-1000">
        {/* Light Theme: Vibrant Blooms */}
        <div className="absolute inset-0 [.dark_&]:opacity-0 transition-opacity duration-1000">
          <FloatingSphere size={500} x="-10%" y="10%" delay={0} color="bg-emerald-400/20" />
          <FloatingSphere size={700} x="60%" y="40%" delay={3} color="bg-amber-400/10" />
          <FloatingSphere size={400} x="20%" y="70%" delay={6} color="bg-turquoise-400/15" />
        </div>
        
        {/* Dark Theme: Soft Glows */}
        <div className="absolute inset-0 [.light_&]:opacity-0 transition-opacity duration-1000">
          <FloatingSphere size={600} x="10%" y="20%" delay={0} color="bg-white/5" />
          <FloatingSphere size={800} x="50%" y="50%" delay={4} color="bg-white/5" />
        </div>
      </div>
    </div>
  );
}

function Particle() {
  const [x] = useState(() => Math.random() * 100);
  const [y] = useState(() => Math.random() * 100);
  const [duration] = useState(() => 15 + Math.random() * 25);
  const [delay] = useState(() => Math.random() * -30);
  const [size] = useState(() => 0.4 + Math.random() * 1.2);

  return (
    <motion.circle
      cx={`${x}%`}
      cy={`${y}%`}
      r={size}
      fill="currentColor"
      className="text-brand/50"
      filter="url(#glow)"
      animate={{
        y: [0, -40, 0],
        opacity: [0.1, 0.4, 0.1],
      }}
      transition={{
        duration,
        repeat: Infinity,
        delay,
        ease: "easeInOut"
      }}
    />
  );
}

function FloatingSphere({ size, x, y, delay, color = 'bg-white/10' }: { size: number, x: string, y: string, delay: number, color?: string }) {
  return (
    <motion.div
      style={{
        width: size,
        height: size,
        left: x,
        top: y,
      }}
      initial={{ y: 0 }}
      animate={{ y: [0, 60, 0], x: [0, 20, 0] }}
      transition={{
        duration: 15 + Math.random() * 5,
        repeat: Infinity,
        delay,
        ease: "easeInOut"
      }}
      className={`absolute rounded-full filter blur-[100px] mix-blend-multiply dark:mix-blend-plus-lighter ${color}`}
    />
  );
}
