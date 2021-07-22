import { createSelector } from 'reselect'

import { IAppState } from 'reducers'
import { formatPhoneNumber } from 'utils/format'

import { selectActiveTeamRolesUnsafe } from './team'

/**
 * Returns the entire user info from the redux store.
 * This selector returns null if the user did not signed in before so
 * if you are sure the usage is after the login process you have to use
 * the `@selectUser` instead.
 * @param state The app state
 * @returns The user state
 */
export const selectUserUnsafe = (state: IAppState) => state.user

/**
 * Returns the entire user info from the redux store.
 * It raises an error if the user did not sign in before.
 * @param state The app state
 * @returns The user state
 */
export function selectUser(state: IAppState): IUser {
  const user = selectUserUnsafe(state)!

  // if (!user) {
  //   throw new Error(
  //     'This selector must be called when the user is signed in before'
  //   )
  // }

  return user
}

/**
 * Returns the phone number for the current user
 * @param state The app state
 * @returns The current user phone number
 */
export const selectUserPhoneNumber = (state: IAppState) =>
  selectUser(state)?.phone_number

/**
 * Returns the formatted phone number for the current user
 * @param state The app state
 * @returns The formatted phone number for the current user
 */
export const selectUserFormattedPhoneNumber = createSelector(
  selectUserPhoneNumber,
  phoneNumber => {
    return phoneNumber ? formatPhoneNumber(phoneNumber) : phoneNumber
  }
)

/**
 * Returns the email signature for the current user
 * @param state The app state
 * @returns The email signature for the current user
 */
export const selectUserEmailSignature = (state: IAppState) =>
  selectUser(state)?.email_signature

/**
 * Returns true if the user is signed in otherwise returns false
 * @param state The app state
 */
export const selectUserIsSignedIn = (state: IAppState) =>
  !!selectUserUnsafe(state)?.id

/**
 * Returns the user id
 * @param state The app state
 * @returns The current user id
 */
export const selectUserId = (state: IAppState) => selectUser(state).id

/**
 * Returns the user first name
 * @param state The app state
 * @returns The current user first name
 */
export const selectUserFirstName = (state: IAppState): Nullable<string> =>
  selectUser(state).first_name

/**
 * Returns the user display name
 * @param state The app state
 * @returns The current user display name
 */
export const selectUserDisplayName = (state: IAppState): Nullable<string> =>
  selectUser(state).display_name

/**
 * Returns the user email
 * @param state The app state
 * @returns The current user email
 */
export const selectUserEmail = (state: IAppState): string =>
  selectUser(state).email

/**
 * Returns the user type
 * @param state The app state
 * @returns The current user type
 */
export const selectUserType = (state: IAppState): TUserType =>
  selectUser(state).user_type

/**
 * Returns the user created at
 * @param state The app state
 * @returns The current user created at
 */
export const selectUserCreatedAt = (state: IAppState): number =>
  selectUser(state).created_at

/**
 * Returns the user timezone
 * @param state The app state
 * @returns The current user timezone
 */
export const selectUserTimezone = (state: IAppState) =>
  selectUser(state).timezone

/**
 * Returns the list of user's unique access list
 * @param state The app state
 * @returns current user access list
 */
export const selectUserAccessList = createSelector(
  selectActiveTeamRolesUnsafe,
  activeRoles => {
    if (!activeRoles) {
      return []
    }

    return [...new Set(activeRoles.flatMap(role => role.acl))]
  }
)
