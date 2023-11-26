import { Buffer } from "node:buffer";

import { debug, getInput } from "@actions/core";
import isBase64 from "is-base64";

import { InstallationAccessTokenCreationOptions } from "./create-installation-access-token.js";
import { getInstallationRetrievalDetails } from "./installation-retrieval.js";

export const parseOptions = (): InstallationAccessTokenCreationOptions => {
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
  debug(
    `Installation retrieval details: ${JSON.stringify(
      installationRetrievalDetails,
    )}.`,
  );

  const permissionsInput = getInput("permissions");
  const permissions = permissionsInput
    ? (JSON.parse(permissionsInput) as Record<string, string>)
    : undefined;
  debug(`Requested permissions: ${JSON.stringify(permissions)}.`);

  const privateKeyInput = getInput("private_key", { required: true });
  const privateKey = isBase64(privateKeyInput)
    ? Buffer.from(privateKeyInput, "base64").toString("utf8")
    : privateKeyInput;

  const repositoriesInput = getInput("repositories");
  const repositories = repositoriesInput
    ? (JSON.parse(repositoriesInput) as string[])
    : undefined;
  debug(`Requested repositories: ${JSON.stringify(repositories)}.`);

  const repositoryIDsInput = getInput("repository_ids");
  const repositoryIDs = repositoryIDsInput
    ? (JSON.parse(repositoryIDsInput) as number[])
    : undefined;
  debug(`Requested repository_ids: ${JSON.stringify(repositoryIDs)}.`);

  return {
    appId,
    githubApiUrl,
    installationRetrievalDetails,
    permissions,
    privateKey,
    repositories,
    repositoryIDs,
  };
};
