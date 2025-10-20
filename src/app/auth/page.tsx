'use client'

import { Search } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'motion/react'
import { LoginForm } from '@/components/loginForm'

export default function AuthPage() {
  return (
    <div className="min-h-screen w-full bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <Link href="/">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2 cursor-pointer mb-8 justify-center"
          >
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
              <Search className="w-7 h-7 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold">Lead Generator</span>
          </motion.div>
        </Link>

        <LoginForm />
      </motion.div>
    </div>
  )
}
