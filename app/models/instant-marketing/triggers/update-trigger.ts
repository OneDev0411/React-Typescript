import { TemplateData } from 'utils/marketing-center/render-branded-nunjuks-template'

import Fetch from '../../../services/fetch'

import { getTemplateInstance } from './helpers/get-template-instance'
import { updateTriggerCampaign } from './helpers/update-trigger-campaign'
import { TriggerDataInput } from './types'

export async function updateTrigger(
  current: ITrigger,
  contact: IContact,
  brand: IBrand,
  template: Nullable<IBrandMarketingTemplate>,
  triggerData: TriggerDataInput,
  templateData: TemplateData = {}
): Promise<ITrigger> {
  try {
    if (!triggerData.event_type) {
      throw new Error('event_type not provided')
    }

    /* because the end_point accept a negative value that
     shows the time before the main date */
    if (!('wait_for' in triggerData) || triggerData.wait_for > 0) {
      throw new Error('invalid wait_for value')
    }

    let alteredCampaign
    let alteredTemplate
    const currentCampaignId =
      typeof current.campaign === 'object'
        ? current.campaign.id
        : current.campaign

    if (template) {
      alteredTemplate = await getTemplateInstance(template, brand, templateData)
    }

    if (alteredTemplate || current.campaign?.subject !== triggerData.subject) {
      const templateId = alteredTemplate
        ? { templateId: alteredTemplate.id }
        : {}

      alteredCampaign = await updateTriggerCampaign(
        currentCampaignId,
        contact,
        {
          ...templateId,
          subject: triggerData.subject
        }
      )
    }

    // update trigger
    const response = await new Fetch().patch(`/triggers/${current.id}`).send({
      user: (contact.user as IUser).id,
      event_type: triggerData.event_type,
      action: triggerData.action || 'schedule_email',
      wait_for: triggerData.wait_for,
      campaign: alteredCampaign ? alteredCampaign.id : currentCampaignId
    })

    return response
  } catch (e) {
    throw e
  }
}
