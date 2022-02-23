import escapeRegExp from 'lodash/escapeRegExp'

/**
 * returns true if a user matches the search query
 */
export function userMatches(user: IUser, searchTerm: string): boolean {
  const regExp = new RegExp(escapeRegExp(searchTerm), 'gi')

  return !!user.display_name.match(regExp)
}
