import { onlyUnique, sortAlphabetically } from 'utils/helpers'

export function getMediums(templates) {
  return templates
    .map(t => t.medium)
    .filter(onlyUnique)
    .sort(sortAlphabetically)
    .reverse()
}

export function getTabName(medium, tabs) {
  if (medium && tabs.includes(medium)) {
    return medium
  }

  return tabs[0]
}
