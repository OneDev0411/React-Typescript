import { useCallback } from 'react'

import { IAttribute } from '../types'

import { useAttributeDefinition } from './use-attribute-definition'

export function useAttributeLabel() {
  const getAttributeDefinition = useAttributeDefinition()

  return useCallback(
    (attribute: IAttribute) => {
      if (!attribute) {
        return ''
      }

      return getAttributeDefinition(attribute).label
    },
    [getAttributeDefinition]
  )
}
