import { useMemo, useState, SetStateAction, Dispatch } from 'react'

import { useActiveBrandId } from '@app/hooks/brand'
import { useBrandPropertyTypes } from '@app/hooks/use-get-brand-property-types'

import { TPropertyGroupType, TPropertyGroup } from '../types'

export const usePropertyTypeFilter = (): [
  TPropertyGroupType[],
  Dispatch<SetStateAction<TPropertyGroupType[]>>,
  TPropertyGroup
] => {
  const activeBrandId = useActiveBrandId()

  const { propertyTypes } = useBrandPropertyTypes(activeBrandId)

  const groupedProperties = useMemo(() => {
    return propertyTypes.reduce((acc, propertyType) => {
      const group: TPropertyGroupType = propertyType.is_lease ? 'lease' : 'sale'
      const oldGroupItems: IDealPropertyType[] = acc[group] || []

      return {
        ...acc,
        [group]: [...oldGroupItems, propertyType]
      }
    }, {} as TPropertyGroup)
  }, [propertyTypes])

  const [propertyGroup, setPropertyGroup] = useState<TPropertyGroupType[]>([])

  return [propertyGroup, setPropertyGroup, groupedProperties]
}
