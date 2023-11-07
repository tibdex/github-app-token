import { debug } from "@actions/core";
import { getOctokit } from "@actions/github";

export type InstallationRetrievalDetails = Readonly<
  | { mode: "id"; id: number }
  | { mode: "organization"; org: string }
  | { mode: "repository"; owner: string; repo: string }
  | { mode: "user"; username: string }
>;

export const getInstallationRetrievalDetails = ({
  mode,
  payload,
}: Readonly<{
  mode: string;
  payload: string;
}>): InstallationRetrievalDetails => {
  switch (mode) {
    case "id":
      return { mode, id: parseInt(payload) };
    case "organization":
      return { mode, org: payload };
    case "repository":
      const [owner, repo] = payload.split("/");
      return { mode, owner, repo };
    case "user":
      return { mode, username: payload };
    default:
      throw new Error(`Unsupported retrieval mode: "${mode}".`);
  }
};

export const retrieveInstallationId = async (
  details: InstallationRetrievalDetails,
  { octokit }: Readonly<{ octokit: ReturnType<typeof getOctokit> }>,
): Promise<number> => {
  let id: number;
  try {
    switch (details.mode) {
      case "id":
        ({ id } = details);
        break;
      case "organization":
        ({
          data: { id },
        } = await octokit.request("GET /orgs/{org}/installation", {
          org: details.org,
        }));
        break;
      case "repository":
        ({
          data: { id },
        } = await octokit.request("GET /repos/{owner}/{repo}/installation", {
          owner: details.owner,
          repo: details.repo,
        }));
        break;
      case "user":
        ({
          data: { id },
        } = await octokit.request("GET /users/{username}/installation", {
          username: details.username,
        }));
        break;
    }
  } catch (error: unknown) {
    throw new Error("Could not retrieve installation.", { cause: error });
  }

  debug(`Retrieved installation ID: ${id}.`);
  return id;
};
