import { IMediaGallery } from '../../types'

export const getUploadedMedia = (
  mediaGallery: IMediaGallery
): IMediaGallery => {
  return mediaGallery.filter(media => !media.isNew)
}

export const getSelectedMedia = (
  mediaGallery: IMediaGallery
): IMediaGallery => {
  return mediaGallery.filter(media => media.selected)
}

export const getSelectedMediaIds = (mediaGallery: IMediaGallery): string[] => {
  return mediaGallery.map(media => media.file)
}
