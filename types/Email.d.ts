declare type IEmailRecipientType =
  | 'Tag'
  | 'List'
  | 'Email'
  | 'Brand'
  | 'AllContacts'
  | 'Agent'

declare interface IEmailRecipientInputBase<T extends IEmailRecipientType> {
  recipient_type: T
}
declare interface IEmailRecipientListInput
  extends IEmailRecipientInputBase<'List'> {
  list: UUID
}
declare interface IEmailRecipientTagInput
  extends IEmailRecipientInputBase<'Tag'> {
  tag: string
}
declare interface IEmailRecipientEmailInput
  extends IEmailRecipientInputBase<'Email'> {
  email: string
  contact?: UUID
}
declare interface IEmailRecipientBrandInput
  extends IEmailRecipientInputBase<'Brand'> {
  brand: UUID
}

declare interface IEmailRecipientAgentInput
  extends IEmailRecipientInputBase<'Agent'> {
  agent: UUID
}
declare interface IEmailRecipientAllContactsInput
  extends IEmailRecipientInputBase<'AllContacts'> {}

declare type IEmailRecipientInput =
  | IEmailRecipientEmailInput
  | IEmailRecipientListInput
  | IEmailRecipientTagInput
  | IEmailRecipientAllContactsInput
  | IEmailRecipientBrandInput
  | IEmailRecipientAgentInput

declare type IEmailCampaignRecipientAssociation =
  | 'contact'
  | 'list'
  | 'brand'
  | 'agent'

type IEmailRecipientSendType = 'CC' | 'BCC' | 'To'

declare type IEmailRecipient<
  Associations extends IEmailCampaignRecipientAssociation = ''
> = {
  campaign: UUID
  created_at: string
  deleted_at: null | string
  eid: UUID
  email: null | string
  id: UUID
  ord: string
  send_type: IEmailRecipientSendType
  recipient_type: IEmailRecipientType
  tag: string
  type: 'email_campaign_recipient'
  updated_at: null | string
} & Association<'contact', IContact, Associations> &
  Association<'list', IContactList, Associations> &
  Association<'brand', IBrand, Associations> &
  Association<'agent', IAgent, Associations>

declare interface IEmailCampaignAttachment
  extends IModel<'email_campaign_attachment'> {
  campaign: UUID
  content_id: string | undefined
  file: IFile
  is_inline: boolean
}
abstract interface IEmailAttachmentInputBase {
  is_inline: boolean
  content_id?: string
}

interface IEmailAttachmentFileInput extends IEmailAttachmentInputBase {
  file: UUID
}
interface IEmailAttachmentUrlInput extends IEmailAttachmentInputBase {
  url: string
  name: string
}
type IEmailAttachmentInput =
  | IEmailAttachmentFileInput
  | IEmailAttachmentUrlInput

declare interface IEmailCampaignInputBase {
  due_at: Date | null
  from: UUID
  to: IEmailRecipientInput[]
  subject: string
  html: string
  text?: string
  attachments?: IEmailAttachmentInput[]
  template?: UUID
  /**
   * @deprecated, This is not used in practice and is added in initial
   * implementation by the API. It should be removed.
   */
  include_signature?: boolean
}

declare interface IIndividualEmailCampaignInput
  extends IEmailCampaignInputBase {
  google_credential?: string
  microsoft_credential?: string
}

interface IEmailHeaders {
  message_id?: string
  in_reply_to?: string
  thread_id?: string
}

declare interface IEmailCampaignInput extends IEmailCampaignInputBase {
  cc?: IEmailRecipientInput[]
  bcc?: IEmailRecipientInput[]
  headers: IEmailHeaders
  google_credential?: string
  microsoft_credential?: string
}

declare type IEmailCampaignAssociation =
  | 'emails'
  | 'template'
  | 'from'
  | 'recipients'
  | 'attachments'

declare type IEmailCampaignEmailAssociation = 'email'

