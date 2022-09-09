import { useQuery } from '@app/hooks/query'
import { getLeadChannels } from '@app/models/lead-capture/get-lead-channels'

import { list } from './keys'

export function useLeadChannels(brand?: UUID) {
  return useQuery(
    list(),
    () => {
      if (!brand) {
        return
      }

      return getLeadChannels(brand)
    },
    {
      enabled: !!brand
    }
  )
}
