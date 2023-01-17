const fs = require('fs');

const retrieveLogs = async (octokit, githubContext, workflowName) => {
  // get list of workflow runs
  getWorkflowRuns(octokit, githubContext.repo.owner, githubContext.repo.repo, workflowName);
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
    // get url element of response and download the file
    console.log(response.url);
    downloadFile(response.url);
  });
};

// write a function that print the files in a folder
const printFiles = (folder) => {
  console.log('printFile of folder : ', folder);
  // Get current directory full path
  console.log(`directory : ${ process.cwd()}, ${__dirname}`);
  fs.readdir(folder, (err, files) => {
    files.forEach((file) => {
      console.log(file);
    });
  });
};

// Write a function that execute a command
const executeCommand = (command) => {
  const exec = require('child_process').execSync;
  console.log('Will execute command : ', command);
  exec(command, {stdio: 'inherit'}, (error, stdout, stderr) => {
    if (error) {
      console.log(`error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.log(`stderr: ${stderr}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
  });
};

// Write a function that download a file from a url
const downloadFile = (url) => {
  // const extractEntryTo = `/home/runner/work/_actions/Superbasil3/retrieve-workflow-logs-action/`;
  const outputDir = `/home/runner/work/_actions/Superbasil3/retrieve-workflow-logs-action/`;
  // const zipFile = outputDir + 'master.zip';
  // create empty filein current directory
  // fs.mkdirSync(outputDir);
  fs.closeSync(fs.openSync('/home/runner/work/_actions/Superbasil3/retrieve-workflow-logs-action/toto.txt', 'w'));
  printFiles(outputDir);
  executeCommand(`curl --version`);
  executeCommand(`curl -h`);
  executeCommand(`curl -L "${url}" > master.zip `);
  printFiles(outputDir);
  executeCommand('unzip -o master.zip');
  executeCommand('ls -la');
  executeCommand('pwd');
  executeCommand('ls -la');
};

module.exports = {
  getWorkflowRuns,
  getWorkflowRunLogs,
  retrieveLogs,
};
