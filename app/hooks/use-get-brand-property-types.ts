import { useState, useEffect, useCallback } from 'react'

import { reorderBrandPropertyTypes } from '@app/models/brand/reorder-property-types'
import { getBrandPropertyTypes } from 'models/brand/get-property-types'

export function useBrandPropertyTypes(brandId: Nullable<UUID>) {
  if (!brandId) {
    throw new Error('Brand is not provided')
  }

  const [propertyTypes, setPropertyTypes] = useState<IDealPropertyType[]>([])

  const load = useCallback(async () => {
    const propertyTypes = await getBrandPropertyTypes(brandId)

    setPropertyTypes(propertyTypes.sort((a, b) => a.order - b.order))
  }, [brandId])

  useEffect(() => {
    load()
  }, [brandId, load])

  const addPropertyTypes = (propertyType: IDealPropertyType): void => {
    setPropertyTypes([...propertyTypes, propertyType])
  }

  const reorderPropertyTypes = (propertyTypes: IDealPropertyType[]): void => {
    const list = propertyTypes.map((propertyType, index) => ({
      ...propertyType,
      order: index + 1
    }))

    setPropertyTypes(propertyTypes)

    reorderBrandPropertyTypes(
      brandId,
      list.map(item => ({
        id: item.id,
        order: item.order
      }))
    )
  }

  const updatePropertyType = (propertyType: IDealPropertyType): void => {
    setPropertyTypes(
      propertyTypes.map(item =>
        item.id === propertyType.id ? propertyType : item
      )
    )
  }

  return {
    propertyTypes,
    addPropertyTypes,
    updatePropertyType,
    reorderPropertyTypes,
    reload: load
  }
}
