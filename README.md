# Retrieve-workflow-logs Action

This action is analysing a log file againt a json list of regexes to match potential recurrent build failures.

## Inputs

## `path-log-file`

**Not Required**  Where the logs will be downloaded, default in the ./workflow-logs folder

## `github-token`

**Required** GitHub token with permission to read. Default `none`.

## Outputs

## `NONE`

## Example usage
```yaml
uses: actions/retrieve-workflow-logs-action@v0.1
with:
  who-to-greet: 'Mona the Octocat'
```
