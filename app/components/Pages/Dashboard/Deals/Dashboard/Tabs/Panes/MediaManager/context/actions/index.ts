import * as actionTypes from './action-types'
import { IMediaGallery } from '../../types'

export const setGalleryItems = (gallery: IMediaGallery) => ({
  type: actionTypes.SET_GALLERY_ITEMS,
  payload: {
    gallery
  }
})

export const toggleMediaSelection = (file: string) => ({
  type: actionTypes.TOGGLE_MEDIA_SELECTION,
  payload: {
    file
  }
})

export const setMediaName = (file: string, name: string) => ({
  type: actionTypes.SET_MEDIA_NAME,
  payload: {
    file,
    name
  }
})

export const toggleGallerySelection = (selected: boolean) => ({
  type: actionTypes.TOGGLE_GALLERY_SELECTION,
  payload: {
    selected
  }
})

export const addMedia = (file: {}) => ({
  type: actionTypes.ADD_MEDIA,
  payload: {
    file
  }
})

export const setMediaAsUploaded = (file: string) => ({
  type: actionTypes.SET_MEDIA_AS_UPLOADED,
  payload: {
    file
  }
})

export const deleteMedia = (file: string) => ({
  type: actionTypes.DELETE_MEDIA,
  payload: {
    file
  }
})

export const deleteMedias = (files: string[]) => ({
  type: actionTypes.DELETE_MEDIAS,
  payload: {
    files
  }
})
