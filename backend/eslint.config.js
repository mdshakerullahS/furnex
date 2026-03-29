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
      /*
       * 🔴 Possible Errors (VERY IMPORTANT)
       */
      "no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
      "no-undef": "error",
      "no-unreachable": "error",
      "no-constant-condition": "warn",
      "no-debugger": "error",

      /*
       * 🟠 Best Practices
       */
      eqeqeq: ["error", "always"],
      "no-var": "error",
      "prefer-const": "error",
      "no-useless-return": "error",
      "no-empty": ["error", { allowEmptyCatch: true }],
      "no-shadow": "error",

      /*
       * 🔵 Node / Backend Focus
       */
      "no-process-exit": "warn",
      "no-sync": "warn", // discourage blocking code

      /*
       * 🟢 Code Style (strict but not annoying)
       */
      semi: ["error", "always"],
      quotes: ["error", "double"],
      indent: ["error", 2],
      "comma-dangle": ["error", "always-multiline"],
      "object-curly-spacing": ["error", "always"],
      "arrow-spacing": ["error", { before: true, after: true }],

      /*
       * 🧼 Clean Code
       */
      "no-console": "warn",
      "no-trailing-spaces": "error",
      "eol-last": ["error", "always"],
      "max-lines": ["warn", 300],
      "max-depth": ["warn", 4],
    },
  },
]);
