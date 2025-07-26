import { Command } from "commander"
import {
  handleError,
  LinearCLIError,
  linear,
  logSuccess,
  logUrl,
  parseLabelIds,
} from "../lib"

export const createIssueCommand = new Command("create-issue")
  .description("Create a new issue in Linear")
  .requiredOption("-t, --title <title>", "Issue title")
  .option("-d, --description <description>", "Issue description")
  .option("-a, --assignee <email>", "Assignee email")
  .option("-l, --labels <labels>", "Comma-separated list of label names")
  .option("-s, --state <state>", "Initial state (e.g., Backlog, Todo)")
  .action(async (options) => {
    try {
      const team = await linear.getCurrentTeam()
      const project = await linear.getCurrentProject()

      // Build issue creation params
      const params: Parameters<typeof linear.createIssue>[0] = {
        title: options.title,
        description: options.description,
        teamId: team.id,
        projectId: project.id,
      }

      // Process all optional parameters in parallel for better performance
      const [assignee, labelIds, state] = await Promise.all([
        // Find assignee if provided
        options.assignee
          ? linear.findUserByEmail(team.id, options.assignee).then((user) => {
              if (!user) {
                throw new LinearCLIError(
                  `User with email "${options.assignee}" not found in team`,
                  "USER_NOT_FOUND",
                )
              }
              return user
            })
          : null,

        // Find labels if provided
        options.labels ? parseLabelIds(team.id, options.labels) : null,

        // Find state if provided
        options.state
          ? linear.findStateByName(team.id, options.state).then((state) => {
              if (!state) {
                throw new LinearCLIError(
                  `State "${options.state}" not found in team`,
                  "STATE_NOT_FOUND",
                )
              }
              return state
            })
          : null,
      ])

      // Apply the found values to params
      if (assignee) params.assigneeId = assignee.id
      if (labelIds) params.labelIds = labelIds
      if (state) params.stateId = state.id

      // Create the issue
      const issue = await linear.createIssue(params)

      logSuccess(`Issue created: ${issue.identifier} - ${issue.title}`)
      logUrl("View at", issue.url)
    } catch (error) {
      handleError(error)
    }
  })
