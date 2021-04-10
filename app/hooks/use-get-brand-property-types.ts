import { useState, useEffect, useCallback } from 'react'

import { getBrandPropertyTypes } from 'models/brand/get-property-types'

export function useBrandPropertyTypes(
  brandId: UUID
): {
  propertyTypes: IDealPropertyType[]
  reload: () => void
} {
  const [propertyTypes, setPropertyTypes] = useState<IDealPropertyType[]>([])

  const load = useCallback(async () => {
    const propertyTypes = await getBrandPropertyTypes(brandId)

    setPropertyTypes(propertyTypes)
  }, [brandId])

  useEffect(() => {
    load()
  }, [brandId, load])

  return {
    propertyTypes,
    reload: load
  }
}
