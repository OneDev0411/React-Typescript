export function pickRoles(
  list: Record<string, boolean | undefined>,
  type: boolean
) {
  return Object.entries(list).reduce((acc, [key, value]) => {
    return value === type ? [...acc, key] : acc
  }, [])
}
