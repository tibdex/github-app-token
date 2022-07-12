import { Buffer } from "node:buffer";
import { getInput, info, setFailed, setOutput, setSecret } from "@actions/core";
import { context } from "@actions/github";
import ensureError from "ensure-error";
import isBase64 from "is-base64";
import { fetchInstallationToken } from "./fetch-installation-token.js";

const run = async () => {
  try {
    const appId = getInput("app_id", { required: true });

    const installationIdInput = getInput("installation_id");
    const installationId = installationIdInput
      ? Number(installationIdInput)
      : undefined;

    const permissionsInput = getInput("permissions");
    const permissions = permissionsInput
      ? (JSON.parse(permissionsInput) as Record<string, string>)
      : undefined;

    const privateKeyInput = getInput("private_key", { required: true });
    const privateKey = isBase64(privateKeyInput)
      ? Buffer.from(privateKeyInput, "base64").toString("utf8")
      : privateKeyInput;

    const repositoryInput = getInput("repository");
    const [owner, repo] = repositoryInput
      ? repositoryInput.split("/")
      : [context.repo.owner, context.repo.repo];

    const installationToken = await fetchInstallationToken({
      appId,
      installationId,
      owner,
      permissions,
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
