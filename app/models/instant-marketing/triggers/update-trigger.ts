import Fetch from '../../../services/fetch'

import { getTemplateInstance } from './helpers/get-template-instance'
import { updateTriggerCampaign } from './helpers/update-trigger-campaign'
import { TriggerDataInput, TriggerTemplateInput } from './types'

export async function updateTrigger(
  current: ITrigger,
  contact: IContact & { user: IUser },
  template: Nullable<TriggerTemplateInput>,
  triggerData: TriggerDataInput
): Promise<ApiResponseBody<ITrigger>> {
  try {
    if (!triggerData.event_type) {
      throw new Error('event_type not provided')
    }

    /* we need campaign object along side with trigger data
    if it's not available we're not able to handle updating */
    if (!current.campaign) {
      throw new Error('campaign is not available')
    }

    /* because the end_point accept a negative value that
     shows the time before the main date */
    if (!('wait_for' in triggerData) || triggerData.wait_for > 0) {
      throw new Error('invalid wait_for value')
    }

    let alteredCampaign
    let alteredTemplate

    if (template) {
      alteredTemplate = await getTemplateInstance(template)
    }

    if (alteredTemplate || current.campaign.subject !== triggerData.subject) {
      const templateId = alteredTemplate
        ? { templateId: alteredTemplate.id }
        : {}

      alteredCampaign = await updateTriggerCampaign(
        current.campaign.id,
        contact,
        {
          ...templateId,
          subject: triggerData.subject
        }
      )
    }

    // update trigger
    const response = await new Fetch().patch(`/triggers/${current.id}`).send({
      user: contact.user.id,
      event_type: triggerData.event_type,
      action: triggerData.action || 'schedule_email',
      wait_for: triggerData.wait_for,
      time: triggerData.time,
      campaign: alteredCampaign ? alteredCampaign.id : current.campaign.id
    })

    return response.body
  } catch (e) {
    throw e
  }
}
