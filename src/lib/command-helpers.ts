import type { User, WorkflowState } from "@linear/sdk"
import { ERROR_CODES, handleError, LinearCLIError } from "./errors"
import { linear } from "./linear"

/**
 * Parses the assignee option and returns the appropriate user or null
 * @param teamId - The team ID to search for the user
 * @param assigneeInput - The assignee email or "none" to unassign
 * @returns The user object, null for unassign, or undefined for no change
 */
export async function parseAssignee(
  teamId: string,
  assigneeInput?: string,
): Promise<User | { id: null } | null> {
  if (!assigneeInput) return null

  if (assigneeInput === "none") {
    return { id: null }
  }

  const user = await linear.findUserByEmail(teamId, assigneeInput)
  if (!user) {
    throw new LinearCLIError(
      `User with email "${assigneeInput}" not found in team`,
      ERROR_CODES.USER_NOT_FOUND,
    )
  }

  return user
}

/**
 * Parses the state option and returns the appropriate workflow state
 * @param teamId - The team ID to search for the state
 * @param stateName - The name of the state
 * @returns The workflow state object or null if not provided
 */
export async function parseState(
  teamId: string,
  stateName?: string,
): Promise<WorkflowState | null> {
  if (!stateName) return null

  const state = await linear.findStateByName(teamId, stateName)
  if (!state) {
    throw new LinearCLIError(
      `State "${stateName}" not found in team`,
      ERROR_CODES.STATE_NOT_FOUND,
    )
  }

  return state
}

/**
 * Parses issue options in parallel for better performance
 * @param teamId - The team ID for lookups
 * @param options - The options to parse
 * @returns Parsed assignee, labels, and state
 */
export async function parseIssueOptions(
  teamId: string,
  options: {
    assignee?: string
    labels?: string
    state?: string
  },
) {
  const [assignee, labelIds, state] = await Promise.all([
    parseAssignee(teamId, options.assignee),
    options.labels ? linear.parseLabelIds(teamId, options.labels) : null,
    parseState(teamId, options.state),
  ])

  return { assignee, labelIds, state }
}

/**
 * Wraps a command action with error handling
 * @param action - The async action to wrap
 * @returns The wrapped action
 */
export function withErrorHandling<T extends unknown[]>(
  action: (...args: T) => Promise<void>,
): (...args: T) => Promise<void> {
  return async (...args: T) => {
    try {
      await action(...args)
    } catch (error) {
      handleError(error)
    }
  }
}
