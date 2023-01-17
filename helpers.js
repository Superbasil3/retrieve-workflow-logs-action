const fs = require('fs');
const path = require('path');


/**
 * @param {Octokit} octokit
 * @param {Object} githubContext
 * @param {string} pathLogs
 * @param {boolean} keepOnlyErrorFiles
 * @return {Promise<void>}
 */
const retrieveLogs = async (octokit, githubContext, pathLogs, keepOnlyErrorFiles) => {
  await octokit.request(`GET ${githubContext.payload.workflow_run.logs_url}`, {}).then((response) => {
    downloadFile(response.url, pathLogs, githubContext.runNumber + '.zip');
  });
  await getJobs(octokit, githubContext.payload.workflow_run.jobs_url, pathLogs, keepOnlyErrorFiles);
  executeCommand(`ls -al ${pathLogs}`);
};


/**
 * @param {Octokit} octokit
 * @param {string} jobsUrl
 * @param {string} pathLogs
 * @param {boolean} keepOnlyErrorFiles
 * @return {Promise<void>}
 */
const getJobs = async (octokit, jobsUrl, pathLogs, keepOnlyErrorFiles) => {
  const jobs = await octokit.request(`GET ${jobsUrl}`, {
  }).then((response) => {
    console.log('response getJobs: ', response.data.jobs);
    return response.data.jobs;
  });
  if (keepOnlyErrorFiles) {
    console.log('Removing all files but error files');
    removeAllFileButErrorFiles(pathLogs, jobs);
  }
};


/**
 * Jobs and steps has conclusion property, which can be success, failure, cancelled, skipped, timed_out, or action_required.
 *   We want to keep only the logs of the failed jobs and steps.
 *   In the archive we have a folder for each job, and inside files for each step
 *      -> we keep only the files of the failed steps, and move them into the folder ${pathLogs}.
 *   In the top folder, we also have a file for each job. --> We remove them
 * @param {string} pathLogs
 * @param {Object[]} jobs
 */
const removeAllFileButErrorFiles = (pathLogs, jobs) => {
  removeFileFromFolder(pathLogs);
  // We loop through the jobs and steps, and we delete the steps that are not is failure status, and move into the top folder the files of the failed steps
  jobs.forEach((job) => {
    const jobStepsFilePath = path.join(pathLogs, job.name);
    job.steps.forEach((step) => {
      const stepFiles = fs.readdirSync(jobStepsFilePath);
      // Get the file for the steps, based that his name start with his step number : 1_ , 2_ , 3_ ...
      const regex = new RegExp(`^${step.number}_.*`);
      const matchingFiles = stepFiles.filter((file) => {
        return regex.test(file);
      });
      // Delete all the files that are matching the regex
      matchingFiles.forEach((file) => {
        const absolutePath = path.join(jobStepsFilePath, file);
        if (step.conclusion !== 'failure') {
          console.log(`Deleting file ${absolutePath}`);
          fs.unlinkSync(absolutePath);
        }
      });
    });
  });
  // list all file in folder, and subfolder
  executeCommand(`find ${pathLogs} -type f -maxdepth 2`);
};


/**
 * We remove the files from the folder
 * @param {string} pathLogs
 */
const removeFileFromFolder = (pathLogs) => {
  const files = fs.readdirSync(pathLogs);
  files.forEach((file) => {
    const absolutePath = path.join(pathLogs, file);
    if (fs.lstatSync(absolutePath).isFile()) {
      console.log(`Deleting file ${absolutePath}`);
      fs.unlinkSync(absolutePath);
    }
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
 * @param {string} folderName
 */
const createFolderIfNotExist = (folderName) => {
  executeCommand(`mkdir -p ${folderName}`);
};


/**
 * @param {string} url
 * @param {string} fileName
 */
const downloadFromUrl = (url, fileName) => {
  executeCommand(`curl -L "${url}" > ${fileName}`);
};


/**
 * Use unzip to extract the archive into the folder
 * @param {string} archiveNameWithPath
 * @param {string} folderName
 */
const unzipArchiveIntoFolder = (archiveNameWithPath, folderName) => {
  executeCommand(`unzip -o ${archiveNameWithPath} -d ${folderName}`);
};


/**
 * @param {string} fileName
 */
const removeFile = (fileName) => {
  executeCommand(`rm -f ${fileName}`);
};


/**
 * @param {string} url
 * @param {string} folderName
 * @param {string} archiveName
 */
const downloadFile = (url, folderName, archiveName) => {
  const archiveNameWithPath = `${folderName}/${archiveName}`;
  createFolderIfNotExist(folderName);
  downloadFromUrl(url, archiveNameWithPath);
  unzipArchiveIntoFolder(archiveNameWithPath, folderName);
  removeFile(archiveNameWithPath);
};

module.exports = {
  retrieveLogs,
};
