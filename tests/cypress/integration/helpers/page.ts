export function getTestSelector(name: string | string[]) {
  return ([] as string[])
    .concat(name)
    .map(item => `[data-test="${item}"]`)
    .join(' ')
}

export function getFirstChildOfTestSelector(name: string) {
  return `${getTestSelector(name)} *:first-child`
}

export function expandShowMoreLess(parentDataTest: string) {
  return cy
    .get(
      `${getTestSelector(parentDataTest)} ${getTestSelector(
        'show-more-button'
      )}`
    )
    .click()
}
