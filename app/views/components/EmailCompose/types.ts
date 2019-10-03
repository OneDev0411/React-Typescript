import { ReactNode } from 'react'
import { SuperAgentRequest } from 'superagent'

import { uploadEmailAttachment } from 'models/email/upload-email-attachment'

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
  from: { value: string; label: string } | undefined
  due_at: Date | null
  body: string | undefined
}

export interface EmailComposeFormProps<EmailType> {
  initialValues?: Partial<EmailFormValues>
  sendEmail: (values: EmailFormValues) => Promise<EmailType>
  onSent?: (result: EmailType) => void
  /**
   * A deal to suggest attachments from it
   */
  deal?: IDeal
  isSubmitDisabled?: boolean | ((values: EmailFormValues) => boolean)
  hasStaticBody?: boolean
  hasSignatureByDefault?: boolean
  hasTemplateVariables?: boolean

  renderCollapsedFields: (values: EmailFormValues) => ReactNode
  renderFields: (values: EmailFormValues) => ReactNode

  /**
   * function for customizing attachment upload
   */
  uploadAttachment?: typeof uploadEmailAttachment

  /**
   * If passed, a dropdown will be shown in from, which allows user to select
   * `from`, from this predefined set of options
   */
  fromOptions?: EmailFormValues['from'][]
  /**
   * If false, schedule button will not be shown in footer.
   * Defaults to true
   */
  enableSchedule?: boolean
  /**
   * If passed, a cancel button will be shown and onCancel will be called upon
   * clicking it.
   */
  onCancel?: () => void

  dispatch: any // Extending DispatchProps seems to have problems
}
