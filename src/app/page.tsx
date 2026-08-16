import Link from "next/link";
import { Suspense } from "react";
import { SiGithub } from "react-icons/si";
import { ThemeToggle } from "^/components/ThemeToggle";
import { cx } from "^/lib/cva";

export default function Home() {
    return (
        <>
            <Suspense>
                <ThemeToggle />
            </Suspense>
            <main className="flex min-h-screen flex-col items-center justify-center bg-linear-to-b from-zinc-50 to-zinc-100 p-6 dark:from-zinc-900 dark:to-zinc-800">
                <div className="mx-auto flex w-full max-w-3xl flex-col items-center text-center">
                    {/* Logo */}
                    <div className="mb-8 rounded-full bg-white p-6 shadow-md dark:bg-zinc-800">
                        <div className="flex size-24 items-center justify-center rounded-full bg-linear-to-r from-blue-500 to-cyan-500 text-4xl font-bold text-white">
                            tN
                        </div>
                    </div>

                    {/* Title */}
                    <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-zinc-900 md:text-5xl dark:text-white">
                        template-next
                    </h1>

                    {/* Subtitle */}
                    <p className="mb-8 text-xl font-medium text-zinc-700 md:text-2xl dark:text-zinc-300">
                        by{" "}
                        <span className="text-blue-600 dark:text-blue-400">
                            oBusk
                        </span>
                    </p>

                    {/* Description */}
                    <div className="mb-10 max-w-2xl">
                        <p className="mb-4 text-lg">
                            An opinionated boilerplate for creating Next.js
                            applications with a focus on developer experience
                            and code quality.
                        </p>

                        <h2 className="mt-6 mb-3 text-xl font-bold">
                            Features
                        </h2>
                        <ul className="list-inside list-disc space-y-2 text-left">
                            <li>Built with Next.js 16.3</li>
                            <li>Styled with Tailwind CSS 4</li>
                            <li>
                                Strict typing and linting using{" "}
                                <a
                                    href="https://github.com/oBusk/eslint-config-next"
                                    className="text-blue-600 hover:underline dark:text-blue-400"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    @obusk/eslint-config-next
                                </a>
                            </li>
                            <li>Ready for your next project</li>
                        </ul>
                    </div>

                    {/* Buttons */}
                    <div
                        className={cx(
                            "flex w-full max-w-md flex-col gap-4 sm:flex-row",
                            "mb-6",
                        )}
                    >
                        <Link
                            href="https://github.com/oBusk/template-next"
                            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-zinc-800 px-6 py-3 font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-700 dark:hover:bg-zinc-600"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <SiGithub className="size-5" />
                            View on GitHub
                        </Link>
                        <Link
                            href="https://github.com/new?template_name=template-next&template_owner=oBusk"
                            className="flex flex-1 items-center justify-center rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Use Template
                        </Link>
                    </div>
                </div>
            </main>
        </>
    );
}
