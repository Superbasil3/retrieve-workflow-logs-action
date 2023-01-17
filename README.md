# Retrieve-workflow-logs Action

This action is used to retrieve the logs of the workflow that has triggered it.
It works for jobs triggers by the `  workflow_run` event.

## Inputs

## `github-token`

**Required** GitHub token with permission to read (default permission is enough). Default `none`.

## `path-logs`

**Not Required**  Where the logs will be left, default to : process.cwd() + '/logs'
* Make sure the folder where you want the file is not deleted between steps

## `keep-only-error-files`
**Not Required**  If you want to keep only the error files (steps that failed), default to : true

## Outputs

## `path-logs` The value from the input path-logs, or the default one

## Example usage
```yaml
name: retrieve-logs 
on:
  workflow_run:  # Triggered when a workflow is triggered
    workflows: ["pr-validation"] # The workflow that triggers this one, can be multiple
    types:
      - completed # The logs are available only when the workflow is completed

jobs:
  retrive_workflow_logs:
    runs-on: ubuntu-latest
    name: retrieve_logs
    steps:
      - name: retrieve_workflow_logs_action
        id: retrieve_workflow_logs_action
        uses: Superbasil3/retrieve-workflow-logs-action@draft
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
          keep-only-error-files: true
```
