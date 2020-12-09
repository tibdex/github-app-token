import { getOctokit } from "@actions/github";
import { createAppAuth } from "@octokit/auth-app";
import { Context } from "@actions/github/lib/context";

export async function getToken(
  privateKey: string,
  appId: string,
  context: { owner: string, repo: string }): Promise<string> {
  const app = createAppAuth({ appId, privateKey });
  const authApp = await app({ type: "app" });
  const jwt = authApp.token;
  const octokit = getOctokit(jwt);
  const {
    data: { id: installationId },
  } = await octokit.apps.getRepoInstallation(context);
  const installation = await app({ installationId, type: "installation" });
  return installation.token;
}
