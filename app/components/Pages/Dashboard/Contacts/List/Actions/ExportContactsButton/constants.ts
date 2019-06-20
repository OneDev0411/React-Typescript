export const FULL_EXPORT_TYPE = 'contact_export'
export const EMAIL_EXPORT_TYPE = 'contact_email_export'
export const MAILER_EXPORT_TYPE = 'contact_joint_export'

enum ExportType {
  Full = 'contact_export',
  Email = 'contact_email_export',
  Mailer = 'contact_joint_export'
}

export interface DownloadType {
  title: string
  description: string
  type: ExportType
}

export const DOWNLOAD_TYPES_DROPDOWN_ITEMS: DownloadType[] = [
  {
    title: 'Export For Mailers',
    description: 'Use this for print campaigns, like importing into XpressDocs',
    type: ExportType.Mailer
  },
  {
    title: 'Export For E-mail',
    description: 'Use this for email campaigns, like importing into Rezora',
    type: ExportType.Email
  },
  {
    title: 'Full Export',
    description: 'Download everything, all your contact fields',
    type: ExportType.Full
  }
]
