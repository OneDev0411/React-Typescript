import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import intersection from 'lodash/intersection'

import useEffectOnce from 'react-use/lib/useEffectOnce'

import { selectDefinitionByName } from 'reducers/contacts/attributeDefs'
import { selectContact } from 'reducers/contacts/list'

import { IAppState } from 'reducers'

import {
  BaseTagSelector,
  Props as BaseTagSelectorProps
} from './BaseTagSelector'
import { SelectorOption } from '../type'

export interface Props extends BaseTagSelectorProps {
  contact?: IContact
  selectedIds?: UUID[]
}

export const BaseContactTagSelector = ({
  selectedIds = [],
  contact,
  value = [],
  ...props
}: Props) => {
  const [currentTags, setCurrentTags] = useState<SelectorOption[]>(value)
  const { attributeDefs, contactListStore } = useSelector(
    (store: IAppState) => {
      const { attributeDefs, list: contactListStore } = store.contacts

      return {
        attributeDefs,
        contactListStore
      }
    }
  )

  useEffectOnce(() => {
    const attribute_def = selectDefinitionByName(attributeDefs, 'tag')

    if (selectedIds.length === 0 || !attribute_def) {
      return
    }

    const contactsTags = selectedIds.map(contactId => {
      const contactObject =
        contact && contact.id === contactId
          ? contact
          : selectContact(contactListStore, contactId)

      if (contactObject) {
        return contactObject.tags || []
      }

      return []
    })

    const filteredTags = intersection<string>(...contactsTags).map(tag => ({
      title: tag,
      value: tag
    }))

    setCurrentTags([...currentTags, ...filteredTags])
    console.log('PopoverTagSelector', filteredTags)
  })

  return <BaseTagSelector {...props} value={currentTags} />
}
