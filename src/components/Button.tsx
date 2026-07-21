import type { ButtonHTMLAttributes } from 'react'

type Variant = 'primary' | 'secondary' | 'danger'

const VARIANT_CLASSES: Record<Variant, string> = {
  primary:
    'bg-violet-600 text-white hover:bg-violet-500 active:bg-violet-700 disabled:bg-violet-300',
  secondary:
    'bg-white text-violet-700 border-2 border-violet-200 hover:bg-violet-50 active:bg-violet-100',
  danger: 'bg-rose-600 text-white hover:bg-rose-500 active:bg-rose-700',
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
}

export function Button({ variant = 'primary', className = '', ...props }: ButtonProps) {
  return (
    <button
      className={`w-full py-4 px-6 text-lg font-semibold rounded-2xl transition active:scale-95 disabled:active:scale-100 disabled:cursor-not-allowed ${VARIANT_CLASSES[variant]} ${className}`}
      {...props}
    />
  )
}
