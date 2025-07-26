import readline from "node:readline"
import { logDetail, logInfo } from "./output"

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

interface Issue {
  identifier: string
  title: string
  url: string
}

export function showIssueDetails(issue: Issue, action: string) {
  logInfo(`Issue to ${action}:`)
  logDetail("ID", issue.identifier)
  logDetail("Title", issue.title)
  logDetail("URL", issue.url)
}
