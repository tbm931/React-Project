import js from "@eslint/js";
import parser from "@typescript-eslint/parser";
import plugin from "@typescript-eslint/eslint-plugin";

/** @type {import("eslint").FlatConfig[]} */
export default [
  js.configs.recommended,
  {
    files: ["**/*.ts", "**/*.tsx", "**/*.js"],
    languageOptions: {
      parser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        project: "./tsconfig.json",
      },
      globals: {
        console: true,
        process: true,
        module: true,
        __dirname: true,
        require: true,
      },
    },
    plugins: {
      "@typescript-eslint": plugin,
    },
    rules: {
      ...plugin.configs.recommended.rules,
      // אופציונלי: אם רוצים לכבות חוקים מעצבנים בפיתוח
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-namespace": "off",
      "no-undef": "off",
    },
  },
  {
    ignores: ["node_modules", "dist", "eslint.config.js"],
  },
];