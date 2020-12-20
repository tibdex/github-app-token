import { context, getOctokit } from "@actions/github";
import { createAppAuth } from "@octokit/auth-app";

export const fetchInstallationToken = async ({
  appId,
  owner,
  privateKey,
  repo,
}: Readonly<{
  appId: string;
  owner: string;
  privateKey: string;
  repo: string;
}>): Promise<string> => {
  const app = createAppAuth({ appId, privateKey });
  const authApp = await app({ type: "app" });
  const octokit = getOctokit(authApp.token);
  const {
    data: { id: installationId },
  } = await octokit.apps.getRepoInstallation({ owner, repo });
  const installation = await app({ installationId, type: "installation" });
  return installation.token;
};
