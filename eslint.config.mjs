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
]);

export default eslintConfig;
