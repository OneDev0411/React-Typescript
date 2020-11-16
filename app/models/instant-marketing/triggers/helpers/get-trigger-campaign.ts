import { createEmailCampaign } from '../../../email/create-email-campaign'
import { TriggerDataInput } from '../types'

export const getTriggerCampaign = async (
  contact: IContact,
  templateId: UUID,
  data: Pick<TriggerDataInput, 'subject'>
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
      subject: data.subject || 'Congratulation!',
      html: '',
      template: templateId,
      individual: true,
      notifications_enabled: true
    })

    return campaign
  } catch (e) {
    throw e
  }
}
