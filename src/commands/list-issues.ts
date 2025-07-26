import { Command } from "commander"
import { config, createTable, handleError, linear, logInfo } from "../lib"

export const listIssuesCommand = new Command("list-issues")
  .description("List all issues from the Linear project")
  .action(async () => {
    try {
      const project = await linear.getProject(config.linear.projectId)
      const issues = await project.issues()

      const table = createTable([
        { header: "ID", width: 10 },
        { header: "Title", width: 50 },
        { header: "State", width: 15 },
        { header: "Assignee", width: 20 },
      ])

      for (const issue of issues.nodes) {
        const state = await issue.state
        const assignee = await issue.assignee

        table.push([
          issue.identifier,
          issue.title,
          state?.name || "Unknown",
          assignee?.name || "Unassigned",
        ])
      }

      logInfo(`Project: ${project.name} - ${issues.nodes.length} issues`)
      console.log(table.toString())
    } catch (error) {
      handleError(error)
    }
  })
