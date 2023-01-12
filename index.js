const core = require('@actions/core');
const github = require('@actions/github');
const {Octokit} = require('@octokit/rest');
const {
  retrieveLogs,
} = require('./helpers');

try {
  const githubToken = core.getInput('github-token');
  const workflowName = core.getInput('workflow-name');
  const pathLogs = core.getInput('path-logs') || process.cwd() + '/logs';
  core.setOutput('path-logs', pathLogs);
  const githubContext = github.context;
  const octokit = new Octokit({
    auth: githubToken,
  });
  console.debug('githubContext : ', github.context);
  console.debug('githubContext.logs_url : ', github.context.payload.workflow_run.logs_url);

  retrieveLogs(octokit, githubContext, workflowName, pathLogs);
} catch (error) {
  core.setFailed(error.message);
}
