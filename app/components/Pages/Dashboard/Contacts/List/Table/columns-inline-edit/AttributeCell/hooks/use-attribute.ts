import { useState, useMemo, useCallback } from 'react'

import { useEffectOnce } from 'react-use'

import useNotify from '@app/hooks/use-notify'
import { deleteAttribute as removeAttribute } from '@app/models/contacts/delete-attribute'

interface UseAttributeDef {
  id: Optional<UUID>
  list: IContactAttribute[]
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
    deleteAttribute
  }
}
