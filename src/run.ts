import { setFailed } from "@actions/core";

export const run = async (callback: () => Promise<unknown>) => {
  try {
    await callback();
  } catch (error) {
    // Using `console.error()` instead of only passing `error` to `setFailed()` for better error reporting.
    // See https://github.com/actions/toolkit/issues/1527.
    console.error(error);
    setFailed("");
  }
};
