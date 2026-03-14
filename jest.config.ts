import type { Config } from "jest";

const config: Config = {
    preset: "ts-jest",
    testEnvironment: "jsdom",
    setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
    moduleNameMapper: {
        // Support @/ path alias (maps to project root)
        "^@/(.*)$": "<rootDir>/$1",
    },
    testMatch: ["<rootDir>/lib/__tests__/**/*.test.ts"],
    transform: {
        "^.+\\.(ts|tsx)$": [
            "ts-jest",
            {
                tsconfig: {
                    jsx: "react-jsx",
                },
            },
        ],
    },
};

export default config;
