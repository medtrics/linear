import readline from "node:readline"
import type { Issue } from "@linear/sdk"
import { logDetail, logInfo } from "./output"

/**
 * Prompts user for yes/no confirmation
 * @param message - The question to ask the user
 * @returns true if user types 'y' (case-insensitive), false for any other input
 * @example
 * if (await askConfirmation("Delete issue?")) {
 *   // proceed with deletion
 * }
 */
export function askConfirmation(message: string): Promise<boolean> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  return new Promise((resolve) => {
    rl.question(`${message} (y/N): `, (answer) => {
      rl.close()
      resolve(answer.toLowerCase() === "y")
    })
  })
}

export function showIssueDetails(issue: Issue, action: string) {
  logInfo(`Issue to ${action}:`)
  logDetail("ID", issue.identifier)
  logDetail("Title", issue.title)
  logDetail("URL", issue.url)
}
