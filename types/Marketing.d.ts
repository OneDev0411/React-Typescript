declare interface IBrandMarketingTemplate extends IModel<'brand_template'> {
  template: IMarketingTemplate
  brand: UUID
  thumbnail_requested_at: Nullable<number>
  is_thumbnail_ready: Nullable<boolean>
  thumbnail: IFile
  preview: IFile
}

declare interface IMarketingTemplate extends IModel<'template'> {
  name: string
  brand: null
  template_type: string
  deleted_at: null
  medium: string
  video: boolean
  url: string
  variant: string
  inputs: string[]
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
