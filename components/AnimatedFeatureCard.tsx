"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { useTheme } from 'next-themes'
import { DivideIcon as LucideIcon } from 'lucide-react'
import { GlowingEffect } from "./ui/glowing-effect"


interface AnimatedFeatureCardProps {
  icon: React.ReactNode
  title: string
  description: string
  index: number
}

export function AnimatedFeatureCard({ icon, title, description, index }: AnimatedFeatureCardProps) {
  const { theme } = useTheme()
  
  return (
    <motion.div
      className="p-6 rounded-xl bg-card border border-border/40 backdrop-blur-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.5,
        delay: 0.2 + index * 0.1,
        ease: "easeOut"
      }}
      whileHover={{ 
        y: -5,
        boxShadow: theme === 'dark' 
          ? '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.2)'
          : '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.04)'
      }}
    >
        <GlowingEffect
          blur={0}
          borderWidth={3}
          spread={30}
          glow={true}
          disabled={false}
          variant='white'
          proximity={25}
          inactiveZone={0.01}
          /> 
      <motion.div
        className="mb-4 inline-flex p-3 rounded-lg bg-primary/10 text-accent"
        whileHover={{ rotate: [0, -10, 10, -10, 0] }}
        transition={{ duration: 0.5 }}
      >
        {icon}
      </motion.div>
      
      <motion.h3 
        className="text-xl font-semibold mb-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
      >
        {title}
      </motion.h3>
      
      <motion.p 
        className="text-muted-foreground"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
      >
        {description}
      </motion.p>
    </motion.div>
  )
}