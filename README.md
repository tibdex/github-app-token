# GitHub App Token
This [JavaScript GitHub Action](https://help.github.com/en/actions/building-actions/about-actions#javascript-actions) can be used to impersonate a GitHub App when `secrets.GITHUB_TOKEN`'s limitations are too restrictive and a personal access token is not suitable.

For instance, from [GitHub Actions' docs](https://docs.github.com/en/actions/using-workflows/triggering-a-workflow#triggering-a-workflow-from-a-workflow):

> When you use the repository's `GITHUB_TOKEN` to perform tasks, events triggered by the `GITHUB_TOKEN`, with the exception of `workflow_dispatch` and `repository_dispatch`, will not create a new workflow run.
> This prevents you from accidentally creating recursive workflow runs.
> For example, if a workflow run pushes code using the repository's `GITHUB_TOKEN`, a new workflow will not run even when the repository contains a workflow configured to run when push events occur.

A workaround is to use a [personal access token](https://help.github.com/en/github/authenticating-to-github/creating-a-personal-access-token-for-the-command-line) from a [personal user/bot account](https://help.github.com/en/github/getting-started-with-github/types-of-github-accounts#personal-user-accounts).
However, for organizations, GitHub Apps are [a more appropriate automation solution](https://developer.github.com/apps/differences-between-apps/#machine-vs-bot-accounts).

### Index
1. [Examples](#examples)
    1. [Cloning Private Submodules](#cloning-private-submodules)
1. [Release Process](#release-process)

## Examples
Here is a generic example retrieving a token from a GitHub App using this action, then consuming that token in a subsequent step. You can see some of the optional inputs listed in comments, as well.
```yml
jobs:
  job:
    runs-on: ubuntu-latest
    steps:
      - name: Generate token
        id: generate_token
        uses: tibdex/github-app-token@v1
        with:
          app_id: ${{ secrets.APP_ID }}

          # Optional.
          # github_api_url: https://api.example.com

          # Optional.
          # installation_id: 1337

          # Optional.
          # Using a YAML multiline string to avoid escaping the JSON quotes.
          # permissions: >-
          #   {"members": "read"}

          private_key: ${{ secrets.PRIVATE_KEY }}

          # Optional.
          # repository: owner/repo

      - name: Use token
        env:
          TOKEN: ${{ steps.generate_token.outputs.token }}
        run: |
          echo "The generated token is masked: ${TOKEN}"
```

### Cloning Private Submodules
This action is a great way to securely clone private submodules, a common need that remains unsupported by GitHub Actions as described in actions/checkout [issue 287](https://github.com/actions/checkout/issues/287). Using GitHub App integration to clone submodules does not consume a paid user seat with a service account, the secrets cannot be used to login to the GitHub web UI, and the token used for the clone expires after one hour.

Steps:
1. [Create a GitHub App](https://docs.github.com/en/developers/apps/building-github-apps/creating-a-github-app).
    1. Profile > Your organizations > Organization Settings > GitHub Apps > New GitHub App
    1. Fill in the information for the app.
        1. GitHub App name:
            ```
            ${REPO_NAME}-ci-submodule-checkout
            ```
        1. Description:
            ```
            This GitHub application is used by the ${REPO_NAME} CICD pipeline(s) to clone private submodules by using a fork of the tibdex/github-app-token GitHub Action to obtain an ephemeral token from this app and assume its identity. This token expires after one hour.
            ```
        1. Homepage URL:
            ```
            ${REPO_URL}
            ```
        1. Ensure the `Expire user authorization tokens` checkbox is checked.
        1. Disable webhook notifications.
        1. Permissions > Repository permissions > Contents > Read-only
            - This will implicitly set `Metadata` to `Read-only` as well.
        1. For `Where can this integration be installed?` choose `Only on this account`.
    1. Click `Create GitHub App`.
1. Obtain credentials to assume the identity of the app.
    1. Profile > Your organizations > Developer settings > GitHub Apps > `${REPO_NAME}-ci-submodule-checkout` > Edit
    1. Private keys > Generate a private key
    1. A private key downloads to your computer as a `*.pem` file. Keep this secret.
    1. Note the app ID. Keep this secret.
1. Install the app in the organization.
    1. Organization > Settings > GitHub Apps > `${REPO_NAME}-ci-submodule-checkout` > Edit
    1. Install App
    1. Click `Install` for the desired organization.
    1. `Install & Request` on your organization > Only select repositories
        - If you are an org admin, the button may be labeled differently.
    1. Select the appropriate repos in the drop-down.
        - **_This must include both the submodules you wish to clone as well as the repo you are cloning them into!_**  
          Ask me how I know, lol.
    1. Click `Install & Request`.
        - If you are an org admin, the button may be labeled differently.
1. Create repo secrets for app integration.
    1. Repo > Settings > Secrets and variables > Actions
    1. Add two new secrets.
        ```
        ${REPO_NAME}_CI_APP_ID
        ${REPO_NAME}_CI_APP_KEY
        ```
1. Use the GitHub App to clone private submodules in your GitHub Actions workflow(s).
    ```yaml
    name: CI

    on: [push, workflow_dispatch]

    jobs:
      build:
        name: Build
        runs-on: ubuntu-latest

        steps:
          - name: Authenticate
            id: auth
            uses: AntelopeIO/github-app-token-action@v1
            with:
              app_id: ${{ secrets.${REPO_NAME}_CI_APP_ID }}
              private_key: ${{ secrets.${REPO_NAME}_CI_APP_KEY }}

          - name: Checkout Repo
            uses: actions/checkout@v3
            with:
              fetch-depth: 0
              submodules: 'recursive'
              token: ${{ steps.auth.outputs.token }}

          - name: Do a Thing
            run: tree -L 2
    ```

Don't forget to replace `${REPO_NAME}` and `${REPO_URL}` with the appropriate values if you copy/pasta these examples.

The author recommends using a different GitHub App integration for each repo cloning submodules. This allows you to follow the [principle of least priviledge](https://en.wikipedia.org/wiki/Principle_of_least_privilege).

Credit to [@petr-tichy](https://github.com/petr-tichy) for [the idea](https://github.com/actions/checkout/issues/287#issuecomment-1255364513), and [@matthijskooijman](https://github.com/matthijskooijman) for sharing [detailed steps to accomplish this](https://github.com/actions/checkout/issues/287#issuecomment-1315458401). Thank you both!

## Release Process
When a commit is pushed to the base branch (`main`), the [dylanvann/publish-github-action](https://github.com/DylanVann/publish-github-action) GitHub Action is invoked. If the `version` field in the `package.json` is new, then the action:
1. Downloads dependencies.
1. Builds the project.
1. Packs the action as a minimal distributable.
1. Puts these files on a branch named "`releases/`" with the version string appended to the end.
1. Points tags corresponding to the major, minor, and patch versions at the `HEAD` of the new `release*` branch.

For example, if the `version` field in `package.json` is `1.1.1`, the following refs will be created.
- A branch named `releases/v1.1.1` with the action built and other files removed.
- A tag named `v1.1.1` is created pointing at the `HEAD` of `releases/v1.1.1`.
- A tag named `v1.1` is _moved_ or created, pointing at the `HEAD` of `releases/v1.1.1`.
- A tag named `v1` is _moved_ or created, pointing at the `HEAD` of `releases/v1.1.1`.

It is important to note some repo protections will prevent this action from running.
- Tag protections.
- Branch protections matching the release pattern.
- Code signing requirements.

If these are enforced, they must be disabled for the action to run.
