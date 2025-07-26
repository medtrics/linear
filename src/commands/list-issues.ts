import { Command } from "commander"
import { createTable, handleError, linear, log, logInfo } from "../lib"

export const listIssuesCommand = new Command("list-issues")
  .description("List all issues from the Linear project")
  .action(async () => {
    try {
      const project = await linear.getCurrentProject()

      // Fetch issues with all related data in a single query
      const issues = await project.issues({
        includeArchived: false,
      })

      const table = createTable([
        { header: "ID", width: 10 },
        { header: "Title", width: 40 },
        { header: "State", width: 15 },
        { header: "Labels", width: 15 },
        { header: "Assignee", width: 20 },
      ])

      // Process all issues in parallel for better performance
      const rows = await Promise.all(
        issues.nodes.map(async (issue) => {
          const [state, assignee, labels] = await Promise.all([
            issue.state,
            issue.assignee,
            issue.labels(),
          ])

          // Format labels as comma-separated list
          const labelNames =
            labels.nodes.map((label) => label.name).join(", ") || "-"

          return [
            issue.identifier,
            issue.title,
            state?.name || "Unknown",
            labelNames,
            assignee?.name || "Unassigned",
          ]
        }),
      )

      rows.forEach((row) => table.push(row))

      logInfo(`Project: ${project.name} - ${issues.nodes.length} issues`)
      log(table.toString())
    } catch (error) {
      handleError(error)
    }
  })
