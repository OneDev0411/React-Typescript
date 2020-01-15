export interface IMediaItem {
  file: string
  src: string
  name: string
  selected: boolean
  order: number
  uploadProgress?: number | undefined
  isNew?: boolean
}

export interface IMediaGallery extends Array<IMediaItem> {}

export interface IMediaManagerAPI {
  state: IMediaGallery
  dispatch: React.Dispatch<any>
}
