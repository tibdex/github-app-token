import { getOctokit } from "@actions/github";

export const revokeInstallationAccessToken = async (
  token: string,
): Promise<void> => {
  try {
    const octokit = getOctokit(token);

    await octokit.request("DELETE /installation/token");
  } catch (error: unknown) {
    throw new Error("Could not revoke installation access token.", {
      cause: error,
    });
  }
};
