const core = require('@actions/core');
const github = require('@actions/github');
const {Octokit} = require('@octokit/rest');
const {} = require('./helpers');

try {
  const githubToken = core.getInput('github-token');
  const githubContext = github.context;
  const octokit = new Octokit({
    auth: githubToken,
  });


  // retrieve workflow logs
  octokit.request('GET /repos/{owner}/{repo}/actions/runs/{run_id}/logs', {
    owner: githubContext.repo.owner,
    repo: githubContext.repo.repo,
    run_id: 'RUN_ID',
  }).then((response) => {
    console.log(response);
  });
} catch (error) {
  core.setFailed(error.message);
}
