import type { Project, Team } from "@linear/sdk"
import { LinearClient } from "@linear/sdk"
import { config } from "./config"
import { LinearCLIError } from "./errors"

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

  async getIssue(id: string) {
    return client.issue(id)
  },

  async getLabels(teamId: string) {
    const team = await client.team(teamId)
    return (await team.labels()).nodes
  },

  async getStates(teamId: string) {
    const team = await client.team(teamId)
    return (await team.states()).nodes
  },

  async createIssue(params: Parameters<typeof client.createIssue>[0]) {
    const result = await client.createIssue(params)
    const issue = await result.issue
    if (!issue) throw new Error("Failed to create issue")
    return issue
  },

  async updateIssue(
    id: string,
    params: Parameters<typeof client.updateIssue>[1],
  ) {
    const result = await client.updateIssue(id, params)
    const issue = await result.issue
    if (!issue) throw new Error("Failed to update issue")
    return issue
  },
}
