#!/usr/bin/env node
import { Command } from "commander"
import { archiveIssueCommand } from "./commands/archive-issue"
import { createIssueCommand } from "./commands/create-issue"
import { deleteIssueCommand } from "./commands/delete-issue"
import { listIssuesCommand } from "./commands/list-issues"
import { moveIssueCommand } from "./commands/move-issue"
import { updateIssueCommand } from "./commands/update-issue"

const program = new Command()
  .name("linear")
  .description("Linear CLI")
  .version(process.env.npm_package_version || "0.1.0")

program.addCommand(listIssuesCommand)
program.addCommand(createIssueCommand)
program.addCommand(updateIssueCommand)
program.addCommand(moveIssueCommand)
program.addCommand(archiveIssueCommand)
program.addCommand(deleteIssueCommand)
program.parse()
