import js from "@eslint/js";
import globals from "globals";

import prettierPlugin from "eslint-plugin-prettier";

import { defineConfig } from "eslint/config";

export default defineConfig([
  js.configs.recommended,
  {
    files: ["**/*.{js,mjs,cjs}"],
    ignores: [
      "coverage/**",
      "node_modules/**",
      ".next/**",
      "dist/**",
      "public/**",
    ],
    languageOptions: {
      globals: { ...globals.node, ...globals.jest },
      ecmaVersion: "latest",
      sourceType: "module",
    },
    plugins: { prettier: prettierPlugin },
    rules: {
      "no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
      "no-undef": "error",
      "no-unreachable": "error",
      "no-constant-condition": "warn",
      "no-debugger": "error",

      eqeqeq: ["error", "always"],
      "no-var": "error",
      "prefer-const": "error",
      "no-useless-return": "error",
      "no-empty": ["error", { allowEmptyCatch: true }],
      "no-shadow": "error",

      "no-process-exit": "warn",
      "no-sync": "warn",

      semi: "off",
      quotes: "off",
      indent: "off",
      "comma-dangle": "off",
      "object-curly-spacing": "off",
      "arrow-spacing": "off",
      "prettier/prettier": "error",

      "no-console": "warn",
      "no-trailing-spaces": "error",
      "eol-last": ["error", "always"],
      "max-lines": ["warn", 300],
      "max-depth": ["warn", 4],
    },
  },
]);
