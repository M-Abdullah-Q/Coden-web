"use client"

import { Zap, ArrowBigUpDash, Users, Code, Brain, Award, BarChart3, Trophy } from "lucide-react"
import { useRouter } from "next/navigation"
import { QuestionInput } from "./QuestionInput"
import { motion } from "framer-motion"
import { AnimatedFeatureCard } from "./AnimatedFeatureCard"
import Image from "next/image"
import { GlowingEffect } from "./ui/glowing-effect"
import { CustomCard } from "./CustomCard"

const features = [
  {
    icon: <Zap className="h-6 w-6" />,
    title: "Blazing-Fast Execution",
    description: "Lightning-fast code execution for seamless problem-solving and instant feedback."
  },
  {
    icon: <ArrowBigUpDash className="h-6 w-6" />,
    title: "Boost Your Rating",
    description: "Accelerate your progress with better contest performance and targeted practice."
  },
  {
    icon: <Code className="h-6 w-6" />,
    title: "Multiple Languages",
    description: "Support for all major languages used in competitive programming contests."
  },
  {
    icon: <Brain className="h-6 w-6" />,
    title: "AI Assistance",
    description: "Get hints and guidance when you're stuck, without giving away the solution."
  },
  {
    icon: <Award className="h-6 w-6" />,
    title: "Algorithm Library",
    description: "Access a comprehensive collection of algorithms and data structures."
  },
  {
    icon: <Users className="h-6 w-6" />,
    title: "Community Support",
    description: "Sharpen your skills with regular contests, mock interviews, and real-world challenges."
  }
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3
    }
  }
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
}

export function HeroSection() {
  return (
    <div className="relative py-20 px-4 overflow-hidden">
      <motion.div 
        className="absolute top-0 left-0 right-0 bottom-0 -z-10 opacity-20 dark:opacity-10"
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%'],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          repeatType: 'reverse',
        }}
        style={{
          backgroundImage: 'radial-gradient(circle at 30% 40%, var(--chart-1), transparent 40%), radial-gradient(circle at 70% 60%, var(--chart-2), transparent 40%)',
          backgroundSize: '100% 100%',
        }}
      />
      
      <div className="container mx-auto max-w-4xl">
        <div className="flex flex-col items-center gap-12 mb-20">
          <motion.div 
            className="w-full text-center max-w-3xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
            >
              <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-accent text-sm font-medium mb-4">
                The Ultimate Coding Environment
              </span>
            </motion.div>
            
            <motion.h1 
              className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              Competitive Programming <span className="text-accent">made easier</span>
            </motion.h1>
            
            <motion.p 
              className="text-xl text-muted-foreground mb-8 max-w-xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              Code faster, rank higher—accelerate your algorithmic journey with a platform designed for competitive programmers.
            </motion.p>
            
            <QuestionInput />
            
          </motion.div>
          
          <div className=" ring-2 ring-accent rounded-md shadow-[0_0_30px_5px_rgba(168,85,247,1)]">
          <motion.div 
            className="w-full max-w-3xl flex items-center justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            
            <img
              src = '/image.png'
            >
            </img>
          </motion.div>
          </div>
        </div>

        
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {features.map((feature, index) => (
            <AnimatedFeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              index={index}
            />
          ))}
        </motion.div>
      </div>
    </div>
  )
}