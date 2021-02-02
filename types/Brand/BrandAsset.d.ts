declare interface IBrandAsset extends IModel<'brand_asset'> {
  brand: UUID
  label: string
  file: IFile
}
