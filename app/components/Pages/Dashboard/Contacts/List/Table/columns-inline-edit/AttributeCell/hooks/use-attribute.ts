import { useState, useCallback } from 'react'

import { useSelector } from 'react-redux'
import { useEffectOnce } from 'react-use'

import useNotify from '@app/hooks/use-notify'
import { addAttributes } from '@app/models/contacts/add-attributes'
import { deleteAttribute as removeAttribute } from '@app/models/contacts/delete-attribute'
import { IAppState } from '@app/reducers'

export interface UseAttributeDef {
  list: IContactAttribute[]
  attributeDef: Nullable<IContactAttributeDef>
  createAttribute: (data: Record<string, unknown>) => void
  deleteAttribute: (attributeId: UUID) => void
}

/**
 * Returns the entire user info from the redux store.
 * @param state The app state
 * @returns The user state
 */

export function useAttributeDef(
  contact: IContactWithAssoc<'contact.attributes'>,
  attributeName: string
): UseAttributeDef {
  const notify = useNotify()
  const attributeDef = useSelector<IAppState, Nullable<IContactAttributeDef>>(
    state => {
      const attributeDefs = state.contacts.attributeDefs
      const attributeDefId = attributeDefs.byName[attributeName]

      return attributeDefs.byId[attributeDefId] ?? null
    }
  )
  const [list, setList] = useState<IContactAttribute[]>([])

  console.log({ attributeDef })

  useEffectOnce(() => {
    const handleFilterAttribute = () => {
      const filteredAttributes = contact.attributes.filter(
        attr => attr.attribute_def.id === attributeDef?.id
      )

      setList(filteredAttributes)
    }

    if ((contact.attributes ?? []).length > 0) {
      handleFilterAttribute()
    }
  })

  const createAttribute = useCallback(
    async (data: Record<string, unknown>) => {
      try {
        const response = await addAttributes(contact.id, [
          { ...data, attribute_def: attributeDef?.id }
        ])
        const newAttrAdded = response.data[0]

        console.log({ dd: response.data, newAttrAdded })

        setList(prevList => {
          return [...prevList, newAttrAdded]
        })
        notify({
          status: 'success',
          message: 'New attribute added!'
        })
      } catch (error) {
        throw error
      }
    },
    [attributeDef?.id, contact.id, notify]
  )

  const deleteAttribute = useCallback(
    async (attributeId: UUID) => {
      try {
        await removeAttribute(contact.id, attributeId)

        setList(prevList => {
          return prevList.filter(attr => attr.id !== attributeId)
        })
        notify({
          status: 'success',
          message: 'Deleted!'
        })
      } catch (error) {
        throw error
      }
    },
    [contact.id, notify]
  )

  return {
    list,
    attributeDef,
    createAttribute,
    deleteAttribute
  }
}
