import type { Metadata } from "next";
import Link from "next/link";
import { LuArrowLeft } from "react-icons/lu";
import { SiGithub } from "react-icons/si";
import {
    REPOSITORY_URL,
    SITE_DESCRIPTION,
    SITE_DOMAIN,
    SITE_NAME,
    SITE_TAGLINE,
} from "^/lib/site";

export const metadata: Metadata = {
    title: "About",
    description: SITE_DESCRIPTION,
    alternates: { canonical: "/about" },
    openGraph: {
        type: "article",
        title: `About ${SITE_NAME}`,
        description: SITE_DESCRIPTION,
        url: "/about",
    },
};

export default function About() {
    return (
        <main className="min-h-dvh safe-area">
            <div className="mx-auto max-w-prose px-6 py-10">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                >
                    <LuArrowLeft className="size-4" />
                    Back to the counter
                </Link>

                <h1 className="mt-8 text-4xl font-bold tracking-tight">
                    {SITE_NAME}
                </h1>
                <p className="mt-2 text-xl text-muted-foreground">
                    {SITE_TAGLINE}
                </p>

                <div className="mt-8 space-y-4 leading-relaxed">
                    <p>
                        <strong>{SITE_NAME}</strong> is a companion for the deck
                        building card game <em>Star Realms</em>. Put your phone
                        on the table next to the game, and it shows both
                        players&rsquo; authority in numbers you can read across
                        the table.
                    </p>

                    <h2 className="pt-4 text-2xl font-semibold">
                        How to use it
                    </h2>
                    <ul className="list-disc space-y-2 pl-5">
                        <li>
                            Tap <strong>+</strong> or <strong>&minus;</strong>{" "}
                            to change a player&rsquo;s authority. The number
                            updates instantly.
                        </li>
                        <li>
                            A running total appears above the number, so when a
                            card tells you to deal 9 damage you can count your
                            taps instead of doing arithmetic. It fades a couple
                            of seconds after you stop tapping.
                        </li>
                        <li>
                            Your score is saved on your device. Close the app
                            mid-game, come back, and it is exactly where you
                            left it.
                        </li>
                        <li>
                            The circular arrow starts a new game, after asking
                            you to confirm.
                        </li>
                    </ul>

                    <h2 className="pt-4 text-2xl font-semibold">
                        Built for the table
                    </h2>
                    <ul className="list-disc space-y-2 pl-5">
                        <li>
                            <strong>Works offline.</strong> Install it to your
                            home screen and it keeps working with no signal.
                        </li>
                        <li>
                            <strong>Keeps the screen awake</strong> on devices
                            that support it, so the phone does not go dark
                            between turns.
                        </li>
                        <li>
                            <strong>Pure black in dark mode</strong>, which
                            costs an OLED screen almost no battery. There is a
                            light theme too, for playing in the sun.
                        </li>
                    </ul>

                    <h2 className="pt-4 text-2xl font-semibold">Open source</h2>
                    <p>
                        {SITE_NAME} is free and open source, and lives at{" "}
                        <a
                            href={REPOSITORY_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline underline-offset-4"
                        >
                            <SiGithub className="mr-1 inline size-4 align-text-bottom" />
                            oBusk/authority
                        </a>
                        . It is hosted at {SITE_DOMAIN}.
                    </p>

                    <p className="pt-4 text-sm text-muted-foreground">
                        <em>Star Realms</em> is a trademark of Wise Wizard
                        Games. This is an unofficial fan-made tool with no
                        affiliation to, or endorsement from, the publisher.
                    </p>
                </div>
            </div>
        </main>
    );
}
