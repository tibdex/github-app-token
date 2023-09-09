import { getState, info } from "@actions/core";

import { revokeInstallationAccessToken } from "./revoke-installation-access-token.js";
import { run } from "./run.js";
import { tokenKey } from "./state.js";

await run(async () => {
  const token = getState(tokenKey);
  await revokeInstallationAccessToken(token);
  info("Token revoked successfully");
  await revokeInstallationAccessToken(token);
});
