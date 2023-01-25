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

# Release Process
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
