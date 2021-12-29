import { useSelector } from 'react-redux'

import { IAppState } from '@app/reducers'
import { IAttributeDefsState } from '@app/reducers/contacts/attributeDefs'

export function useAttributeDefs() {
  return useSelector<IAppState, IAttributeDefsState>(
    ({ contacts }) => contacts.attributeDefs
  )
}
