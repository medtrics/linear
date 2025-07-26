import type {
  Issue,
  IssueLabel,
  Project,
  Team,
  User,
  WorkflowState,
} from "@linear/sdk"
import { LinearClient } from "@linear/sdk"
import { config } from "./config"
import { ERROR_CODES, LinearCLIError } from "./errors"

const client = new LinearClient({
  apiKey: config.linear.apiKey,
})

// Cache to avoid repeated lookups
const cache = {
  team: null as Team | null,
  project: null as Project | null,
}

export const linear = {
  async getTeamByName(name: string): Promise<Team> {
    if (cache.team) return cache.team

    const teams = await client.teams()
    const team = teams.nodes.find((t) => t.name === name)

    if (!team) {
      throw new LinearCLIError(`Team "${name}" not found`, "TEAM_NOT_FOUND")
    }

    cache.team = team
    return team
  },

  async getProjectByName(name: string): Promise<Project> {
    if (cache.project) return cache.project

    const projects = await client.projects()
    const project = projects.nodes.find((p) => p.name === name)

    if (!project) {
      throw new LinearCLIError(
        `Project "${name}" not found`,
        "PROJECT_NOT_FOUND",
      )
    }

    cache.project = project
    return project
  },

  async getCurrentTeam(): Promise<Team> {
    return this.getTeamByName(config.linear.teamName)
  },

  async getCurrentProject(): Promise<Project> {
    return this.getProjectByName(config.linear.projectName)
  },

  async getIssue(id: string): Promise<Issue | null> {
    return client.issue(id)
  },

  async getLabels(teamId: string): Promise<IssueLabel[]> {
    const team = await client.team(teamId)
    return (await team.labels()).nodes
  },

  async getStates(teamId: string): Promise<WorkflowState[]> {
    const team = await client.team(teamId)
    return (await team.states()).nodes
  },

  async findUserByEmail(
    teamId: string,
    email: string,
  ): Promise<User | undefined> {
    const team = await client.team(teamId)
    const members = await team.members()
    return members.nodes.find((user) => user.email === email)
  },

  async findLabelByName(
    teamId: string,
    name: string,
  ): Promise<IssueLabel | undefined> {
    const labels = await this.getLabels(teamId)
    return labels.find((label) => label.name === name)
  },

  async findStateByName(
    teamId: string,
    name: string,
  ): Promise<WorkflowState | undefined> {
    const states = await this.getStates(teamId)
    return states.find(
      (state) => state.name.toLowerCase() === name.toLowerCase(),
    )
  },

  /**
   * Fetches an issue by ID or throws if not found
   * @param id - Issue identifier (e.g., "M2-123")
   * @returns The issue object
   * @throws {LinearCLIError} with ISSUE_NOT_FOUND if issue doesn't exist
   */
  async getIssueOrThrow(id: string): Promise<Issue> {
    const issue = await this.getIssue(id)
    if (!issue) {
      throw new LinearCLIError(
        `Issue ${id} not found`,
        ERROR_CODES.ISSUE_NOT_FOUND,
      )
    }
    return issue
  },

  async createIssue(
    params: Parameters<typeof client.createIssue>[0],
  ): Promise<Issue> {
    const result = await client.createIssue(params)
    const issue = await result.issue
    if (!issue) {
      throw new LinearCLIError(
        "Failed to create issue. Please check your inputs and permissions.",
        ERROR_CODES.API_ERROR,
      )
    }
    return issue
  },

  async updateIssue(
    id: string,
    params: Parameters<typeof client.updateIssue>[1],
  ): Promise<Issue> {
    const result = await client.updateIssue(id, params)
    const issue = await result.issue
    if (!issue) {
      throw new LinearCLIError(
        "Failed to update issue. Please check your inputs and permissions.",
        ERROR_CODES.API_ERROR,
      )
    }
    return issue
  },

  async archiveIssue(id: string) {
    const result = await client.archiveIssue(id)
    if (!result.success) {
      throw new LinearCLIError(
        "Failed to archive issue. Please check your permissions.",
        ERROR_CODES.API_ERROR,
      )
    }
    return result
  },

  async deleteIssue(id: string) {
    const result = await client.deleteIssue(id)
    if (!result.success) {
      throw new LinearCLIError(
        "Failed to delete issue. Please check your permissions.",
        ERROR_CODES.API_ERROR,
      )
    }
    return result
  },

  /**
   * Converts comma-separated label names to their IDs
   * @param teamId - The team ID to search for labels
   * @param labelString - Comma-separated label names (e.g., "bug,feature")
   * @returns Array of label IDs
   * @throws {LinearCLIError} with LABEL_NOT_FOUND if any label doesn't exist
   * @example
   * // Returns ["label-id-1", "label-id-2"]
   * await linear.parseLabelIds("team-123", "bug, feature")
   */
  async parseLabelIds(teamId: string, labelString: string): Promise<string[]> {
    const labelNames = labelString
      .split(",")
      .map((name) => name.trim())
      .filter((name) => name) // Remove empty strings

    const labelIds = await Promise.all(
      labelNames.map(async (name) => {
        const label = await this.findLabelByName(teamId, name)
        if (!label) {
          throw new LinearCLIError(
            `Label "${name}" not found in team`,
            ERROR_CODES.LABEL_NOT_FOUND,
          )
        }
        return label.id
      }),
    )

    return labelIds
  },
}
