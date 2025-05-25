"use client"

import React, { Children, ReactNode } from 'react'
import { motion } from 'framer-motion'
import { useTheme } from 'next-themes'
import { DivideIcon as LucideIcon } from 'lucide-react'
import { GlowingEffect } from "./ui/glowing-effect"

interface CustomCardProps {
    children : ReactNode;
}


export function CustomCard({ children } : CustomCardProps) {
  const { theme } = useTheme()
  
  return (
    <div
      className="p-6 rounded-xl bg-card border border-border/40 backdrop-blur-sm"
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
        { children }
    </div>
  )
}