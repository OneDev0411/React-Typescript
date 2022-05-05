import { useState, useMemo } from 'react'

import { useEffectOnce } from 'react-use'

interface UseAttributeDef {
  id: Optional<UUID>
  list: IContactAttribute[]
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

  return {
    id: attributeDefId,
    list
  }
}
