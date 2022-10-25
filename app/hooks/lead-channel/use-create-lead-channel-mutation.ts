import { useQueryClient } from 'react-query'

import { useMutation } from '@app/hooks/query'
import { createLeadChannel } from '@app/models/lead-capture/create-lead-channel'

import { list } from './keys'

export function useCreateLeadChannelMutation(activeBrandId?: UUID) {
  const queryClient = useQueryClient()

  return useMutation(
    async (data: { sourceType: LeadChannelSourceType }) => {
      if (!activeBrandId) {
        return
      }

      return createLeadChannel(activeBrandId, data)
    },
    {
      onSettled: () => {
        queryClient.invalidateQueries(list())
      }
    }
  )
}
