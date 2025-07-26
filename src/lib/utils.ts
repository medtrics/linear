import { LinearCLIError } from "./errors"
import { linear } from "./linear"

export async function parseLabelIds(
  teamId: string,
  labelString: string,
): Promise<string[]> {
  const labelNames = labelString
    .split(",")
    .map((name) => name.trim())
    .filter((name) => name) // Remove empty strings

  const labelIds = await Promise.all(
    labelNames.map(async (name) => {
      const label = await linear.findLabelByName(teamId, name)
      if (!label) {
        throw new LinearCLIError(
          `Label "${name}" not found in team`,
          "LABEL_NOT_FOUND",
        )
      }
      return label.id
    }),
  )

  return labelIds
}
