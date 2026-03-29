import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";

export default defineConfig([
  js.configs.recommended,
  {
    files: ["**/*.{js,mjs,cjs}"],
    languageOptions: {
      globals: { ...globals.node, ...globals.jest },
      ecmaVersion: "latest",
      sourceType: "module",
    },
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

      semi: ["error", "always"],
      quotes: ["error", "double"],
      indent: ["error", 2],
      "comma-dangle": ["error", "always-multiline"],
      "object-curly-spacing": ["error", "always"],
      "arrow-spacing": ["error", { before: true, after: true }],

      "no-console": "warn",
      "no-trailing-spaces": "error",
      "eol-last": ["error", "always"],
      "max-lines": ["warn", 300],
      "max-depth": ["warn", 4],
    },
  },
]);
