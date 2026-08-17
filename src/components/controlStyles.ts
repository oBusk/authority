import { cx } from "^/lib/cva";

/**
 * Shared look for the small controls in the header. Lives in its own module
 * so `Header` and the buttons it renders can both use it without importing
 * each other.
 */
export const CONTROL_BUTTON = cx(
    "flex items-center justify-center rounded-full p-[max(0.5rem,1.5vmin)]",
    "text-muted-foreground transition-colors",
    "hover:text-foreground active:bg-accent",
    "focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-hidden",
);

export const CONTROL_ICON = "size-[max(1rem,3vmin)]";
