import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        setupFiles: ["./test/setup.ts"],

        fileParallelism: false,

        coverage: {
            provider: "v8",

            reporter: [
                "text",
                "html",
            ],

            include: [
                "src/**/*.ts",
            ],

            exclude: [
                "src/index.ts",
                "src/types.ts",
            ],
        },
    },
});
