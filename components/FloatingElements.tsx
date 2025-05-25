"use client"

import { motion } from "framer-motion"
import { Code, Database, Braces, Cpu, Server, Zap } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

export function FloatingElements() {
  const { theme } = useTheme()
  const isDark = theme === "dark"
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null // prevent hydration mismatch

  const icons = [
    { Icon: Code, x: "10%", y: "20%", size: 24, delay: 0 },
    { Icon: Braces, x: "85%", y: "15%", size: 28, delay: 1 },
    { Icon: Database, x: "75%", y: "60%", size: 20, delay: 2 },
    { Icon: Cpu, x: "15%", y: "70%", size: 22, delay: 1.5 },
    { Icon: Server, x: "60%", y: "80%", size: 26, delay: 0.5 },
    { Icon: Zap, x: "30%", y: "40%", size: 18, delay: 2.5 },
  ]

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {icons.map((item, index) => (
        <motion.div
          key={index}
          className={"absolute text-accent"}
          style={{
            left: item.x,
            top: item.y,
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: [0.4, 0.8, 0.4],
            y: [0, -15, 0],
          }}
          transition={{
            duration: 4,
            delay: item.delay,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        >
          <item.Icon size={item.size} />
        </motion.div>
      ))}
    </div>
  )
}
