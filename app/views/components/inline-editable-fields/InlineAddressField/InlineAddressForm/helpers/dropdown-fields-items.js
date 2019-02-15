import { STREET_PREFIX, STREET_SUFFIX_COLLECTION, STATES } from 'utils/address'

import { normalizeDropdownItems } from './normalize-dropdown-items'

export const PREFIX_ITEMS = normalizeDropdownItems(STREET_PREFIX)
export const SUFFIX_ITEMS = normalizeDropdownItems(STREET_SUFFIX_COLLECTION)
export const STATES_ITEMS = normalizeDropdownItems(STATES)
