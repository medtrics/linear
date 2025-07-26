import { logError } from "./output"

export const ERROR_CODES = {
  CONFIG_MISSING: "CONFIG_MISSING",
  TEAM_NOT_FOUND: "TEAM_NOT_FOUND",
  PROJECT_NOT_FOUND: "PROJECT_NOT_FOUND",
  ISSUE_NOT_FOUND: "ISSUE_NOT_FOUND",
  USER_NOT_FOUND: "USER_NOT_FOUND",
  STATE_NOT_FOUND: "STATE_NOT_FOUND",
  LABEL_NOT_FOUND: "LABEL_NOT_FOUND",
  NO_UPDATES: "NO_UPDATES",
  INVALID_INPUT: "INVALID_INPUT",
  API_ERROR: "API_ERROR",
} as const

export type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES]

/**
 * Custom error class for Linear CLI operations
 * @param message - Human-readable error message
 * @param code - Error code from ERROR_CODES constant
 * @param cause - Optional underlying error
 * @example
 * throw new LinearCLIError(
 *   "Team not found",
 *   ERROR_CODES.TEAM_NOT_FOUND
 * )
 */
export class LinearCLIError extends Error {
  constructor(
    message: string,
    public readonly code: ErrorCode,
    public readonly cause?: Error,
  ) {
    super(message)
    this.name = "LinearCLIError"
  }
}

/**
 * Handles errors and terminates the process
 * @param error - Any error to handle
 * @returns Never returns - calls process.exit(1)
 */
export function handleError(error: unknown): never {
  if (error instanceof LinearCLIError) {
    logError(`[${error.code}]: ${error.message}`)
    if (error.cause instanceof Error) {
      logError(`Caused by: ${error.cause.message}`)
    }
  } else if (error instanceof Error) {
    logError(error.message)
  } else {
    logError("An unexpected error occurred")
  }

  process.exit(1)
}

/**
 * Asserts that a configuration value exists
 * @param value - The value to check
 * @param name - The name of the configuration variable
 * @throws {LinearCLIError} with CONFIG_MISSING if value is undefined
 */
export function assertConfig(
  value: string | undefined,
  name: string,
): asserts value is string {
  if (!value) {
    throw new LinearCLIError(
      `Missing environment variable: ${name}`,
      ERROR_CODES.CONFIG_MISSING,
    )
  }
}
