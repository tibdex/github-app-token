"use strict";

module.exports = {
  importOrder: ["^node:(.*)$", "<THIRD_PARTY_MODULES>", "^[./]"],
  importOrderGroupNamespaceSpecifiers: true,
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  trailingComma: "all",
};
