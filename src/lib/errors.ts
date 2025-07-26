export class LinearCLIError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly cause?: Error,
  ) {
    super(message)
    this.name = "LinearCLIError"
  }
}

export function handleError(error: unknown): never {
  if (error instanceof LinearCLIError) {
    console.error(`Error [${error.code}]: ${error.message}`)
    if (error.cause) {
      console.error("Caused by:", error.cause.message)
    }
  } else if (error instanceof Error) {
    console.error("Error:", error.message)
  } else {
    console.error("An unexpected error occurred")
  }

  process.exit(1)
}

export function assertConfig(
  value: string | undefined,
  name: string,
): asserts value is string {
  if (!value) {
    throw new LinearCLIError(
      `Missing environment variable: ${name}`,
      "CONFIG_MISSING",
    )
  }
}
