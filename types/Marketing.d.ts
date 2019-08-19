declare type IMarketingTemplate = {
  id: UUID
  created_at: number
  name: string
  brand: null
  template_type: string
  deleted_at: null
  medium: string
  video: boolean
  url: string
  variant: string
  inputs: string[]
  type: 'template'
  updated_at: number
}

declare type IMarketingTemplateInstance<
  Associations extends 'contacts' | 'deals' | 'listings' | 'template' = ''
> = {
  id: UUID
  created_at: number
  html: string
  file: File
  created_by: string
  branch: string
  updated_at: number
  deleted_at: null
  type: 'template_instance'
} & Association<'contacts', IContact[], Associations> &
  Association<'deals', IDeal[], Associations> &
  AssociationL<'listings', any, Associations> &
  Association<'template', IMarketingTemplate, Associations>

interface File {
  id: UUID
  created_at: number
  updated_at: number
  deleted_at: null
  created_by: string
  path: string
  name: string
  public: boolean
  type: string
  url: string
  preview_url: string
  mime: string
}
