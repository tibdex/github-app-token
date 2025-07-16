import { getInput, getState, info } from "@actions/core";

import { revokeInstallationAccessToken } from "./revoke-installation-access-token.js";
import { run } from "./run.js";
import { expirationKey, tokenKey } from "./state.js";

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

  // if expiration is before now, then the token already expired and there's no need to revoke it
  const expiration = getState(expirationKey);
  const now = Date.now();
  const expirationTime = Date.parse(expiration);
  if (expirationTime < now) {
    info("Token is already expired, no need to revoke it");
    return;
  }
  await revokeInstallationAccessToken(token);
  info("Token revoked successfully");
});
