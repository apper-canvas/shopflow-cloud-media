import { forwardRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";

const Button = forwardRef(({ 
  className, 
  variant = "primary", 
  size = "md", 
  children, 
  isLoading = false,
  disabled = false,
  ...props 
}, ref) => {
  const baseClasses = "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const variants = {
    primary: "bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:from-primary-600 hover:to-primary-700 focus:ring-primary-500 active:scale-98",
    secondary: "bg-white text-primary-600 border border-primary-200 hover:bg-primary-50 hover:border-primary-300 focus:ring-primary-500 active:scale-98",
    accent: "bg-gradient-to-r from-accent-500 to-accent-600 text-white hover:from-accent-600 hover:to-accent-700 focus:ring-accent-500 active:scale-98",
    ghost: "text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:ring-gray-500",
    danger: "bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 focus:ring-red-500 active:scale-98"
  };
  
  const sizes = {
    sm: "px-3 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg"
  };
  
  const isDisabled = disabled || isLoading;
  
  return (
    <motion.button
      ref={ref}
      className={cn(
        baseClasses,
        variants[variant],
        sizes[size],
        isDisabled && "opacity-50 cursor-not-allowed",
        !isDisabled && "hover:shadow-lg hover:-translate-y-0.5",
        className
      )}
      disabled={isDisabled}
      whileHover={!isDisabled ? { scale: 1.02 } : {}}
      whileTap={!isDisabled ? { scale: 0.98 } : {}}
      {...props}
    >
      {isLoading ? (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-4 h-4 border-2 border-current border-t-transparent rounded-full mr-2"
        />
      ) : null}
      {children}
    </motion.button>
  );
});

Button.displayName = "Button";

export default Button;