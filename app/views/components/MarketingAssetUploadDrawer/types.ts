export type DrawerStep = 'upload' | 'teams'

export interface Asset {
  file: {
    object: File
    url: string
  }
  label: string
  medium?: IMarketingTemplateMedium
  templateType?: IMarketingTemplateType
}

export interface AssetsUploadFormData {
  assets: Asset[]
  brands: UUID[]
}
