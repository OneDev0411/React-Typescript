import { useState, useMemo, useCallback } from 'react'

import { useEffectOnce } from 'react-use'

import useNotify from '@app/hooks/use-notify'
import { addAttributes } from '@app/models/contacts/add-attributes'
import { deleteAttribute as removeAttribute } from '@app/models/contacts/delete-attribute'

export interface UseAttributeDef {
  id: Optional<UUID>
  list: IContactAttribute[]
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
  const [list, setList] = useState<IContactAttribute[]>([])

  const attributeDefId = useMemo(() => {
    const attributeDef = contact.attributes.find(
      attr => attr.attribute_def.name === attributeName
    )

    return attributeDef?.attribute_def.id
  }, [attributeName, contact.attributes])

  useEffectOnce(() => {
    const handleFilterAttribute = () => {
      const filteredAttribute = contact.attributes.filter(
        attr => attr.attribute_def.id === attributeDefId
      )

      setList(filteredAttribute)
    }

    if (attributeDefId) {
      handleFilterAttribute()
    }
  })

  const createAttribute = useCallback(
    async (data: Record<string, unknown>) => {
      try {
        const response = await addAttributes(contact.id, [
          { ...data, attribute_def: attributeDefId }
        ])
        const newAttrAdded = response.data[0]

        setList(prevList => {
          return { ...prevList, newAttrAdded }
        })
        notify({
          status: 'success',
          message: 'New attribute added!'
        })
      } catch (_) {}
    },
    [attributeDefId, contact.id, notify]
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
      } catch (_) {}
    },
    [contact.id, notify]
  )

  return {
    id: attributeDefId,
    list,
    createAttribute,
    deleteAttribute
  }
}
