export const getTestSelector = (name: string | string[]) => {
  return ([] as string[])
    .concat(name)
    .map(item => `[data-test="${item}"]`)
    .join(' ')
}

export const getFirstChildOfTestSelector = (name: string) =>
  `${getTestSelector(name)} *:first-child`
