# GitHub App Token

This [JavaScript GitHub Action](https://help.github.com/en/actions/building-actions/about-actions#javascript-actions) can be used to impersonate a GitHub App when `secrets.GITHUB_TOKEN`'s limitations are too restrictive and a personal access token is not suitable.

For instance, from [GitHub Actions' docs](https://docs.github.com/en/actions/using-workflows/triggering-a-workflow#triggering-a-workflow-from-a-workflow):

> When you use the repository's `GITHUB_TOKEN` to perform tasks, events triggered by the `GITHUB_TOKEN`, with the exception of `workflow_dispatch` and `repository_dispatch`, will not create a new workflow run.
> This prevents you from accidentally creating recursive workflow runs.
> For example, if a workflow run pushes code using the repository's `GITHUB_TOKEN`, a new workflow will not run even when the repository contains a workflow configured to run when push events occur.

A workaround is to use a [personal access token](https://help.github.com/en/github/authenticating-to-github/creating-a-personal-access-token-for-the-command-line) from a [personal user/bot account](https://help.github.com/en/github/getting-started-with-github/types-of-github-accounts#personal-user-accounts).
However, for organizations, GitHub Apps are [a more appropriate automation solution](https://developer.github.com/apps/differences-between-apps/#machine-vs-bot-accounts).

# Example Workflow

```yml
jobs:
  job:
    runs-on: ubuntu-latest
    steps:
      - id: create_token
        uses: tibdex/github-app-token@v2
        with:
          app_id: ${{ secrets.APP_ID }}

          # Optional.
          # github_api_url: https://api.example.com

          # Optional.
          # installation_retrieval_mode: id

          # Optional.
          # installation_retrieval_payload: 1337

          # Optional.
          # Using a YAML multiline string to avoid escaping the JSON quotes.
          # permissions: >-
          #   {"pull_requests": "read"}

          private_key: ${{ secrets.PRIVATE_KEY }}

          # Optional.
          # repositories: >-
          #   ["actions/toolkit", "github/docs"]

          # Optional.
          # List of repository IDs that the token should have access to
          # https://docs.github.com/en/rest/apps/apps?apiVersion=2022-11-28#create-an-installation-access-token-for-an-app
          # https://docs.github.com/en/actions/learn-github-actions/contexts#github-context
          # repository_ids: >-
          #   [${{github.repository_id}}]

          # Optional.
          # revoke: false

      - run: "echo 'The created token is masked: ${{ steps.create_token.outputs.token }}'"
```

[Another use case for this action can (or could) be found in GitHub's own docs](https://web.archive.org/web/20230115194214/https://docs.github.com/en/issues/planning-and-tracking-with-projects/automating-your-project/automating-projects-using-actions#example-workflow-authenticating-with-a-github-app).
