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

export const toggleMediaSelection = (id: UUID) => ({
  type: actionTypes.TOGGLE_MEDIA_SELECTION,
  payload: {
    id
  }
})

export const renameMedia = (
  id: UUID,
  name: string,
  dealId: IDeal['id']
) => async (dispatch: React.Dispatch<any>) => {
  dispatch({
    type: actionTypes.SET_MEDIA_NAME,
    payload: {
      id,
      name
    }
  })

  await renameMediaModel(dealId, id, name)
}

export const toggleGallerySelection = (selected: boolean) => ({
  type: actionTypes.TOGGLE_GALLERY_SELECTION,
  payload: {
    selected
  }
})

export const addMedia = ({
  fileObject,
  order = 0
}: {
  fileObject: {}
  order?: number
}) => ({
  type: actionTypes.ADD_MEDIA,
  payload: {
    fileObject,
    order
  }
})

export const setMediaAsUploaded = (id: UUID) => ({
  type: actionTypes.SET_MEDIA_AS_UPLOADED,
  payload: {
    id
  }
})

export const deleteMedia = (id: UUID) => ({
  type: actionTypes.DELETE_MEDIA,
  payload: {
    id
  }
})

export const deleteMedias = (ids: UUID[]) => ({
  type: actionTypes.DELETE_MEDIAS,
  payload: {
    ids
  }
})

export const setMediaUploadProgress = (id: UUID, progress: number) => ({
  type: actionTypes.SET_MEDIA_UPLOAD_PROGRESS,
  payload: {
    id,
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
  id: UUID,
  newId: UUID,
  src: string
) => ({
  type: actionTypes.SET_NEWLY_UPLOADED_MEDIA_FIELDS,
  payload: {
    id,
    newId,
    src
  }
})
