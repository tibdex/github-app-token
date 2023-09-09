export type InstallationRetrievalDetails = Readonly<
  | { mode: "id"; id: number }
  | { mode: "organization"; org: string }
  | { mode: "repository"; owner: string; repo: string }
  | { mode: "user"; username: string }
>;

export const getInstallationRetrievalDetails = ({mode, payload}: Readonly<{mode: string, payload: string}>): InstallationRetrievalDetails => {
 switch (mode) {
    case "id":
        return {mode, id: Number(payload)};
    case "organization":
        return {mode, org: payload};
    case "repository":
        const [owner, repo] = payload.split("/");
        return {mode, owner, repo};
    case "user":
        return {mode, username: payload};
    default:
        throw new Error(`Unsupported retrieval mode: "${mode}".`)
 }
};
