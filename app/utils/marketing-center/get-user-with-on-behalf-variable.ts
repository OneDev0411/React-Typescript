/**
 * It returns a normalized version of user based on the purpose of creating
 * the template when the template is gonna be used for other users.
 */

import { getSenderPlaceholders } from './get-sender-placeholders'

export function getUserWithOnBehalfVariable(user: IUser): IUser {
  return {
    ...user,
    ...getSenderPlaceholders()
  }
}
