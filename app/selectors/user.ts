import { createSelector } from 'reselect'

import { IAppState } from 'reducers'
import { formatPhoneNumber } from 'utils/format'

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
export function selectUser(state: IAppState) {
  const user = selectUserUnsafe(state)

  // TODO: uncomment this later when the ACL issues got fixed
  // if (!user) {
  //   throw new Error(
  //     'This selector must be called when the user is signed in before'
  //   )
  // }

  // return user

  return (user as any) as IUser
}

/**
 * Returns the phone number for the current user
 * @param state The app state
 * @returns The current user phone number
 */
export const selectUserPhoneNumber = (state: IAppState) =>
  selectUser(state).phone_number

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

export const selectUserDisplayName = (state: IAppState) =>
  selectUser(state).display_name

/**
 * Returns the email signature for the current user
 * @param state The app state
 * @returns The email signature for the current user
 */
export const selectUserEmailSignature = (state: IAppState) =>
  selectUser(state).email_signature
