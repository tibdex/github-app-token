import { getInput, getState, info } from "@actions/core";

import { revokeInstallationAccessToken } from "./revoke-installation-access-token.js";
import { run } from "./run.js";
import { tokenKey } from "./state.js";

await run(async () => {
  if (!JSON.parse(getInput("revoke"))) {
    info("Token revocation skipped");
    return;
  }

  const token = getState(tokenKey);
  if (!token) {
    info("No token to revoke");
    return;
  }
  await revokeInstallationAccessToken(token);
  info("Token revoked successfully");
});
