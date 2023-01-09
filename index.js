const core = require('@actions/core');
const github = require('@actions/github');
const {Octokit} = require('@octokit/rest');
const {} = require('./helpers');

try {
  // const githubToken = core.getInput('github-token');
  const githubContext = github.context;
  const octokit = new Octokit({
    auth: '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',
  });


  await octokit.request('GET /repos/{owner}/{repo}/actions/runs{?actor,branch,event,status,per_page,page,created,exclude_pull_requests,check_suite_id,head_sha}', {
    owner: githubContext.repo.owner,
    repo: githubContext.repo.repo,
  }).then((response) => {
    console.log(response);
  })

  // retrieve workflow logs
  await octokit.request('GET /repos/{owner}/{repo}/actions/runs/{run_id}/logs', {
    owner: githubContext.repo.owner,
    repo: githubContext.repo.repo,
    run_id: 'RUN_ID'
  }).then((response) => {
    console.log(response);
  })

} catch (error) {
  core.setFailed(error.message);
}
