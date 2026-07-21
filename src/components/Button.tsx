import type { ReactNode } from 'react'
import { motion } from 'framer-motion'

type Variant = 'primary' | 'secondary' | 'danger'

const VARIANT_CLASSES: Record<Variant, string> = {
  primary:
    'bg-violet-600 text-white hover:bg-violet-500 active:bg-violet-700 disabled:bg-violet-300',
  secondary:
    'bg-white text-violet-700 border-2 border-violet-200 hover:bg-violet-50 active:bg-violet-100',
  danger: 'bg-rose-600 text-white hover:bg-rose-500 active:bg-rose-700',
}

interface ButtonProps {
  variant?: Variant
  className?: string
  onClick?: () => void
  disabled?: boolean
  type?: 'button' | 'submit'
  children: ReactNode
}

export function Button({
  variant = 'primary',
  className = '',
  onClick,
  disabled,
  type = 'button',
  children,
}: ButtonProps) {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileTap={disabled ? undefined : { scale: 0.95 }}
      whileHover={disabled ? undefined : { scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 500, damping: 25 }}
      className={`w-full py-4 px-6 text-lg font-semibold rounded-2xl transition-colors disabled:cursor-not-allowed ${VARIANT_CLASSES[variant]} ${className}`}
    >
      {children}
    </motion.button>
  )
}
