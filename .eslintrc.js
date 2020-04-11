"use strict";

module.exports = {
  // eslint-disable-next-line unicorn/prevent-abbreviations
  env: {
    es6: true,
  },
  extends: [
    "plugin:unicorn/recommended",
    "xo",
    "xo-typescript",
    "prettier",
    "prettier/@typescript-eslint",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2018,
    project: "tsconfig.json",
    sourceType: "module",
  },
  plugins: ["sort-destructure-keys", "typescript-sort-keys", "unicorn"],
  root: true,
  rules: {
    // @actions/github uses a lot of snake_case keys.
    "@typescript-eslint/camelcase": "off",
    // TypeScript is good at type inference and already requires types where they matter: exported symbols.
    "@typescript-eslint/explicit-function-return-type": "off",
    // We use sort-keys instead.
    "@typescript-eslint/member-ordering": "off",
    "arrow-body-style": "error",
    // Forbid function declarations
    "func-style": ["error", "expression", { allowArrowFunctions: true }],
    "no-console": "error",
    // TypeScript already takes care of that. See https://github.com/bradzacher/eslint-plugin-typescript/issues/110.
    "no-undef": "off",
    "object-shorthand": [
      "error",
      "always",
      { avoidExplicitReturnArrows: true },
    ],
    "sort-destructure-keys/sort-destructure-keys": [
      "error",
      { caseSensitive: false },
    ],
    "sort-keys": [
      "error",
      "asc",
      { caseSensitive: false, minKeys: 2, natural: true },
    ],
    "typescript-sort-keys/interface": "error",
    "typescript-sort-keys/string-enum": "error",
  },
};
