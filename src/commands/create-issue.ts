import { Command } from "commander"
import {
  linear,
  logSuccess,
  logUrl,
  parseIssueOptions,
  withErrorHandling,
} from "../lib"

export const createIssueCommand = new Command("create-issue")
  .description("Create a new issue in Linear")
  .requiredOption("-t, --title <title>", "Issue title")
  .option("-d, --description <description>", "Issue description")
  .option("-a, --assignee <email>", "Assignee email")
  .option("-l, --labels <labels>", "Comma-separated list of label names")
  .option("-s, --state <state>", "Initial state (e.g., Backlog, Todo)")
  .action(
    withErrorHandling(async (options) => {
      const team = await linear.getCurrentTeam()
      const project = await linear.getCurrentProject()

      // Build issue creation params
      const params: Parameters<typeof linear.createIssue>[0] = {
        title: options.title,
        description: options.description,
        teamId: team.id,
        projectId: project.id,
      }

      // Process all optional parameters in parallel
      const { assignee, labelIds, state } = await parseIssueOptions(
        team.id,
        options,
      )

      // Apply the found values to params
      if (assignee) params.assigneeId = assignee.id
      if (labelIds) params.labelIds = labelIds
      if (state) params.stateId = state.id

      // Create the issue
      const issue = await linear.createIssue(params)

      logSuccess(`Issue created: ${issue.identifier} - ${issue.title}`)
      logUrl("View at", issue.url)
    }),
  )
