import { useContext } from 'react'

import { useMutation } from '@app/hooks/query'
import { convertDateToTimestamp } from '@app/utils/date-utils'
import ConfirmationModalContext from '@app/views/components/ConfirmationModal/context'

import { getAll } from './query-keys/campaign'
import { updateSuperCampaign } from './update-super-campaign'

export function useSendSuperCampaign(superCampaign: ISuperCampaign) {
  const confirmation = useContext(ConfirmationModalContext)
  const { mutate, ...other } = useMutation(
    async () =>
      updateSuperCampaign(superCampaign.id, {
        subject: superCampaign.subject,
        description: superCampaign.description,
        template_instance: superCampaign.template_instance,
        due_at: convertDateToTimestamp(new Date())
      }),
    {
      notify: {
        onSuccess: 'The campaign was sent',
        onError:
          'Something went wrong while sending the campaign. Please try again.'
      },
      invalidates: [getAll()] // TODO: use optimistic update if possible
    }
  )

  return {
    mutate: () => {
      confirmation.setConfirmationModal({
        message: `Are you sure you want to send "${
          superCampaign.subject || 'Untitled Campaign'
        }" now?`,
        confirmLabel: 'Yes, I am',
        onConfirm: () => mutate()
      })
    },
    ...other
  }
}
