# GitHub App (recommended) Setup

For production, prefer a GitHub App with least privilege instead of a single long-lived personal token.

Minimum permissions for agents in this project:
- Checks: Read & write
- Contents: Read
- Pull requests: Read & write (for draft PR creation)
- Issues: Read & write (for comments)
- Deployments: Read & write (for CICD agent)

Steps:
1. Go to Settings → Developer settings → GitHub Apps → New GitHub App.
2. Configure the permissions above and set a webhook URL to your runner.
3. Install the app on the target repositories or organization.
4. Generate a private key and the App ID; store them in your secrets store (e.g., `GITHUB_APP_ID`, `GITHUB_PRIVATE_KEY`).

Use an Octokit JWT flow to authenticate as the app and obtain installation tokens for repo actions.
