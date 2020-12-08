import {
  error as logError,
  getInput,
  info,
  setFailed,
  setOutput,
  setSecret,
} from "@actions/core";
import { context, getOctokit } from "@actions/github";
import { createAppAuth } from "@octokit/auth-app";
import isBase64 from "is-base64";

const run = async () => {
  try {
    const id = Number(getInput("app_id", { required: true }));
    const privateKeyInput = getInput("private_key", { required: true });
    const privateKey = isBase64(privateKeyInput)
      ? Buffer.from(privateKeyInput, "base64").toString("utf8")
      : privateKeyInput;
    const app = createAppAuth({ appId: id, privateKey: privateKey });
    const authApp = await app({ type: "app" });
    const jwt = authApp.token;
    const octokit = getOctokit(jwt);
    const {
      data: { id: installationId },
    } = await octokit.apps.getRepoInstallation(context.repo);
    const installation = await app({ installationId, type: "installation" });
    const installationToken = installation.token;
    setSecret(installationToken);
    setOutput("token", installationToken);
    info("Token generated successfully!");
  } catch (error: unknown) {
    if (typeof error !== "string" && !(error instanceof Error)) {
      throw new TypeError(`Caught error of unexpected type: ${typeof error}`);
    }

    setFailed(error);
  }
};

void run();
