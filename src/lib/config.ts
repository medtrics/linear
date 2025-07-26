import { config as loadEnv } from "dotenv"
import { assertConfig } from "./errors"

// Load environment variables
loadEnv({ path: ".env.local" })

const apiKey = process.env.LINEAR_API_KEY
const teamName = process.env.LINEAR_TEAM_NAME
const projectName = process.env.LINEAR_PROJECT_NAME

assertConfig(apiKey, "LINEAR_API_KEY")
assertConfig(teamName, "LINEAR_TEAM_NAME")
assertConfig(projectName, "LINEAR_PROJECT_NAME")

export const config = {
  linear: {
    apiKey,
    teamName,
    projectName,
  },
} as const
