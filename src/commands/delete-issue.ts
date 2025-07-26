import { Command } from "commander"
import {
  askConfirmation,
  handleError,
  linear,
  log,
  logDanger,
  logDetail,
  logInfo,
  logSuccess,
  logWarning,
} from "../lib"

export const deleteIssueCommand = new Command("delete-issue")
  .description(
    "Permanently delete an issue from Linear (THIS CANNOT BE UNDONE)",
  )
  .argument("<issueId>", "Issue ID (e.g., M2-123)")
  .option("-f, --force", "Skip confirmation prompt")
  .action(async (issueId, options) => {
    try {
      // Get the issue first to ensure it exists and show details
      const issue = await linear.getIssue(issueId)

      // Show issue details before deletion with warnings
      logDanger("PERMANENT DELETION WARNING ⚠️")
      logInfo("Issue to permanently delete:")
      logDetail("ID", issue.identifier)
      logDetail("Title", issue.title)
      logDetail("URL", issue.url)

      // Ask for confirmation unless --force is used
      if (!options.force) {
        logDanger(
          "This action is IRREVERSIBLE. The issue will be permanently deleted.",
        )
        log(
          "Consider using 'archive-issue' instead if you might need to restore it later.",
        )

        const confirmed = await askConfirmation(
          "\nAre you ABSOLUTELY SURE you want to permanently delete this issue?",
        )

        if (!confirmed) {
          logWarning("Deletion cancelled")
          return
        }

        // Double confirmation for permanent deletion
        const doubleConfirmed = await askConfirmation(
          `Type 'y' again to confirm permanent deletion of ${issue.identifier}`,
        )

        if (!doubleConfirmed) {
          logWarning("Deletion cancelled")
          return
        }
      }

      // Permanently delete the issue
      await linear.deleteIssue(issueId)

      logSuccess(
        `Issue permanently deleted: ${issue.identifier} - ${issue.title}`,
      )
      logWarning("This action cannot be undone.")
    } catch (error) {
      handleError(error)
    }
  })
