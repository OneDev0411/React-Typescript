import { useState, useEffect } from 'react'

import { getBrandPropertyTypes } from 'models/brand/get-property-types'

export function useBrandPropertyTypes(brandId: UUID): IDealPropertyType[] {
  const [propertyTypes, setPropertyTypes] = useState<IDealPropertyType[]>([])

  useEffect(() => {
    const load = async () => {
      const propertyTypes = await getBrandPropertyTypes(brandId)

      setPropertyTypes(propertyTypes)
    }

    load()
  }, [brandId])

  return propertyTypes
}
