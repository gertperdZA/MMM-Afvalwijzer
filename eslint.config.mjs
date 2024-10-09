import eslintPluginJs from "@eslint/js";
import eslintPluginStylistic from "@stylistic/eslint-plugin";
import globals from "globals";

const config = [
  {
    files: ["**/*.js", "**/*.mjs"],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node
      }
    },
    plugins: {
      ...eslintPluginStylistic.configs["recommended-flat"].plugins,
    },
    rules: {
      ...eslintPluginJs.configs.all.rules,
      ...eslintPluginStylistic.configs["recommended-flat"].rules,
      "@stylistic/brace-style": ["error", "1tbs", { allowSingleLine: true }],
      "@stylistic/comma-dangle": ["error", "only-multiline"],
      "@stylistic/max-statements-per-line": ["error", { max: 2 }],
      "@stylistic/operator-linebreak": ["error", "after"],
      "@stylistic/quotes": ["error", "double"],
      "@stylistic/semi": ["error", "always"],
      "@stylistic/spaced-comment": "off",
      "capitalized-comments": "off",
      "complexity": "off",
      "consistent-this": "off",
      "id-length": "off",
      "max-lines-per-function": "off",
      "max-statements": "off",
      "no-inline-comments": "off",
      "no-magic-numbers": "off",
      "no-plusplus": "off",
      "no-useless-assignment": "off",
      "no-ternary": "off",
      "one-var": "off",
      "sort-keys": "off",
    },
  },
];

export default config;
