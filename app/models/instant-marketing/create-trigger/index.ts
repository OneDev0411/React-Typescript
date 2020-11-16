import { renderBrandedNunjuksTemplate } from 'utils/marketing-center/render-branded-nunjuks-template'

import Fetch from '../../../services/fetch'

import { createTemplateInstance } from '../create-template-instance'
import { createEmailCampaign } from '../../email/create-email-campaign'

export interface DataType extends Pick<ITrigger, 'wait_for' | 'event_type'> {
  subject: string
}

interface TemplateData {
  user?: IUser
  contact?: IContact
}

export async function createTrigger(
  contact: IContact,
  template: IBrandMarketingTemplate,
  brand: IBrand,
  data: DataType,
  templateData: TemplateData = {}
): Promise<ITrigger> {
  try {
    if (!contact || !brand || !template) {
      throw new Error('contact or brand or teplate not provided')
    }

    if (!contact.email) {
      throw new Error('contact has no email')
    }

    if (!data.event_type) {
      throw new Error('event_type not provided')
    }

    // because the end_point accept a negative value that shows the time before the main date
    if (!('wait_for' in data) || data.wait_for > 0) {
      throw new Error('invalid wait_for value')
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
    const campaign = await createEmailCampaign({
      due_at: null,
      from: (contact.user as IUser).id,
      to: [
        {
          recipient_type: 'Email',
          email: contact.email,
          contact: contact.id
        }
      ],
      subject: data?.subject ?? 'Congratulation!',
      html: '',
      template: templateInstance.id,
      individual: true,
      notifications_enabled: true
    })

    // step4: set a trigger for a field
    const response = await new Fetch().post('/triggers').send({
      user: (contact.user as IUser).id,
      event_type: data.event_type,
      action: 'schedule_email',
      wait_for: data.wait_for,
      campaign: campaign.id,
      contact: contact.id
    })

    return response
  } catch (e) {
    throw e
  }
}
