
import { Octokit } from "octokit";

const auth = Bun.env.GITHUB_TOKEN;
// Create a personal access token at https://github.com/settings/tokens/new?scopes=repo
const octokit = new Octokit({ auth });

export { octokit };