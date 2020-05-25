export enum ExportType {
  Full = 'contact_export',
  Email = 'contact_email_export',
  Mailer = 'contact_joint_export'
}

export interface DownloadType {
  title: string
  description: string
  type: ExportType
  icon: React.ReactElement<SVGAElement>
}
