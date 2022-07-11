import { Buffer } from "node:buffer";
import { getInput, info, setFailed, setOutput, setSecret } from "@actions/core";
import { context } from "@actions/github";
import ensureError from "ensure-error";
import isBase64 from "is-base64";
import { fetchInstallationToken } from "./fetch-installation-token.js";

const run = async () => {
  try {
    const appId = getInput("app_id", { required: true });
    const privateKeyInput = getInput("private_key", { required: true });
    const privateKey = isBase64(privateKeyInput)
      ? Buffer.from(privateKeyInput, "base64").toString("utf8")
      : privateKeyInput;

    const installationId = getInput("installation_id");
    const repositoryInput = getInput("repository");

    // Note: if this input is not defined, then permissionsJSON === ''
    // See https://github.com/actions/toolkit/blob/c5278cdd088a8ed6a87dbd5c80d7c1ae03beb6e5/packages/core/src/core.ts#L120
    const permissionsJSON: string = getInput("permissions");

    const [owner, repo] = repositoryInput
      ? repositoryInput.split("/")
      : [context.repo.owner, context.repo.repo];

    const installationToken = await fetchInstallationToken({
      appId,
      installationId: installationId ? Number(installationId) : undefined,
      owner,
      permissions:
        permissionsJSON === ""
          ? undefined
          : (JSON.parse(permissionsJSON) as Record<string, string>),
      privateKey,
      repo,
    });

    setSecret(installationToken);
    setOutput("token", installationToken);
    info("Token generated successfully!");
  } catch (_error: unknown) {
    const error = ensureError(_error);
    setFailed(error);
  }
};

void run();