declare type IEmailCampaign<
  Associations extends IEmailCampaignAssociation = '',
  RecipientAssociations extends IEmailCampaignRecipientAssociation = '',
  EmailCampaignEmailAssociation extends IEmailCampaignEmailAssociation = '',
  EmailFields extends IEmailOptionalFields = ''
> = {
  id: UUID
  created_at: number
  updated_at: null | number
  deleted_at: null | number
  created_by: UUID
  brand: UUID
  subject: string
  include_signature: boolean
  html: string
  due_at: number
  executed_at: null | number
  individual: boolean
  accepted: number
  rejected: number
  delivered: number
  failed: number
  opened: number
  clicked: number
  unsubscribed: number
  complained: number
  stored: number
  text: string
  template?: IMarketingTemplateInstance
  type: 'email_campaign'
  sent: number
  failure: string | null
  microsoft_credential: UUID | null
  google_credential: UUID | null
  headers: IEmailCampaignInput['headers']
} & Association<
  'recipients',
  IEmailRecipient<RecipientAssociations>[],
  Associations
> &
  Association<'from', IUser | IOAuthAccount, Associations> &
  Association<'template', IMarketingTemplateInstance | null, Associations> &
  Association<
    'emails',
    IEmailCampaignEmail<EmailCampaignEmailAssociation>[] | null,
    Associations
  > &
  Association<'attachments', IEmailCampaignAttachment[] | null, Associations>

declare type IEmailCampaignEmail<
  Associations extends IEmailCampaignEmailAssociation = '',
  EmailFields extends EmailFields = ''
> = {
  id: string
  campaign: string
  contact: UUID | null
  accepted: number
  rejected: number
  delivered: number
  failed: number
  opened: number
  clicked: number
  unsubscribed: number
  complained: number
  stored: number
  email_address: string
  error: string | null
  type: 'email_campaign_email'
  full_name: string
  profile_image_url: string | null
} & Association<'email', IEmail<EmailFields>, Associations>

type IEmailOptionalFields = 'html' | 'text'

declare type IEmail<Fields extends IEmailOptionalFields = ''> = {
  id: UUID
  created_at: number
  from: string
  to: string[]
  subject: string
  headers?: IEmailCampaignInput['headers'] // ask
  mailgun_id: string
  domain: 'Marketing' // ask
  campaign: UUID
  cc: string[]
  bcc: string[]
  accepted: number
  rejected: number
  delivered: number
  failed: number
  opened: number
  clicked: number
  unsubscribed: number
  complained: number
  stored: number
  google_id: null | string
  microsoft_id: null | string
  tracking_id: UUID
  is_read: boolean
  type: 'email'
} & Association<'html', string, Fields> &
  Association<'text', string, Fields>

/**
 * This is corresponding to {@link IEmailRecipientInput}, but fields like
 * list, tag and contact are objects instead of UUIDs
 */
declare type IDenormalizedEmailRecipientInput =
  | IDenormalizedEmailRecipientEmailInput
  | IDenormalizedEmailRecipientListInput
  | IDenormalizedEmailRecipientTagInput
  | IEmailRecipientAllContactsInput
  | IDenormalizedEmailRecipientBrandInput
  | IDenormalizedEmailRecipientDealAgentInput

declare interface IDenormalizedEmailRecipientEmailInput
  extends Omit<IEmailRecipientEmailInput, 'contact'> {
  contact?: IContact
}

declare interface IDenormalizedEmailRecipientListInput
  extends Omit<IEmailRecipientListInput, 'list'> {
  list: IContactList
}

declare interface IDenormalizedEmailRecipientTagInput
  extends Omit<IEmailRecipientTagInput, 'tag'> {
  tag: IContactTag
}

declare interface IDenormalizedEmailRecipientBrandInput
  extends Omit<IEmailRecipientBrandInput, 'brand'> {
  brand: IBrand
}

declare interface IDenormalizedEmailRecipientDealAgentInput
  extends Omit<IEmailRecipientAgentInput, 'agent'> {
  agent: IAgent
}
