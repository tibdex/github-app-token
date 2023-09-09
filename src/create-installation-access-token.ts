import { debug } from "@actions/core";
import { getOctokit } from "@actions/github";
import { createAppAuth } from "@octokit/auth-app";
import { request } from "@octokit/request";

import { InstallationRetrievalDetails } from "./installation-retrieval-details.js";

export const createInstallationAccessToken = async ({
  appId,
  githubApiUrl,
  installationRetrievalDetails,
  permissions,
  privateKey,
  repositories,
}: Readonly<{
  appId: string;
  githubApiUrl: URL;
  installationRetrievalDetails: InstallationRetrievalDetails;
  permissions?: Record<string, string>;
  privateKey: string;
  repositories?: string[];
}>): Promise<string> => {
  const app = createAppAuth({
    appId,
    privateKey,
    request: request.defaults({
      baseUrl: githubApiUrl
        .toString()
        // Remove optional trailing `/`.
        .replace(/\/$/, ""),
    }),
  });

  const authApp = await app({ type: "app" });
  const octokit = getOctokit(authApp.token);

  let installationId: number;

  try {
    switch (installationRetrievalDetails.mode) {
      case "id":
        ({ id: installationId } = installationRetrievalDetails);
        break;
      case "organization":
        ({
          data: { id: installationId },
        } = await octokit.request("GET /orgs/{org}/installation", {
          org: installationRetrievalDetails.org,
        }));
        break;
      case "repository":
        ({
          data: { id: installationId },
        } = await octokit.request("GET /repos/{owner}/{repo}/installation", {
          owner: installationRetrievalDetails.owner,
          repo: installationRetrievalDetails.repo,
        }));
        break;
      case "user":
        ({
          data: { id: installationId },
        } = await octokit.request("GET /users/{username}/installation", {
          username: installationRetrievalDetails.username,
        }));
        break;
    }
  } catch (error: unknown) {
    throw new Error("Could not retrieve installation.", { cause: error });
  }

  debug(`Retrieved installation ID: ${installationId}.`);

  try {
    const {
      data: { token },
    } = await octokit.request(
      "POST /app/installations/{installation_id}/access_tokens",
      { installation_id: installationId, permissions, repositories },
    );
    return token;
  } catch (error: unknown) {
    throw new Error("Could not create installation access token.", {
      cause: error,
    });
  }
};
