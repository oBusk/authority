/**
 * Renders a script that runs synchronously while the browser parses the HTML,
 * i.e. before the first paint and before React hydrates.
 *
 * Pattern taken from the Next.js guide "How to prevent flash before
 * hydration": `text/javascript` on the server so it executes on a hard
 * navigation, `text/plain` on the client so React neither re-runs it on a soft
 * navigation nor warns about rendering a `<script>`.
 */
export function InlineScript({ html }: { html: string }) {
    return (
        <script
            type={
                typeof window === "undefined" ? "text/javascript" : "text/plain"
            }
            suppressHydrationWarning
            dangerouslySetInnerHTML={{ __html: html }}
        />
    );
}
