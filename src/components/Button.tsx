import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cva, cx } from "^/lib/cva";

const buttonVariants = cva(
    "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none disabled:opacity-50",
    {
        variants: {
            variant: {
                default:
                    "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600",
                outline:
                    "border border-zinc-300 bg-white text-zinc-900 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:hover:bg-zinc-700",
            },
            size: {
                default: "h-10 px-4 py-2",
                sm: "h-8 px-3 text-xs",
                lg: "h-12 px-6 text-lg",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    },
);

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "default" | "outline";
    size?: "default" | "sm" | "lg";
    className?: string;
    children: ReactNode;
}

export function Button({
    variant = "default",
    size = "default",
    className,
    children,
    ...props
}: ButtonProps) {
    return (
        <button
            // eslint-disable-next-line tailwindcss/no-custom-classname -- false positive: `className` here is the identifier, not a class name
            className={cx(buttonVariants({ variant, size }), className)}
            {...props}
        >
            {children}
        </button>
    );
}
