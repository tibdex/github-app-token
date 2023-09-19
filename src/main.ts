
import { run } from "./run.js";
import { getInput } from "@actions/core";

await run(async () => {
  console.log(JSON.stringify({value: getInput("revoke")}));
});
