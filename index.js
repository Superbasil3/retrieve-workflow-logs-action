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
  // Get home directory
  const homeDir = process.env.HOME;
  console.log('homeDir : ', homeDir);

  console.log('githubContext : ', github.context.payload.workflow_run.logs_url);
  retrieveLogs(octokit, githubContext, workflowName);
} catch (error) {
  core.setFailed(error.message);
}
