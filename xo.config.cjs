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
    // GitHub uses snake_case in its returned payloads.
    "@typescript-eslint/naming-convention": "off",
    // Forbid function declarations.
    "func-style": ["error", "expression", { allowArrowFunctions: true }],
    // Already taken care of by TypeScript.
    "import/namespace": "off",
    // Named export are better for static analysis.
    // See https://humanwhocodes.com/blog/2019/01/stop-using-default-exports-javascript-module/
    "import/no-default-export": "error",
    "import/no-extraneous-dependencies": [
      "error",
      {
        devDependencies: false,
        optionalDependencies: false,
        peerDependencies: false,
      },
    ],
    "import/no-namespace": "error",
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
  },
};
