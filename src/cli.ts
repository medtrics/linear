#!/usr/bin/env tsx
import { Command } from "commander"
import { createIssueCommand } from "./commands/create-issue"
import { listIssuesCommand } from "./commands/list-issues"

const program = new Command()
  .name("linear")
  .description("Linear CLI")
  .version("1.0.0")

program.addCommand(listIssuesCommand)
program.addCommand(createIssueCommand)
program.parse()
