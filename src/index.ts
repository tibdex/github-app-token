import { Buffer } from "node:buffer";

import {
  debug,
  getInput,
  info,
  setFailed,
  setOutput,
  setSecret,
} from "@actions/core";
import isBase64 from "is-base64";

import { fetchInstallationToken } from "./fetch-installation-token.js";
import { getInstallationRetrievalDetails } from "./installation-retrieval-details.js";

try {
  const appId = getInput("app_id", { required: true });

  const githubApiUrlInput = getInput("github_api_url", { required: true });
  const githubApiUrl = new URL(githubApiUrlInput);

  const installationRetrievalMode = getInput("installation_retrieval_mode", {
    required: true,
  });
  const installationRetrievalPayload = getInput(
    "installation_retrieval_payload",
    { required: true },
  );
  const installationRetrievalDetails = getInstallationRetrievalDetails({
    mode: installationRetrievalMode,
    payload: installationRetrievalPayload,
  });
  debug(`Installation retrieval details: ${installationRetrievalDetails}.`);

  const permissionsInput = getInput("permissions");
  const permissions = permissionsInput
    ? (JSON.parse(permissionsInput) as Record<string, string>)
    : undefined;
  debug(`Requested permissions: ${permissions}.`);

  const privateKeyInput = getInput("private_key", { required: true });
  const privateKey = isBase64(privateKeyInput)
    ? Buffer.from(privateKeyInput, "base64").toString("utf8")
    : privateKeyInput;

  const repositoriesInput = getInput("repositories");
  const repositories = repositoriesInput
    ? (JSON.parse(repositoriesInput) as string[])
    : undefined;
  debug(`Requested repositories: ${permissions}.`);

  const token = await fetchInstallationToken({
    appId,
    githubApiUrl,
    installationRetrievalDetails,
    permissions,
    privateKey,
    repositories,
  });

  setSecret(token);
  setOutput("token", token);
  info("Token generated successfully!");
} catch (error) {
  // Using `console.error()` instead of only passing `error` to `setFailed()` for better error reporting.
  console.error(error);
  setFailed("");
}
