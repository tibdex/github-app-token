"use strict";

module.exports = {
  extends: ["prettier"],
  overrides: [
    {
      files: "**/*.{ts,tsx}",
      rules: {
        // Covered by TypeScript.
        "default-case": "off",
      },
    },
  ],
  plugins: ["sort-destructure-keys", "typescript-sort-keys"],
  rules: {
    // Forbid function declarations.
    "func-style": ["error", "expression", { allowArrowFunctions: true }],
    // Already taken care of by TypeScript.
    "import/namespace": "off",
    // Named export are better for static analysis.
    // See https://humanwhocodes.com/blog/2019/01/stop-using-default-exports-javascript-module/
    "import/no-default-export": "error",
    "import/no-namespace": "error",
    "import/order": [
      "error",
      {
        alphabetize: {
          caseInsensitive: true,
          order: "asc",
        },
        "newlines-between": "never",
      },
    ],
    "no-console": "error",
    "object-shorthand": [
      "error",
      "always",
      { avoidExplicitReturnArrows: true },
    ],
    "sort-destructure-keys/sort-destructure-keys": [
      "error",
      {
        caseSensitive: false,
      },
    ],
    "sort-imports": ["error", { ignoreDeclarationSort: true }],
    "sort-keys": [
      "error",
      "asc",
      {
        caseSensitive: false,
        minKeys: 2,
        natural: true,
      },
    ],
    "typescript-sort-keys/interface": "error",
    "typescript-sort-keys/string-enum": "error",
    // Not supported by Node.js 12.
    "unicorn/prefer-node-protocol": "off",
  },
};
