import Fetch from '../../../services/fetch'
import { getTriggerCampaign } from './helpers/get-trigger-campaign'
import { TriggerDataInput } from './types'

export async function createTrigger(
  contact: IContact & { user: IUser },
  templateInstance: IMarketingTemplateInstance,
  triggerData: TriggerDataInput
): Promise<ApiResponseBody<ITrigger>> {
  try {
    if (!triggerData.event_type) {
      throw new Error('event_type not provided')
    }

    /* because the end_point accept a negative value that
     shows the time before the main date */
    if (!('wait_for' in triggerData) || triggerData.wait_for > 0) {
      throw new Error('invalid wait_for value')
    }

    // step1: create a email campaign
    const campaign = await getTriggerCampaign(contact, templateInstance.id, {
      subject: triggerData.subject
    })

    // step2: setup a trigger for a field
    const response = await new Fetch().post('/triggers').send({
      user: contact.user.id,
      event_type: triggerData.event_type,
      action: triggerData.action || 'schedule_email',
      wait_for: triggerData.wait_for,
      recurring: triggerData.recurring,
      time: triggerData.time,
      campaign: campaign.id,
      contact: contact.id
    })

    return response.body
  } catch (e) {
    throw e
  }
}
