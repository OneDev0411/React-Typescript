import IconMailer from 'components/SvgIcons/Export/IconMailer'
import IconEmail from 'components/SvgIcons/Export/IconEmail'
import IconFull from 'components/SvgIcons/Export/IconFull'

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
  icon: React.ReactNode
}

export const DOWNLOAD_TYPES_DROPDOWN_ITEMS: DownloadType[] = [
  {
    title: 'Export For Mailers',
    description: 'Use this for print campaigns, like importing into XpressDocs',
    type: ExportType.Mailer,
    icon: IconMailer
  },
  {
    title: 'Export For Email',
    description: 'Use this for email campaigns, like importing into Rezora',
    type: ExportType.Email,
    icon: IconEmail
  },
  {
    title: 'Full Export',
    description: 'Download everything, all your contact fields',
    type: ExportType.Full,
    icon: IconFull
  }
]
