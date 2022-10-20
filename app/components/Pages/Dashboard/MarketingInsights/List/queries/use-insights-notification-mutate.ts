import { useQueryClient } from 'react-query'

import { useMutation } from '@app/hooks/query'
import useNotify from '@app/hooks/use-notify'
import { setEmailNotificationStatus } from '@app/models/email/set-email-notification-status'

import { EmailCampaignStatus } from '../../types'

import { listStatus } from './keys'

interface InsightsQuery {
  pageParams?: string[] | undefined
  pages: {
    data: IEmailCampaign<'template'>[]
  }[]
}

const getNextPages = (
  previousList: InsightsQuery | undefined,
  data: { id: UUID; checked: boolean }
) => {
  return previousList?.pages.map(page => ({
    ...page,
    data: page.data.map((item: IEmailCampaign<'template'>) =>
      item.id === data.id
        ? {
            ...item,
            notifications_enabled: data.checked
          }
        : item
    )
  }))
}

export function useInsightsNotificationMutation(status: EmailCampaignStatus) {
  const queryClient = useQueryClient()
  const notify = useNotify()

  return useMutation(
    ({ id, checked }: { id: UUID; checked: boolean }) =>
      setEmailNotificationStatus(id, checked),
    {
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
          message: 'We were unable to store data. It can be attempted again.',
          status: 'error'
        })
      },
      onSettled: () => {
        queryClient.invalidateQueries(listStatus(status))
      }
    }
  )
}
