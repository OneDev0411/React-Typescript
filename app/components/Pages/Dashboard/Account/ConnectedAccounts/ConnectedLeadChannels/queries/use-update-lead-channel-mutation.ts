import { useQueryClient } from 'react-query'

import { useMutation } from '@app/hooks/query'
import { updateLeadChannel } from '@app/models/lead-capture/update-lead-channel'

import { list } from './keys'

export function useUpdateLeadChannelMutation(
  channel: LeadChannel,
  activeBrandId?: UUID
) {
  const queryClient = useQueryClient()

  return useMutation(
    async (data: { brand: UUID }) => {
      if (!activeBrandId) {
        return
      }

      return updateLeadChannel(activeBrandId, channel.id, data)
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
