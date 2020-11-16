import { renderBrandedNunjuksTemplate } from 'utils/marketing-center/render-branded-nunjuks-template'

import Fetch from '../../../services/fetch'

import { createTemplateInstance } from '../create-template-instance'
import { updateEmailCampaign } from '../../email/update-email-campaign'
import { DataType } from '../create-trigger'

interface TemplateData {
  user?: IUser
  contact?: IContact
}

export async function updateTrigger(
  current: ITrigger,
  contact: IContact,
  template: IBrandMarketingTemplate | null,
  brand: IBrand,
  data: DataType,
  templateData: TemplateData = {}
): Promise<ITrigger> {
  try {
    if (!contact || !contact.email) {
      throw new Error('contact is not valid')
    }

    if (!data.event_type) {
      throw new Error('event_type not provided')
    }

    // because the end_point accept a negative value that shows the time before the main date
    if (!('wait_for' in data) || data.wait_for > 0) {
      throw new Error('invalid wait_for value')
    }

    const currentCampaignId =
      typeof current.campaign === 'object'
        ? current.campaign.id
        : current.campaign
    let campaign

    if (template) {
      if (!brand) {
        throw new Error('brand not provided')
      }

      const { template: marketingTemplate } = template
      // step1: render the template to the nunjuks
      const html: string = await renderBrandedNunjuksTemplate(
        template,
        brand,
        templateData
      )

      // step2: create a template instance
      const templateInstance: IMarketingTemplateInstance = await createTemplateInstance(
        marketingTemplate.id,
        {
          html
        }
      )

      // step3: create a email campaign
      campaign = await updateEmailCampaign(currentCampaignId, {
        due_at: null,
        from: (contact.user as IUser).id,
        to: [
          {
            recipient_type: 'Email',
            email: contact.email,
            contact: contact.id
          }
        ],
        subject: 'Congratulation!',
        html: '',
        template: templateInstance.id,
        individual: true,
        notifications_enabled: true
      })
    }

    // step4: set a trigger for a field
    const response = await new Fetch().patch(`/triggers/${current.id}`).send({
      user: (contact.user as IUser).id,
      event_type: data.event_type,
      action: 'schedule_email',
      wait_for: data.wait_for,
      campaign: campaign ? campaign.id : currentCampaignId
    })

    return response
  } catch (e) {
    throw e
  }
}
