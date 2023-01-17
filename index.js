const core = require('@actions/core');
const github = require('@actions/github');
const {Octokit} = require('@octokit/rest');
const {
  retrieveLogs,
} = require('./helpers');

try {
  const githubToken = core.getInput('github-token');
  const keepOnlyErrorFiles = core.getInput('keep-only-error-files') || true;
  const pathLogs = core.getInput('path-logs') || process.cwd() + '/logs';
  core.setOutput('path-logs', pathLogs);
  const octokit = new Octokit({
    auth: githubToken,
  });
  retrieveLogs(octokit, github.context, pathLogs, keepOnlyErrorFiles);
} catch (error) {
  core.setFailed(error.message);
}
