import arrayMove from 'array-move'

import * as actionTypes from '../actions/action-types'

export const initialState: IMediaGallery = []

// TODO: Implement inversion of control for the reducer functions
// function setMediaValue<O extends IMediaItem, K extends keyof IMediaItem>(
//   state: IMediaGallery,
//   file: IMediaItem['file'],
//   key: K,
//   value: O[K]
// ) {
//   const newState = state.map(media => {
//     if (media.file === file) {
//       media[key] = value
//     }
//     return media
//   })

//   return newState
// }

export function reducer(state: IMediaGallery, action: any): IMediaGallery {
  switch (action.type) {
    case actionTypes.SET_GALLERY_ITEMS: {
      const { gallery } = action.payload

      return gallery
    }

    case actionTypes.TOGGLE_MEDIA_SELECTION: {
      const { id } = action.payload

      const newState = state.map(media => {
        if (media.id === id && !media.isUploading) {
          return { ...media, selected: !media.selected }
        }

        return media
      })

      return newState
    }

    case actionTypes.SET_MEDIA_NAME: {
      const { id, name } = action.payload

      const newState = state.map(media => {
        if (media.id === id) {
          return { ...media, name }
        }

        return media
      })

      return newState
    }

    case actionTypes.TOGGLE_GALLERY_SELECTION: {
      const { selected } = action.payload

      const newState = state.map(media => {
        return { ...media, selected: media.isUploading ? false : selected }
      })

      return newState
    }

    case actionTypes.ADD_MEDIA: {
      const { fileObject, order = 0 } = action.payload

      return [
        {
          id: fileObject.name,
          src: fileObject.preview,
          name: '',
          order,
          selected: false,
          isUploading: true,
          uploadProgress: 0
        },
        ...state
      ]
    }

    case actionTypes.SET_MEDIA_AS_UPLOADED: {
      const { id } = action.payload

      const newState = state.map(media => {
        if (media.id === id) {
          return { ...media, isUploading: false }
        }

        return media
      })

      return newState
    }

    case actionTypes.DELETE_MEDIA: {
      const { id } = action.payload

      const newState = state.filter(media => {
        return media.id !== id
      })

      return newState
    }

    case actionTypes.DELETE_MEDIAS: {
      const { ids } = action.payload

      const newState = state.filter(media => {
        return !ids.includes(media.id)
      })

      return newState
    }

    case actionTypes.SET_MEDIA_UPLOAD_PROGRESS: {
      const { id, progress } = action.payload

      const newState = state.map(media => {
        if (media.id === id) {
          return { ...media, uploadProgress: progress }
        }

        return media
      })

      return newState
    }

    case actionTypes.REORDER_GALLERY: {
      const { oldIndex, newIndex } = action.payload

      const newState = arrayMove(state, oldIndex, newIndex)

      return newState.map((media, index) => {
        return {
          ...media,
          order: index
        }
      })
    }

    case actionTypes.SET_NEWLY_UPLOADED_MEDIA_FIELDS: {
      const { id, newId, src, name } = action.payload

      const newState = state.map(media => {
        if (media.id === id) {
          return { ...media, id: newId, src, name }
        }

        return media
      })

      return newState
    }

    default:
      return state
  }
}
