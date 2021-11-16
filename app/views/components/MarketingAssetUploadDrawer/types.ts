export type DrawerStep = 'upload' | 'teams'

export interface Asset {
  file: {
    object: File
    url: string
    isUploaded?: boolean
    uploadProgress?: number
  }
  label: string
  medium: IMarketingTemplateMedium
  templateType?: IMarketingTemplateType
}

export interface AssetsUploadFormData {
  assets: Asset[]
  brand: IBrand
}
