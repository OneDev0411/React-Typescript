declare interface IMediaItem {
  file: string
  src: string
  name: string
  order: number
  selected?: boolean
  uploadProgress?: number | undefined
  isNew?: boolean
}

declare type IMediaGallery = IMediaItem[]

declare interface IMediaManagerContext {
  state: IMediaGallery
  dispatch: React.Dispatch<any>
}
