import { Command } from "commander"
import {
  handleError,
  LinearCLIError,
  linear,
  logInfo,
  logSuccess,
  showIssueDetails,
} from "../lib"

export const moveIssueCommand = new Command("move-issue")
  .description("Move an issue to a different state")
  .argument("<issueId>", "Issue ID (e.g., M2-123)")
  .argument("<state>", "Target state (e.g., 'In Progress', 'Done')")
  .action(async (issueId, stateName) => {
    try {
      // Get the issue first to ensure it exists
      const issue = await linear.getIssue(issueId)
      const team = await issue.team

      if (!team) {
        throw new LinearCLIError(
          "Could not find team for this issue",
          "TEAM_NOT_FOUND",
        )
      }

      // Get current state
      const currentState = await issue.state

      // Show current issue details
      showIssueDetails(issue, "move")
      if (currentState) {
        logInfo(`Current state: ${currentState.name}`)
      }

      // Find the target state
      const targetState = await linear.findStateByName(team.id, stateName)
      if (!targetState) {
        throw new LinearCLIError(
          `State "${stateName}" not found in team`,
          "STATE_NOT_FOUND",
        )
      }

      // Check if already in target state
      if (currentState && currentState.id === targetState.id) {
        logInfo(`Issue is already in state: ${targetState.name}`)
        return
      }

      // Move the issue
      const updatedIssue = await linear.updateIssue(issueId, {
        stateId: targetState.id,
      })

      logSuccess(
        `Issue moved from "${currentState?.name || "Unknown"}" to "${targetState.name}"`,
      )
      logInfo(`${updatedIssue.identifier} - ${updatedIssue.title}`)
    } catch (error) {
      handleError(error)
    }
  })
