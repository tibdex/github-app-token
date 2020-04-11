import { getInput, info, setFailed, setOutput, setSecret } from "@actions/core";
import { context, GitHub } from "@actions/github";
import { App } from "@octokit/app";
import isBase64 from "is-base64";

const run = async () => {
  try {
    const id = Number(getInput("app_id", { required: true }));
    const privateKeyInput = getInput("private_key", { required: true });
    const privateKey = isBase64(privateKeyInput)
      ? Buffer.from(privateKeyInput, "base64").toString("utf8")
      : privateKeyInput;
    const app = new App({ id, privateKey });
    const jwt = app.getSignedJsonWebToken();
    const github = new GitHub(jwt);
    const {
      data: { id: installationId },
    } = await github.apps.getRepoInstallation(context.repo);
    const token = await app.getInstallationAccessToken({
      installationId,
    });
    setSecret(token);
    setOutput("token", token);
    info("Token generated successfully!");
  } catch (error) {
    if (error instanceof Error) {
      setFailed(error.message);
    }
  }
};

run();
