import {
  SET_GALLERY_ITEMS,
  TOGGLE_MEDIA_SELECTION,
  SET_MEDIA_NAME,
  TOGGLE_GALLERY_SELECTION,
  ADD_MEDIA
} from './action-types'
import { IMediaGallery } from '../types'

export const setGalleryItems = (gallery: IMediaGallery) => ({
  type: SET_GALLERY_ITEMS,
  payload: {
    gallery
  }
})

export const toggleMediaSelection = (file: string) => ({
  type: TOGGLE_MEDIA_SELECTION,
  payload: {
    file
  }
})

export const setMediaName = (file: string, name: string) => ({
  type: SET_MEDIA_NAME,
  payload: {
    file,
    name
  }
})

export const toggleGallerySelection = (selected: boolean) => ({
  type: TOGGLE_GALLERY_SELECTION,
  payload: {
    selected
  }
})

export const addMedia = (files: []) => ({
  type: ADD_MEDIA,
  payload: {
    files
  }
})
