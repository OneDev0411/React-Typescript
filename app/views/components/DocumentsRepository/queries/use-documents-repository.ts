import { useMemo } from 'react'

import { groupBy } from 'lodash'

import { useActiveBrand } from '@app/hooks/brand'
import { useQuery } from '@app/hooks/query'
import { getBrandForms } from '@app/models/brand/get-brand-forms'
import { getForms as getDealForms } from '@app/models/Deal/form'

import { list } from './keys'

export function useDocumentsRepository(deal: IDeal | undefined) {
  const activeBrand = useActiveBrand()

  const query = useQuery(list(), () =>
    deal ? getDealForms(deal.id) : getBrandForms(activeBrand.id)
  )

  const forms = useMemo(() => {
    const normalized = (query.data ?? []).map((form: IBrandForm) => ({
      ...form,
      libraryName: form.library.name || 'Untitled'
    }))

    return groupBy(normalized, form => form.libraryName)
  }, [query.data])

  return {
    ...query,
    categoryNames: Object.keys(forms ?? {}),
    forms
  }
}
