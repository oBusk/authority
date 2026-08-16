import { defineConfig } from "eslint/config";
import nextObusk from "@obusk/eslint-config-next";

const eslintConfig = defineConfig([
    ...nextObusk,
    {
        settings: {
            react: {
                version: "19.2.8",
            },
            tailwindcss: {
                cssConfigPath: "./src/app/globals.css",
            },
        },
    },
    {
        // Plain script running in a ServiceWorkerGlobalScope, not a module and
        // not part of the app bundle. `tsconfig.json` does not include it, so
        // it is linted but never typechecked.
        files: ["public/sw.js"],
        languageOptions: {
            sourceType: "script",
            globals: {
                self: "readonly",
                fetch: "readonly",
                Request: "readonly",
                Response: "readonly",
                URL: "readonly",
            },
        },
    },
]);

export default eslintConfig;
