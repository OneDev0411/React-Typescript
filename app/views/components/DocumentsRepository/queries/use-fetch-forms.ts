import { useState } from 'react'

import { useActiveBrand } from '@app/hooks/brand'
import { getBrandForm } from '@app/models/brand/get-brand-form'

export function useFetchForms() {
  const activeBrand = useActiveBrand()
  const [isFetching, setIsFetching] = useState<boolean>(false)

  const fetchForms = async (formIds: UUID[]): Promise<Nullable<IFile[]>> => {
    setIsFetching(true)

    try {
      const files = await Promise.all(
        formIds.map(formId => getBrandForm(activeBrand.id, formId))
      )

      return files
    } catch (e) {
      return null
    } finally {
      setIsFetching(false)
    }
  }

  return {
    fetchForms,
    isFetching
  }
}
