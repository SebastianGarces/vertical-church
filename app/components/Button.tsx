import Link from "next/link";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";

interface ButtonProps {
  children: React.ReactNode;
  variant?: ButtonVariant;
  href?: string;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit";
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-florence text-pipper hover:bg-florence/90 border-2 border-florence",
  secondary:
    "bg-transparent text-pipper border-2 border-pipper hover:bg-pipper/10",
  outline:
    "bg-transparent text-pipper border-2 border-florence hover:bg-florence/10",
  ghost:
    "bg-transparent text-pipper hover:text-florence border-2 border-transparent",
};

export function Button({
  children,
  variant = "primary",
  href,
  onClick,
  className = "",
  type = "button",
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center px-6 py-3 font-button text-base font-bold uppercase tracking-[0.2em] transition-all duration-200";

  const combinedStyles = `${baseStyles} ${variantStyles[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={combinedStyles}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={combinedStyles}>
      {children}
    </button>
  );
}
