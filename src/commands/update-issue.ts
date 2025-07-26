import { Command } from "commander"
import {
  ERROR_CODES,
  LinearCLIError,
  linear,
  logSuccess,
  logUrl,
  parseIssueOptions,
  withErrorHandling,
} from "../lib"

export const updateIssueCommand = new Command("update-issue")
  .description("Update an existing issue in Linear")
  .argument("<issueId>", "Issue ID (e.g., M2-123)")
  .option("-t, --title <title>", "New issue title")
  .option("-d, --description <description>", "New issue description")
  .option(
    "-a, --assignee <email>",
    "New assignee email (use 'none' to unassign)",
  )
  .option(
    "-l, --labels <labels>",
    "New comma-separated list of label names (replaces existing)",
  )
  .option("-s, --state <state>", "New state (e.g., In Progress, Done)")
  .action(
    withErrorHandling(async (issueId, options) => {
      // Validate that at least one update option is provided
      const hasUpdates =
        options.title ||
        options.description ||
        options.assignee ||
        options.labels ||
        options.state
      if (!hasUpdates) {
        throw new LinearCLIError(
          "No updates provided. Use at least one option to update the issue",
          ERROR_CODES.NO_UPDATES,
        )
      }

      // Get the issue first to ensure it exists
      const issue = await linear.getIssueOrThrow(issueId)
      const team = await issue.team

      if (!team) {
        throw new LinearCLIError(
          "Could not find team for this issue",
          ERROR_CODES.TEAM_NOT_FOUND,
        )
      }

      // Build update params
      const params: Parameters<typeof linear.updateIssue>[1] = {}

      if (options.title) params.title = options.title
      if (options.description) params.description = options.description

      // Process all optional parameters in parallel
      const { assignee, labelIds, state } = await parseIssueOptions(
        team.id,
        options,
      )

      // Apply the found values to params
      if (assignee) params.assigneeId = assignee.id
      if (labelIds) params.labelIds = labelIds
      if (state) params.stateId = state.id

      // Update the issue
      const updatedIssue = await linear.updateIssue(issueId, params)

      logSuccess(
        `Issue updated: ${updatedIssue.identifier} - ${updatedIssue.title}`,
      )
      logUrl("View at", updatedIssue.url)
    }),
  )
