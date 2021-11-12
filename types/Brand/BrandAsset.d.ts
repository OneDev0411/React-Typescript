declare interface IBrandAsset extends IModel<'brand_asset'> {
  brand: UUID
  label: string
  file: IFile
  medium: Nullable<IMarketingTemplateMedium>
  template_type: Nullable<IMarketingTemplateType>
}
