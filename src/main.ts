import { info, saveState, setOutput, setSecret } from "@actions/core";

import { createInstallationAccessToken } from "./create-installation-access-token.js";
import { parseOptions } from "./parse-options.js";
import { run } from "./run.js";
import { tokenKey } from "./state.js";

await run(async () => {
  const options = parseOptions();
  const token = await createInstallationAccessToken(options);
  setSecret(token);
  saveState(tokenKey, token);
  setOutput("token", token);
  info("Token created successfully");
});
