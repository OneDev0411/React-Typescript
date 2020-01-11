export interface IMediaItem {
  file: string
  src: string
  name: string
  selected: boolean
  order: number
  isNew?: boolean
}

export interface IMediaManagerAPI {
  toggleMediaSelection(id: string): void
  toggleGallerySelection(state: boolean): void
  getSelectedItems(): IMediaItem[]
  setMediaName(file: string, name: string): void
  logId(id: string): void
}
