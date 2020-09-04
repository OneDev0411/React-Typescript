import { ReactNode } from 'react'
import { SuperAgentRequest } from 'superagent'

import { uploadEmailAttachment } from 'models/email/upload-email-attachment'

export interface IUploadingAttachment {
  file: File
  request: SuperAgentRequest
  key: string | number
}

export interface EmailFormValues {
  attachments: (IFile | UrlBasedEmailAttachmentInput)[]
  to: IDenormalizedEmailRecipientInput[] | undefined
  cc?: IDenormalizedEmailRecipientInput[] | undefined
  bcc?: IDenormalizedEmailRecipientInput[] | undefined
  subject: string
  from: IUser | IOAuthAccount
  due_at: Date | null
  body: string | undefined
  templateInstance?: IMarketingTemplateInstance
}

export interface UrlBasedEmailAttachmentInput {
  url: string
  name: string
}

export type EmailComposeValues = EmailFormValues & { template?: UUID }

export interface EmailComposeFormProps<EmailType = IEmailCampaign> {
  initialValues?: Partial<EmailFormValues>
  /**
   * TODO: refactor values type to {@link IEmailCampaignInput}, when #3435
   * (mering API for sending email) is done
   * @param values
   */
  sendEmail: (values: EmailComposeValues) => Promise<EmailType>
  onSent?: (result: EmailType) => void
  onClose?: () => void
  onClickAddDealAttachments?: () => void
  onSelectMarketingTemplate?: (
    template: IMarketingTemplateInstance | null,
    values: EmailFormValues
  ) => boolean | Promise<boolean>
  /**
   * A deal to suggest attachments from it
   */
  deal?: IDeal
  isSubmitDisabled?: boolean | ((values: EmailFormValues) => boolean)
  hasStaticBody?: boolean
  hasSignatureByDefault?: boolean
  hasTemplateVariables?: boolean
  disableMarketingTemplates?: boolean

  renderCollapsedFields: (values: EmailFormValues) => ReactNode
  renderFields: (values: EmailFormValues) => ReactNode

  /**
   * function for customizing attachment upload
   */
  uploadAttachment?: typeof uploadEmailAttachment

  /**
   * If passed, cancel button will be shown and onCancel will be called upon
   * clicking it.
   */
  onCancel?: () => void
  /**
   * If passed, delete button will be shown and onDelete will be called upon
   * clicking it.
   */
  onDelete?: (values: EmailFormValues) => void | Promise<any>

  /**
   * Rendered above the footer. Specially useful for rendering
   * non-visual things that read form values like OnChange.
   */
  children?: ReactNode
}
