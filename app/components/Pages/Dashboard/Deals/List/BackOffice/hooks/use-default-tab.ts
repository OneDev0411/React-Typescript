import { useEffect } from 'react'

import { goTo } from '@app/utils/go-to'

export function useDefaultTab(
  params: Record<string, unknown>,
  defaultTab: Nullable<string>
) {
  useEffect(() => {
    if (params.hasOwnProperty('filter') && !params.filter && defaultTab) {
      goTo(`/dashboard/deals/filter/${defaultTab}`)
    }
  }, [defaultTab, params])
}
