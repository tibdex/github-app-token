import { getOctokit } from "@actions/github";
import { createAppAuth } from "@octokit/auth-app";
import { request } from "@octokit/request";

import {
  InstallationRetrievalDetails,
  retrieveInstallationId,
} from "./installation-retrieval.js";

export type InstallationAccessTokenCreationOptions = Readonly<{
  appId: string;
  githubApiUrl: URL;
  installationRetrievalDetails: InstallationRetrievalDetails;
  permissions?: Record<string, string>;
  privateKey: string;
  repositories?: string[];
  repositoryIDs?: number[];
}>;

export const createInstallationAccessToken = async ({
  appId,
  githubApiUrl,
  installationRetrievalDetails,
  permissions,
  privateKey,
  repositories,
  repositoryIDs,
}: InstallationAccessTokenCreationOptions): Promise<string> => {
  try {
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

    const installationId = await retrieveInstallationId(
      installationRetrievalDetails,
      { octokit },
    );

    const {
      data: { token },
    } = await octokit.request(
      "POST /app/installations/{installation_id}/access_tokens",
      {
        installation_id: installationId,
        permissions,
        repositories,
        repository_ids: repositoryIDs,
      },
    );
    return token;
  } catch (error: unknown) {
    throw new Error("Could not create installation access token.", {
      cause: error,
    });
  }
};
