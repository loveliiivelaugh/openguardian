import { octokit } from '../src/config/github.config';

export async function createPullRequest(repoUrl: string, branch: string, message: string) {
  const [_, owner, repo] = repoUrl.match(/github\.com\/(.+?)\/(.+?)(\.git)?$/) || [];

  if (!owner || !repo) throw new Error('Invalid repo URL');

  // This assumes you’ve pushed a commit to `branch`
  const { data: pr } = await octokit.rest.pulls.create({
    owner,
    repo,
    title: message,
    head: branch,
    base: 'main',
    body: 'Automated PR from Guardian codegen',
  });

  return pr.html_url;
}
