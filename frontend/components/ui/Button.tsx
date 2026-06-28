import * as React from "react"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'secondary' | 'brand'
  size?: 'default' | 'sm' | 'lg' | 'icon'
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'default', size = 'default', ...props }, ref) => {
    
    const baseStyles = "inline-flex items-center justify-center whitespace-nowrap rounded-full font-bold tracking-tight ring-offset-background transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95 translate-y-0 hover:-translate-y-0.5"
    
    const variants = {
      default: "bg-foreground text-background hover:opacity-90 shadow-lg shadow-foreground/10",
      brand: "bg-brand text-background hover:opacity-90 shadow-lg shadow-brand/20",
      outline: "border-2 border-border bg-transparent hover:border-brand hover:text-brand",
      secondary: "bg-card text-foreground border border-border hover:bg-border/50",
      ghost: "text-foreground/60 hover:text-brand hover:bg-brand/10",
    }
    
    const sizes = {
      default: "h-11 px-8 py-2 text-sm",
      sm: "h-9 px-4 text-xs",
      lg: "h-14 px-10 text-base font-extrabold uppercase tracking-widest",
      icon: "h-11 w-11",
    }
    
    const combinedClasses = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`

    return (
      <button
        className={combinedClasses}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
