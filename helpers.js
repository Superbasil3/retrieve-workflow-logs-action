/**
 * @param {Octokit} octokit
 * @param {Object} githubContext
 * @param {string} workflowName
 * @param {string} pathLogs
 * @return {Promise<void>}
 */
const retrieveLogs = async (octokit, githubContext, workflowName, pathLogs) => {
  getWorkflowRuns(octokit, githubContext.repo.owner, githubContext.repo.repo, workflowName, pathLogs);


  console.debug('pull_requests : ', githubContext.payload.workflow_run.pull_requests);
  octokit.request(`GET ${githubContext.payload.workflow_run.logs_url}`, {
  }).then((response) => {
    console.debug('response retrieveLogs: ', response);
    downloadFile(response.url, pathLogs, `test.zip`);
  });

  listPr = githubContext.payload.workflow_run.pull_requests;

  const jobs = await octokit.request(`GET ${githubContext.payload.workflow_run.jobs_url}`, {
  }).then((response) => {
    return response.data.jobs;
  });
  console.log('jobs: ', jobs);

  // get pr number to add comment
  const prNumber = githubContext.payload.workflow_run.pull_requests[0].number;
  console.log('prNumber: ', prNumber);
  // add comment on pr
  octokit.issues.createComment({
    owner: githubContext.repo.owner,
    repo: githubContext.repo.repo,
    issue_number: prNumber,
    body: 'Hello World',
  });

  octokit.request(`GET ${githubContext.payload.workflow_run.url}`, {
  }).then((response) => {
    console.debug('URL info : ', response);
  });

  octokit.request(`GET ${githubContext.payload.workflow_run.workflow_url}`, {
  }).then((response) => {
    console.debug('workflow_url info : ', response);
  });
};

/**
 * @param {Octokit} octokit
 * @param {string} owner
 * @param {string} repo
 * @param {string} workflowName
 * @param {string} pathLogs
 * @return {Promise<*>}
 */
const getWorkflowRuns = async (octokit, owner, repo, workflowName, pathLogs) => {
  return await octokit.request('GET /repos/{owner}/{repo}/actions/runs{?actor,branch,event,status,per_page,page,created,exclude_pull_requests,check_suite_id,head_sha}', {
    owner: owner,
    repo: repo,
  }).then((response) => {
    console.debug('response getWorkflowRuns: ', response);
    const lastWorkflowRunFailed = response.data.workflow_runs.find((workflowRun) => workflowRun.status === 'completed' && workflowRun.conclusion === 'failure');
    console.log('response failed: ', lastWorkflowRunFailed);
    getJobs(octokit, owner, repo, lastWorkflowRunFailed.id);
    const lastWorkflowRun = response.data.workflow_runs.filter((run) => run.name === workflowName).sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0];
    getWorkflowRunLogs(octokit, owner, repo, lastWorkflowRun.id, pathLogs);
  });
};


// function to get the jobs
const getJobs = async (octokit, owner, repo, runId) => {
  return await octokit.request('GET /repos/{owner}/{repo}/actions/runs/{run_id}/jobs', {
    owner: owner,
    repo: repo,
    run_id: runId,
  }).then((response) => {
    console.debug('response getJobs: ', response);
  });
};


/**
 * @param {Octokit} octokit
 * @param {string} owner
 * @param {string} repo
 * @param {string} runId
 * @param {string} pathLogs
 * @return {Promise<*>}
 */
const getWorkflowRunLogs = async (octokit, owner, repo, runId, pathLogs) => {
  return await octokit.request('GET /repos/{owner}/{repo}/actions/runs/{run_id}/logs', {
    owner: owner,
    repo: repo,
    run_id: runId,
  }).then((response) => {
    downloadFile(response.url, pathLogs, `${runId}.zip`);
  });
};

/**
 * @param {string} command
 */
const executeCommand = (command) => {
  const execSync = require('child_process').execSync;
  console.debug('Will execute command : ', command);
  // get current working directory
  execSync(command, {stdio: 'inherit'}, (error, stdout, stderr) => {
    if (error) {
      console.error(`error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`stderr: ${stderr}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
  });
};

/**
 * @param {string} url
 * @param {string} folderName
 * @param {string} archiveName
 */
const downloadFile = (url, folderName, archiveName) => {
  const archiveNameWithPath = `${folderName}/${archiveName}`;
  executeCommand(`mkdir -p ${folderName}`);
  executeCommand(`curl -L "${url}" > ${archiveNameWithPath}`);
  executeCommand(`unzip -o ${archiveNameWithPath} -d ${folderName}`);
  executeCommand(`rm -f ${archiveNameWithPath}`);
};


module.exports = {
  retrieveLogs,
};
