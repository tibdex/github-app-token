import { getOctokit } from "@actions/github";
import { createAppAuth } from "@octokit/auth-app";
import { request } from "@octokit/request";
import ensureError from "ensure-error";

export const fetchInstallationToken = async ({
  appId,
  baseUrl,
  installationId,
  owner,
  permissions,
  privateKey,
  repo,
}: Readonly<{
  appId: string;
  baseUrl: URL;
  installationId?: number;
  owner: string;
  permissions?: Record<string, string>;
  privateKey: string;
  repo: string;
}>): Promise<string> => {
  const app = createAppAuth({
    appId,
    privateKey,
    request: request.defaults({
      baseUrl: baseUrl.toString().replace(/\/+$/, ''),
    }),
  });

  const authApp = await app({ type: "app" });
  const octokit = getOctokit(authApp.token);
  if (installationId === undefined) {
    try {
      ({
        data: { id: installationId },
      } = await octokit.rest.apps.getRepoInstallation({ owner, repo }));
    } catch (error: unknown) {
      throw new Error(
        "Could not get repo installation. Is the app installed on this repo?",
        { cause: ensureError(error) },
      );
    }
  }

  try {
    const { data: installation } =
      await octokit.rest.apps.createInstallationAccessToken({
        installation_id: installationId,
        permissions,
      });
    return installation?.token;
  } catch (error: unknown) {
    throw new Error("Could not create installation access token.", {
      cause: ensureError(error),
    });
  }
};
