import { useMemo, useState, useEffect, SetStateAction, Dispatch } from 'react'

import { useQueryState } from 'use-location-state'

import { useActiveBrandId } from '@app/hooks/brand'
import { useBrandPropertyTypes } from '@app/hooks/use-get-brand-property-types'

import { DEALS_LIST_DEFAULT_FILTERS } from '../constants'
import { getActivePropertyGroups } from '../helpers/get-active-property-groups'
import { TPropertyGroupType, TPropertyGroup } from '../types'

export const usePropertyTypeFilter = (): [
  TPropertyGroupType[],
  Dispatch<SetStateAction<TPropertyGroupType[]>>,
  TPropertyGroup
] => {
  const activeBrandId = useActiveBrandId()

  const [propertyTypeParamValue] = useQueryState(
    'propertyType',
    DEALS_LIST_DEFAULT_FILTERS.property_type || []
  )
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

  useEffect(() => {
    const initialPropertyGroupValue = getActivePropertyGroups(
      propertyTypeParamValue as UUID[],
      propertyTypes
    )

    setPropertyGroup(initialPropertyGroupValue)
    // it should be called only once when propertyTypes is loaded
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [propertyTypes])

  return [propertyGroup, setPropertyGroup, groupedProperties]
}
