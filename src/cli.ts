#!/usr/bin/env tsx
import { Command } from "commander"
import { archiveIssueCommand } from "./commands/archive-issue"
import { createIssueCommand } from "./commands/create-issue"
import { deleteIssueCommand } from "./commands/delete-issue"
import { listIssuesCommand } from "./commands/list-issues"
import { updateIssueCommand } from "./commands/update-issue"

const program = new Command()
  .name("linear")
  .description("Linear CLI")
  .version("1.0.0")

program.addCommand(listIssuesCommand)
program.addCommand(createIssueCommand)
program.addCommand(updateIssueCommand)
program.addCommand(archiveIssueCommand)
program.addCommand(deleteIssueCommand)
program.parse()
