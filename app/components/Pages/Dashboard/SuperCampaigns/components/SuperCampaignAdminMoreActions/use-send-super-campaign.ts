import { useContext } from 'react'

import { useRunActionThenNotify } from '@app/hooks/use-run-action-then-notify'
import updateSuperCampaign from '@app/models/super-campaign/update-super-campaign'
import ConfirmationModalContext from 'components/ConfirmationModal/context'

import { convertDateToTimestamp } from '../../helpers'

export function useSendSuperCampaign(
  superCampaign: ISuperCampaign,
  onSend: (superCampaign: ISuperCampaign) => void
) {
  const { isRunning, runActionThenNotify } = useRunActionThenNotify()
  const confirmation = useContext(ConfirmationModalContext)

  return {
    isSending: isRunning,
    sendSuperCampaign: () => {
      confirmation.setConfirmationModal({
        message: `Are you sure you want to send "${
          superCampaign.subject || 'Untitled Campaign'
        }" now?`,
        confirmLabel: 'Yes, I am',
        onConfirm: () => {
          runActionThenNotify(
            async () => {
              const updatedSuperCampaign = await updateSuperCampaign(
                superCampaign.id,
                {
                  subject: superCampaign.subject,
                  description: superCampaign.description,
                  template_instance: superCampaign.template_instance,
                  due_at: convertDateToTimestamp(new Date())
                }
              )

              onSend(updatedSuperCampaign)
            },
            'The campaign was sent',
            'Something went wrong while sending the campaign. Please try again.'
          )
        }
      })
    }
  }
}
