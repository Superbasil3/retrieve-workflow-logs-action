
const retrieveLogs = async (octokit, githubContext, workflowName) => {
  replaceString('Hello {0} {1}', ['World', '!!!']);
  // get list of workflow runs
  await getWorkflowRuns(octokit, githubContext.repo.owner, githubContext.repo.repo, workflowName);
  // get last worklow run by name, sort by date
};

// Function that replace variable in a string with element of an array
const replaceString = (string, array) => {
  let newString = string;
  array.forEach((element, index) => {
    newString = newString.replace(`{${index}}`, element);
  });
  console.log(string + ' =>\n ' + newString);
  return newString;
};

const getWorkflowRuns = async (octokit, owner, repo, workflowName) => {
  return await octokit.request('GET /repos/{owner}/{repo}/actions/runs{?actor,branch,event,status,per_page,page,created,exclude_pull_requests,check_suite_id,head_sha}', {
    owner: owner,
    repo: repo,
  }).then((response) => {
    const lastWorkflowRun = response.data.workflow_runs.filter((run) => run.name === workflowName).sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0];
    getWorkflowRunLogs(octokit, owner, repo, lastWorkflowRun.id);
  });
};

const getWorkflowRunLogs = async (octokit, owner, repo, runId, runAttempt) => {
  return await octokit.request('GET /repos/{owner}/{repo}/actions/runs/{run_id}/logs', {
    owner: owner,
    repo: repo,
    run_id: runId,
  }).then((response) => {
    console.log(response);
  });
};


module.exports = {
  getWorkflowRuns,
  getWorkflowRunLogs,
  replaceString,
  retrieveLogs,
};
