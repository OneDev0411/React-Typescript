import React, { useState } from 'react'
// import { useSelector } from 'react-redux'
// import intersectionBy from 'lodash/intersectionBy'

// import useEffectOnce from 'react-use/lib/useEffectOnce'

// import { getContactAttribute } from 'models/contacts/helpers'
// import { selectDefinitionByName } from 'reducers/contacts/attributeDefs'
// import { selectContact } from 'reducers/contacts/list'

// import { IAppState } from 'reducers'

import {
  BaseTagSelector,
  Props as BaseTagSelectorProps
} from './BaseTagSelector'
import { SelectorOption } from '../type'

export interface Props extends BaseTagSelectorProps {
  contact?: IContact
  selectedContactsIds?: UUID[]
}

export const BaseContactTagSelector = ({
  selectedContactsIds = [],
  contact,
  value = [],
  ...props
}: Props) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [currentTags, setCurrentTags] = useState<SelectorOption[]>(value)
  // const { attributeDefs, contactListStore } = useSelector(
  //   (store: IAppState) => {
  //     const { attributeDefs, list: contactListStore } = store.contacts

  //     return {
  //       attributeDefs,
  //       contactListStore
  //     }
  //   }
  // )

  // useEffectOnce(() => {
  //   const attribute_def = selectDefinitionByName(attributeDefs, 'tag')

  //   if (selectedContactsIds.length === 0 || !attribute_def) {
  //     return
  //   }

  //   const contactsTags = selectedContactsIds.map(contactId => {
  //     const contactObject =
  //       contact && contact.id === contactId
  //         ? contact
  //         : selectContact(contactListStore, contactId)

  //     if (contactObject) {
  //       return getContactAttribute(contactObject, attribute_def)
  //     }

  //     return []
  //   })

  //   const filteredTags = intersectionBy(
  //     ...contactsTags,
  //     attribute_def.data_type
  //   ).map(tag => ({
  //     title: tag.text,
  //     value: tag.text
  //   }))

  //   setCurrentTags([...currentTags, ...filteredTags])
  //   console.log('PopoverTagSelector', filteredTags)
  // })

  return <BaseTagSelector {...props} value={currentTags} />
}
