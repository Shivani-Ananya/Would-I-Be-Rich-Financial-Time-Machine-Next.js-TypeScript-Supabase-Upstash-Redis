import * as React from "react"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'success' | 'brand'
}

function Badge({ className = '', variant = "default", ...props }: BadgeProps) {
  const baseStyles = "inline-flex items-center rounded-full border border-transparent px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-widest transition-all duration-300 ease-out"
  
  const variants = {
    default: "bg-foreground text-background",
    brand: "bg-brand text-background shadow-sm shadow-brand/20",
    secondary: "bg-card text-foreground border-border",
    success: "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20",
    outline: "border-border text-foreground/60 hover:border-foreground/40 hover:text-foreground",
  }
  
  return (
    <div className={`${baseStyles} ${variants[variant]} ${className}`} {...props} />
  )
}

export { Badge }
