import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";

/** @type {import('eslint').Linter.Config} */
export default {
  parse: "@typescript-eslint/parser", //使用typeScript的解析器
  files: ["**/*.{js,mjs,cjs,ts}"],
  languageOptions: {
    globals: globals.browser,
  },
  plugins: {
    js: pluginJs,
    "@typescript-eslint": tseslint,
  },
  rules: {
    ...pluginJs.configs.recommended.rules,
    ...tseslint.configs.recommended.rules,
    "@typescript-eslint/no-explicit-any": "off", // 允许使用 any 类型
  },
};
