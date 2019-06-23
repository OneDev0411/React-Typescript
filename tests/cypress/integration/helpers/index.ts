export const waitForPage = (url: string, timeout = 60000) => {
  cy.location('pathname', { timeout }).should('include', url)
}

export const getTestSelector = (name: string | string[]) => {
  return ([] as string[])
    .concat(name)
    .map(item => `[data-test="${item}"]`)
    .join(' ')
}

export const getFirstChildOfTestSelector = (name: string) =>
  `${getTestSelector(name)} *:first-child`

export const waitForRemove = (
  selector: string,
  timeout: number = 5000,
  interval: number = 500
) => {
  let remainingTimeout = timeout

  while (remainingTimeout >= 0) {
    try {
      cy.get(selector).should('not.exist')
    } catch (err) {
      if (remainingTimeout < 0) {
        throw err
      }

      cy.wait(interval)
    }
  }

  throw new Error(`${selector} still exists`)
}
