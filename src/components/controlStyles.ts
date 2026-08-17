import { cx } from "^/lib/cva";

/**
 * Shared look for the small controls in the header. Lives in its own module
 * so `Header` and the buttons it renders can both use it without importing
 * each other.
 */
/*
 * Sized with `clamp`, not `max`. These scale up with the viewport so they stay
 * tappable on a phone, but they need a ceiling — on a desktop `vmin` is the
 * window height, which would otherwise blow them up to ~54px.
 */
export const CONTROL_BUTTON = cx(
    "flex items-center justify-center rounded-full",
    "p-[clamp(0.375rem,1.5vmin,0.5rem)]",
    "text-muted-foreground transition-colors",
    "hover:text-foreground active:bg-accent",
    "focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-hidden",
);

export const CONTROL_ICON = "size-[clamp(1rem,3vmin,1.375rem)]";
