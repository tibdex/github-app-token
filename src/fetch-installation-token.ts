import { env } from "node:process";
import { getOctokit } from "@actions/github";
import { createAppAuth } from "@octokit/auth-app";
import { request } from "@octokit/request";

export const fetchInstallationToken = async ({
  appId,
  installationId,
  owner,
  privateKey,
  repo,
}: Readonly<{
  appId: string;
  installationId?: number;
  owner: string;
  privateKey: string;
  repo: string;
}>): Promise<string> => {
  const app = createAppAuth({
    appId,
    privateKey,
    request: request.defaults({
      // GITHUB_API_URL is part of GitHub Actions' built-in environment variables.
      // See https://docs.github.com/en/actions/reference/environment-variables#default-environment-variables.
      baseUrl: env.GITHUB_API_URL,
    }),
  });

  if (installationId === undefined) {
    const authApp = await app({ type: "app" });
    const octokit = getOctokit(authApp.token);
    ({
      data: { id: installationId },
    } = await octokit.rest.apps.getRepoInstallation({ owner, repo }));
  }

  const installation = await app({ installationId, type: "installation" });
  return installation.token;
};
