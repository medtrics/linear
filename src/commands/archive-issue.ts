import { Command } from "commander"
import {
  askConfirmation,
  linear,
  logNote,
  logSuccess,
  logWarning,
  showIssueDetails,
  withErrorHandling,
} from "../lib"

export const archiveIssueCommand = new Command("archive-issue")
  .description("Archive an issue in Linear (can be restored later)")
  .argument("<issueId>", "Issue ID (e.g., M2-123)")
  .option("-f, --force", "Skip confirmation prompt")
  .action(
    withErrorHandling(async (issueId, options) => {
      // Get the issue first to ensure it exists and show details
      const issue = await linear.getIssueOrThrow(issueId)

      // Show issue details before archiving
      showIssueDetails(issue, "archive")

      // Ask for confirmation unless --force is used
      if (!options.force) {
        const confirmed = await askConfirmation(
          "\nAre you sure you want to archive this issue?",
        )

        if (!confirmed) {
          logWarning("Archive cancelled")
          return
        }
      }

      // Archive the issue
      await linear.archiveIssue(issueId)

      logSuccess(`Issue archived: ${issue.identifier} - ${issue.title}`)
      logNote("The issue can be restored from Linear's archived issues view.")
    }),
  )
