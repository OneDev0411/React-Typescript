import { updateEmailCampaign } from '../../../email/update-email-campaign'

import { TriggerDataInput } from '../types'

interface Data extends Pick<TriggerDataInput, 'subject'> {
  templateId?: UUID
}

export const updateTriggerCampaign = async (
  campaignId: UUID,
  contact: IContact,
  data: Data
): Promise<
  IEmailCampaign<
    'emails' | 'template' | 'from' | 'recipients',
    'contact',
    'email'
  >
> => {
  try {
    if (!contact.email) {
      throw new Error("Contact's email is not available.")
    }

    if (!contact.user) {
      throw new Error("Contact's owner is not available.")
    }

    const template = data.templateId ? { template: data.templateId } : {}

    const campaign = await updateEmailCampaign(campaignId, {
      due_at: null,
      from: (contact.user as IUser).id,
      to: [
        {
          recipient_type: 'Email',
          email: contact.email,
          contact: contact.id
        }
      ],
      subject: data.subject || 'Congratulation!',
      html: '',
      individual: true,
      notifications_enabled: true,
      ...template
    })

    return campaign
  } catch (e) {
    throw e
  }
}
