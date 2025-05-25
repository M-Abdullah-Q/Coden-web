"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { Github, Twitter, Coffee } from 'lucide-react'

export function Footer() {
  return (
    <motion.footer 
      className="border-t py-8 mt-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.8, duration: 0.5 }}
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center text-center gap-6">
          <p className="text-muted-foreground max-w-md">
            Accelerate your competitive programming journey with tools designed to help you solve problems faster and more efficiently.
          </p>
          
          <div className="flex space-x-4">
            <motion.a 
              href="https://github.com/M-Abdullah-Q/Playground/tree/main/apps/web"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
              whileHover={{ y: -2, scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Github className="h-5 w-5" />
            </motion.a>
            <motion.a 
              href="https://x.com/sisphss" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
              whileHover={{ y: -2, scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Twitter className="h-5 w-5" />
            </motion.a>
          </div>

          <p className="text-sm text-muted-foreground">
            © 2025 Made with 
            <motion.a
              href="https://en.wikipedia.org/wiki/Coffee" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
              whileHover={{ y: -2, scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >☕️</motion.a>
          </p>
        </div>
      </div>
    </motion.footer>
  )
}