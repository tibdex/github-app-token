import { getOctokit } from "@actions/github";
import { createAppAuth } from "@octokit/auth-app";
import { request } from "@octokit/request";
import ensureError from "ensure-error";

export const fetchAppToken = async ({
  appId,
  privateKey,
}: Readonly<{
  appId: string;
  privateKey: string;
}>): Promise<string> => {
  const app = createAppAuth({
    appId,
    privateKey
  });

  const authApp = await app({ type: "app" });
  return authApp.token;

}