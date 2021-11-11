export type DrawerStep = 'upload' | 'teams'

export interface Asset {
  file: {
    url: string
    isUploading?: boolean
    uploadProgress?: number
  }
  label?: string
  medium: IMarketingTemplateMedium
  templateType?: IMarketingTemplateType
}

export interface AssetsUploadFormData {
  assets: Asset[]
  brand: IBrand
}
