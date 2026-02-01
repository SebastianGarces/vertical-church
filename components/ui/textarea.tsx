import * as React from "react"

import { cn } from "@/lib/utils"

interface TextareaProps extends React.ComponentProps<"textarea"> {
  variant?: "default" | "light"
}

function Textarea({ className, variant = "default", ...props }: TextareaProps) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-20 w-full rounded-md border px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:cursor-not-allowed disabled:opacity-50",
        variant === "default" && [
          "border-input bg-transparent placeholder:text-muted-foreground dark:bg-input/30",
          "focus-visible:border-florence focus-visible:ring-0 focus-visible:ring-offset-0",
          "aria-invalid:border-destructive",
        ],
        variant === "light" && [
          "border-navy/30 bg-white text-navy placeholder:text-navy/50",
          "focus-visible:border-florence focus-visible:ring-florence/20 focus-visible:ring-[3px]",
          "aria-invalid:border-red-500",
        ],
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
