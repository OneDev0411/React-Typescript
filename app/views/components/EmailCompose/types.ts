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

export type EmailThreadFormValues = Omit<EmailFormValues, 'attachments'> & {
  attachments: Pick<IFile, 'url' | 'name' | 'preview_url' | 'mime' | 'type'>[]
}

export interface EmailComposeFormProps<EmailType = IEmailCampaign> {
  initialValues?: Partial<EmailFormValues>
  /**
   * TODO: refactor values type to {@link IEmailCampaignInput}, when #3435
   * (mering API for sending email) is done
   * @param values
   */
  sendEmail: (
    values: EmailFormValues & { template?: UUID }
  ) => Promise<EmailType>
  onSent?: (result: EmailType) => void
  /**
   * A deal to suggest attachments from it
   */
  deal?: IDeal
  isSubmitDisabled?: boolean | ((values: EmailFormValues) => boolean)
  hasStaticBody?: boolean
  hasSignatureByDefault?: boolean
  hasTemplateVariables?: boolean
  evaluateTemplateExpressions?: boolean

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

  dispatch: any // Extending DispatchProps seems to have problems
}
