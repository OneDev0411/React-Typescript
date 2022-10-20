import { useQueryClient } from 'react-query'

import { useMutation } from '@app/hooks/query'
import useNotify from '@app/hooks/use-notify'
import { deleteEmailCampaign } from '@app/models/email/delete-email-campaign'

import { useInsightsContext } from '../../context/use-insights-context'

import { listStatus } from './keys'

interface InsightsQuery {
  pageParams?: string[] | undefined
  pages: {
    data: IEmailCampaign<'template'>[]
  }[]
}

const getNextPages = (
  previousList: InsightsQuery | undefined,
  data: { id: UUID }
) => {
  return previousList?.pages.map(page => ({
    ...page,
    data: page.data.filter(
      (item: IEmailCampaign<'template'>) => item.id !== data.id
    )
  }))
}

export function useInsightsDeleteMutation() {
  const queryClient = useQueryClient()
  const { status } = useInsightsContext()
  const notify = useNotify()

  return useMutation(({ id }: { id: UUID }) => deleteEmailCampaign(id), {
    onMutate: async (data: { id: UUID; checked: boolean }) => {
      await queryClient.cancelQueries(listStatus(status))

      const previousList = queryClient.getQueryData<InsightsQuery>(
        listStatus(status)
      )

      if (previousList) {
        queryClient.setQueryData<InsightsQuery>(listStatus(status), {
          ...previousList,
          pages: getNextPages(previousList, data) ?? []
        })
      }

      return {
        previousList
      }
    },
    onError: (
      _: unknown,
      __: Partial<IEmailCampaign<'template'>>,
      context: { previousList: InsightsQuery }
    ) => {
      if (context?.previousList) {
        queryClient.setQueryData<InsightsQuery>(
          listStatus(status),
          context.previousList
        )
      }

      notify({
        message: 'We were unable to remove data. It can be attempted again.',
        status: 'error'
      })
    },
    onSettled: () => {
      queryClient.invalidateQueries(listStatus(status))
    }
  })
}
