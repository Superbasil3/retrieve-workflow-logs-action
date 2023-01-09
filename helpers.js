
const getWorkflowRuns = async (octokit, owner, repo) => {
  return await octokit.request('GET /repos/{owner}/{repo}/actions/runs{?actor,branch,event,status,per_page,page,created,exclude_pull_requests,check_suite_id,head_sha}', {
    owner: owner,
    repo: repo,
  }).then((response) => {
    console.log(response);
  })
}

const getWorkflowRunLogs = async (octokit, owner, repo, runId) => {
  return await octokit.request('GET /repos/{owner}/{repo}/actions/runs/{run_id}/logs', {
    owner: owner,
    repo: repo,
    run_id: runId
  });
}


module.exports = {

};
