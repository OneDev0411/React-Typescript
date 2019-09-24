import { ReactNode } from 'react'
import { SuperAgentRequest } from 'superagent'

export interface IUploadingAttachment {
  file: File
  request: SuperAgentRequest
}

export interface EmailFormValues {
  attachments: IFile[]
  to: IDenormalizedEmailRecipientInput[] | undefined
  cc?: IDenormalizedEmailRecipientInput[] | undefined
  bcc?: IDenormalizedEmailRecipientInput[] | undefined
  subject: string
  from: IUser
  due_at: Date | null
  body: string | undefined
}

export interface EmailComposeFormProps {
  initialValues?: Partial<EmailFormValues>
  sendEmail: (values: EmailFormValues) => Promise<IEmailCampaign>
  onSent?: (result: IEmailCampaign) => void
  /**
   * A deal to suggest attachments from it
   */
  deal?: IDeal
  isSubmitDisabled?: boolean
  hasStaticBody?: boolean
  hasSignatureByDefault?: boolean
  hasTemplateVariables?: boolean

  renderCollapsedFields: (values: EmailFormValues) => ReactNode
  renderFields: (values: EmailFormValues) => ReactNode

  dispatch: any // Extending DispatchProps seems to have problems
}
