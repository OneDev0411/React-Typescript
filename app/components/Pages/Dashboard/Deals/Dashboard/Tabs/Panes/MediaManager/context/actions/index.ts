import {
  reorderGallery as reorderGalleryModel,
  renameMedia as renameMediaModel
} from 'models/media-manager'

import * as actionTypes from './action-types'
import { getMediaSorts } from '../helpers/selectors'

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

export const renameMedia = (
  file: string,
  name: string,
  dealId: IDeal['id']
) => async (dispatch: React.Dispatch<any>) => {
  dispatch({
    type: actionTypes.SET_MEDIA_NAME,
    payload: {
      file,
      name
    }
  })

  await renameMediaModel(dealId, file, name)
}

export const toggleGallerySelection = (selected: boolean) => ({
  type: actionTypes.TOGGLE_GALLERY_SELECTION,
  payload: {
    selected
  }
})

export const addMedia = ({
  file: fileObject,
  order = 0
}: {
  file: {}
  order?: number
}) => ({
  type: actionTypes.ADD_MEDIA,
  payload: {
    fileObject,
    order
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

export const setMediaUploadProgress = (file: string, progress: number) => ({
  type: actionTypes.SET_MEDIA_UPLOAD_PROGRESS,
  payload: {
    file,
    progress
  }
})

export const reorderGallery = (
  oldIndex: number,
  newIndex: number,
  dealId: IDeal['id']
) => async (dispatch: React.Dispatch<any>, getState: () => IMediaGallery) => {
  dispatch({
    type: actionTypes.REORDER_GALLERY,
    payload: {
      oldIndex,
      newIndex
    }
  })
  reorderGalleryModel(dealId, getMediaSorts(getState()))
}

export const setNewlyUploadedMediaFields = (
  file: string,
  newId: string,
  src: string,
  name: string
) => ({
  type: actionTypes.SET_NEWLY_UPLOADED_MEDIA_FIELDS,
  payload: {
    file,
    newId,
    src,
    name
  }
})
