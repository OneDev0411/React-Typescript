export const getUploadedMedia = (
  mediaGallery: IMediaGallery
): IMediaGallery => {
  return mediaGallery.filter(media => !media.isUploading)
}

export const getSelectedMedia = (
  mediaGallery: IMediaGallery
): IMediaGallery => {
  return mediaGallery.filter(media => media.selected)
}

export const getSelectableMedia = (
  mediaGallery: IMediaGallery
): IMediaGallery => {
  return mediaGallery.filter(media => !media.isUploading)
}

export const getSelectedMediaIds = (mediaGallery: IMediaGallery): UUID[] => {
  return mediaGallery.map(media => media.id)
}

export const getMediaSorts = (mediaGallery: IMediaGallery) => {
  return mediaGallery.map(media => {
    return {
      id: media.id,
      order: media.order
    }
  })
}
