/**
 * The Authority shield, inlined so the header paints without a request and
 * works offline on the very first load.
 *
 * The same artwork lives in `public/icons/icon.svg`, which is the source the
 * committed PNG icon set is generated from. Keep the two paths in step.
 */
export function Logo({ className }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 512 512"
            className={className}
            role="img"
            aria-hidden="true"
            focusable="false"
        >
            <defs>
                <linearGradient id="authority-logo" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#7dd3fc" />
                    <stop offset="100%" stopColor="#2563eb" />
                </linearGradient>
            </defs>
            <path
                d="M256 48 84 116v148c0 106 74 174 172 200 98-26 172-94 172-200V116L256 48Z"
                fill="url(#authority-logo)"
            />
            {/* Knocked out to the page colour so the mark reads in both themes. */}
            <path
                fillRule="evenodd"
                fill="hsl(var(--background))"
                d="M256 140 350 356h-52l-18-44h-48l-18 44h-52L256 140Zm0 78-30 74h60l-30-74Z"
            />
        </svg>
    );
}
