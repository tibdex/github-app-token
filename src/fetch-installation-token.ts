import { getOctokit } from "@actions/github";
import { createAppAuth } from "@octokit/auth-app";
import { StrategyOptions } from "@octokit/auth-app/dist-types/types";
import { request } from "@octokit/request";

export const fetchInstallationToken = async ({
  apiUrl,
  appId,
  owner,
  privateKey,
  repo,
}: Readonly<{
  apiUrl: string,
  appId: string;
  owner: string;
  privateKey: string;
  repo: string;
}>): Promise<string> => {
  const options: StrategyOptions = {
    appId,
    privateKey
  };
  if (apiUrl !== null && apiUrl !== '') {
    options.request = request.defaults({baseUrl: apiUrl});;
  }

  const app = createAppAuth(options);
  const authApp = await app({ type: "app" });
  const octokit = getOctokit(authApp.token);
  const {
    data: { id: installationId },
  } = await octokit.apps.getRepoInstallation({ owner, repo });
  const installation = await app({ installationId, type: "installation" });
  return installation.token;
};
