const core = require('@actions/core');
const github = require('@actions/github');
const {Octokit} = require('@octokit/rest');
const {
  retrieveLogs,
} = require('./helpers');

try {
  const githubToken = core.getInput('github-token');
  const workflowName = core.getInput('workflow-name');
  const githubContext = github.context;
  const octokit = new Octokit({
    auth: githubToken,
  });

  retrieveLogs(octokit, githubContext, workflowName);
} catch (error) {
  core.setFailed(error.message);
}
