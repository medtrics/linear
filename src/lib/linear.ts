import { LinearClient } from "@linear/sdk"
import { config } from "./config"

const client = new LinearClient({
  apiKey: config.linear.apiKey,
})

export const linear = {
  async getIssue(id: string) {
    return client.issue(id)
  },

  async getTeam(id: string) {
    return client.team(id)
  },

  async getProject(id: string) {
    return client.project(id)
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
