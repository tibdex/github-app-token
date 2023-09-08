export default {
  importOrder: ["^node:(.*)$", "<THIRD_PARTY_MODULES>", "^[./]"],
  importOrderGroupNamespaceSpecifiers: true,
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  plugins: [
    "@trivago/prettier-plugin-sort-imports",
    "prettier-plugin-packagejson",
  ],
};
