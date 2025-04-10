import js from "@eslint/js"
import globals from "globals"
import eslintReact from "eslint-plugin-react"
import prettierReact from "eslint-plugin-prettier"
import eslintConfigPrettier from "eslint-config-prettier"

export default [
  {
    plugins: {
      react: eslintReact,
      prettier: prettierReact,
    },
  },
  {
    ignores: ["node_modules", "dist"],
  },
  js.configs.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.browser,
        ...globals.es2021,
      },
      parserOptions: eslintReact.configs.recommended.parserOptions,
    },
  },
  {
    files: ["**/*.{js.jsx}"],
    rules: {
      ...eslintConfigPrettier.rules,
    },
  },
]
