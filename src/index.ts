import {
  error as logError,
  getInput,
  info,
  setFailed,
  setOutput,
  setSecret,
} from "@actions/core";
import { context, getOctokit } from "@actions/github";
import { App } from "@octokit/app";
import isBase64 from "is-base64";

const run = async () => {
  try {
    const id = Number(getInput("app_id", { required: true }));
    const privateKeyInput = getInput("private_key", { required: true });
    const privateKey = isBase64(privateKeyInput)
      ? Buffer.from(privateKeyInput, "base64").toString("utf8")
      : privateKeyInput;

    const repository = context.repo;
    const repositoryInput = getInput("repository");
    if (repositoryInput) {
      const repositorySplit = repositoryInput.split("/");
      repository.owner = repositorySplit[0];
      repository.repo = repositorySplit[1];
    }

    const app = new App({ id, privateKey });
    const jwt = app.getSignedJsonWebToken();
    const octokit = getOctokit(jwt);
    const {
      data: { id: installationId },
    } = await octokit.apps.getRepoInstallation(repository);
    const token = await app.getInstallationAccessToken({
      installationId,
    });
    setSecret(token);
    setOutput("token", token);
    info("Token generated successfully!");
  } catch (error) {
    logError(error);
    setFailed(error.message);
  }
};

void run();
