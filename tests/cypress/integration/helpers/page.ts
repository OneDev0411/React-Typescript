/**
 *
 * @param url
 * @param timeout
 */
export const waitForPage = (url: string, timeout = 60000) => {
  cy.location('pathname', { timeout }).should('include', url)
}

/**
 *
 * @param name
 */
export const getTestSelector = (name: string | string[]) => {
  return ([] as string[])
    .concat(name)
    .map(item => `[data-test="${item}"]`)
    .join(' ')
}

/**
 *
 * @param name
 */
export const getFirstChildOfTestSelector = name =>
  `${getTestSelector(name)} *:first-child`
