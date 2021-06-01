import { useState, useEffect, useCallback } from 'react'

import { getBrandPropertyTypes } from 'models/brand/get-property-types'

export function useBrandPropertyTypes(brandId: UUID) {
  const [propertyTypes, setPropertyTypes] = useState<IDealPropertyType[]>([])

  const load = useCallback(async () => {
    const propertyTypes = await getBrandPropertyTypes(brandId)

    setPropertyTypes(propertyTypes)
  }, [brandId])

  useEffect(() => {
    load()
  }, [brandId, load])

  const addPropertyTypes = (propertyType: IDealPropertyType) => {
    setPropertyTypes([...propertyTypes, propertyType])
  }

  return {
    propertyTypes,
    addPropertyTypes,
    reload: load
  }
}
