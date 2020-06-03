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

export const getSelectableMedia = (
  mediaGallery: IMediaGallery
): IMediaGallery => {
  return mediaGallery.filter(media => !media.isNew)
}

export const getSelectedMediaIds = (mediaGallery: IMediaGallery): string[] => {
  return mediaGallery.map(media => media.file)
}

export const getMediaSorts = (mediaGallery: IMediaGallery) => {
  return mediaGallery.map(media => {
    return {
      id: media.file,
      order: media.order
    }
  })
}
