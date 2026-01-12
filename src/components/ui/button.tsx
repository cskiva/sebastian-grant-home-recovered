import { cn } from '@/utilities/ui'
import { Slot } from '@radix-ui/react-slot'
import { type VariantProps, cva } from 'class-variance-authority'
import Link from 'next/link'
import * as React from 'react'

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    defaultVariants: {
      size: 'default',
      variant: 'default',
    },
    variants: {
      size: {
        clear: '',
        default: 'h-10 px-4 py-2',
        icon: 'h-10 w-10',
        lg: 'h-11 rounded px-8',
        sm: 'h-9 rounded px-3',
      },
      variant: {
        nav: 'font-bold text-primary hover:bg-background/50',
        hero: ' border bg-gradient-to-b dark:from-cyan-600 dark:to-cyan-800 from-cyan-50 to-cyan-100 border-cyan-300/20 hover:border-cyan-500 shadow-md shadow-cyan-500/30 text-foreground',
        softGooey: cn(
          'rounded-full border-2 border-primary/10 shadow-lg shadow-cyan-50 bg-gradient-to-b from-gray-100 to-cyan-50',
          'hover:to-cyan-100 hover:border-cyan-200/2',
          'dark:from-cyan-800 dark:to-gray-800 dark:shadow-cyan-800/50 dark:shadow-md',
          'hover:dark:from-cyan-800 hover:dark:to-gray-800 hover:dark:shadow-cyan-900/50',
        ),
        matrixButton:
          'border border-orange-500 border border-orange-500 uppercase !p-1 !h-8 !px-3 text-orange-500 !text-sm',
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        ghost: 'hover:bg-card hover:text-accent-foreground',
        ghostNaked: 'bg-none',
        link: 'text-primary items-start justify-start underline-offset-4 hover:underline',
        outline: 'border border-border bg-background hover:bg-card hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        save: cn(
          'rounded-full border-2 border-green-300/10 shadow-lg shadow-green-200/50 bg-gradient-to-b from-green-200 to-teal-100',
          'hover:to-green-100 hover:border-teal-200/2',
          'dark:from-green-800 dark:to-teal-950 dark:shadow-green-800/50 ',
          'hover:dark:from-green-800 hover:dark:to-teal-950',
        ),
        withIcon: 'gap-3',
      },
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  ref?: React.Ref<HTMLButtonElement>
}

const Button: React.FC<ButtonProps & { href?: string; dev?: boolean }> = ({
  asChild = false,
  className,
  size,
  href,
  variant,
  ref,
  dev,
  ...props
}) => {
  const Comp = asChild ? Slot : 'button'
  // Only visible if NODE_ENV is 'development' and dev is true.
  const isDevVisible = process.env.NODE_ENV === 'development' && dev
  const baseClasses = buttonVariants({ className, size, variant })
  const finalClasses = cn(isDevVisible ? '' : 'hidden', baseClasses)
  if (href)
    return (
      <Link href={href}>
        <Comp className={finalClasses} ref={ref} {...props} />
      </Link>
    )
  return (
    <>
      <Comp className={finalClasses} ref={ref} {...props} />
    </>
  )
}

export { Button, buttonVariants }
