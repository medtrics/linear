import { Command } from "commander"
import { handleError, LinearCLIError, linear, logSuccess } from "../lib"

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
  .action(async (issueId, options) => {
    try {
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
          "NO_UPDATES",
        )
      }

      // Get the issue first to ensure it exists
      const issue = await linear.getIssue(issueId)
      const team = await issue.team

      if (!team) {
        throw new LinearCLIError(
          "Could not find team for this issue",
          "TEAM_NOT_FOUND",
        )
      }

      // Build update params
      const params: Parameters<typeof linear.updateIssue>[1] = {}

      if (options.title) params.title = options.title
      if (options.description) params.description = options.description

      // Process all optional parameters in parallel for better performance
      const [assignee, labelIds, state] = await Promise.all([
        // Find assignee if provided
        options.assignee
          ? options.assignee === "none"
            ? { id: null } // Special case to unassign
            : linear.findUserByEmail(team.id, options.assignee).then((user) => {
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
        options.labels
          ? Promise.all(
              options.labels
                .split(",")
                .map((name: string) => name.trim())
                .filter((name: string) => name) // Remove empty strings
                .map(async (name: string) => {
                  const label = await linear.findLabelByName(team.id, name)
                  if (!label) {
                    throw new LinearCLIError(
                      `Label "${name}" not found in team`,
                      "LABEL_NOT_FOUND",
                    )
                  }
                  return label.id
                }),
            )
          : null,

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

      // Update the issue
      const updatedIssue = await linear.updateIssue(issueId, params)

      logSuccess(
        `Issue updated: ${updatedIssue.identifier} - ${updatedIssue.title}`,
      )
      console.log(`View at: ${updatedIssue.url}`)
    } catch (error) {
      handleError(error)
    }
  })
