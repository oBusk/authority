import { AuthorityBoard } from "^/components/AuthorityBoard";

/**
 * A static server shell. Everything interactive lives in the AuthorityBoard
 * client subtree, so this route prerenders to complete HTML and the counters
 * are on screen before any JavaScript runs.
 */
export default function Home() {
    return <AuthorityBoard />;
}
