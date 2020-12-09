import {
  error as logError,
  getInput,
  info,
  setFailed,
  setOutput,
  setSecret,
} from "@actions/core";
import { context, getOctokit } from "@actions/github";

import isBase64 from "is-base64";

import { getToken } from "./get-token";

const run = async () => {
  try {
    // Parse inputs
    const id = getInput("app_id", { required: true });
    const privateKeyInput = getInput("private_key", { required: true });
    const privateKey = isBase64(privateKeyInput)
      ? Buffer.from(privateKeyInput, "base64").toString("utf8")
      : privateKeyInput;

    // Run our actual logic
    const installationToken = await getToken(privateKey, id, context.repo);

    // Set our inputs as needed
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
