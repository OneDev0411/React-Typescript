import { IAppState } from 'reducers'
import { selectTags } from 'reducers/contacts/tags'

/**
 * Returns the entire stored contact list.
 * @param state The app state
 * @returns The stored contact list
 */
export const selectContactListStore = (state: IAppState) => state.contacts.list

/**
 * Returns the existing tags
 * @param state The app state
 * @returns The existing tags
 */
export const selectExistingTags = (state: IAppState) =>
  selectTags(state.contacts.tags)
