import { config as loadEnv } from "dotenv"
import { assertConfig } from "./errors"

loadEnv({ path: ".env.local" })

const apiKey = process.env.LINEAR_API_KEY
const teamId = process.env.LINEAR_TEAM_ID
const projectId = process.env.LINEAR_PROJECT_ID

assertConfig(apiKey, "LINEAR_API_KEY")
assertConfig(teamId, "LINEAR_TEAM_ID")
assertConfig(projectId, "LINEAR_PROJECT_ID")

export const config = {
  linear: {
    apiKey,
    teamId,
    projectId,
  },
} as const
