import { useQueryClient } from 'react-query'

import { useMutation } from '@app/hooks/query'
import { deleteLeadChannel } from '@app/models/lead-capture/delete-lead-channel'

import { list } from './keys'

export function useDeleteLeadChannelMutation(
  channel: LeadChannelSourceType,
  activeBrandId?: UUID
) {
  const queryClient = useQueryClient()

  return useMutation(
    async () => {
      if (!activeBrandId) {
        return
      }

      return deleteLeadChannel(activeBrandId, channel.id)
    },
    {
      onMutate: async () => {
        await queryClient.cancelQueries(list())

        const previousChannels = queryClient.getQueryData<LeadChannel[]>(list())

        if (previousChannels) {
          queryClient.setQueryData<LeadChannel[]>(
            list(),
            previousChannels?.filter(item => item.id !== channel.id)
          )
        }

        return {
          previousChannels
        }
      },
      onError: (
        _: unknown,
        __: Partial<LeadChannel>,
        context: { previousChannels: LeadChannel[] }
      ) => {
        if (context?.previousChannels) {
          queryClient.setQueryData<LeadChannel[]>(
            list(),
            context.previousChannels
          )
        }
      },
      onSettled: () => {
        queryClient.invalidateQueries(list())
      }
    }
  )
}
