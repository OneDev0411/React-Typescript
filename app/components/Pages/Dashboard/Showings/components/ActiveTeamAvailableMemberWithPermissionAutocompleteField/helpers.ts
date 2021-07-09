import { ActiveTeamMemberOption } from './types'

export function compareLabels(
  a: ActiveTeamMemberOption,
  b: ActiveTeamMemberOption
): number {
  const aLabel = a.label.toLowerCase()
  const bLabel = b.label.toLowerCase()

  if (aLabel < bLabel) {
    return -1
  }

  if (aLabel > bLabel) {
    return 1
  }

  return 0
}
