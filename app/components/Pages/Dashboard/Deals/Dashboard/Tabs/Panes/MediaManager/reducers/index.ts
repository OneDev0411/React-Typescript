import {
  SET_GALLERY_ITEMS,
  TOGGLE_MEDIA_SELECTION,
  SET_MEDIA_NAME,
  TOGGLE_GALLERY_SELECTION,
  ADD_MEDIA
} from './action-types'

import { IMediaGallery } from '../types'

export const initialState: IMediaGallery = []

export function reducer(state: IMediaGallery, action: any): IMediaGallery {
  switch (action.type) {
    case SET_GALLERY_ITEMS: {
      const { gallery } = action.payload
      return gallery
    }

    case TOGGLE_MEDIA_SELECTION: {
      const { file } = action.payload

      const newState = state.map(media => {
        if (media.file === file) {
          let selected = media.selected

          return { ...media, selected: !selected }
        }

        return media
      })

      return newState
    }
    case SET_MEDIA_NAME: {
      const { file, name } = action.payload

      const newState = state.map(media => {
        if (media.file === file) {
          return { ...media, name }
        }

        return media
      })

      return newState
    }

    case TOGGLE_GALLERY_SELECTION: {
      const { selected } = action.payload

      const newState = state.map(media => {
        return { ...media, selected }
      })

      return newState
    }

    case ADD_MEDIA: {
      const { files } = action.payload

      const newMedia = files.map((file: any) => {
        let formattedFile = {
          file: file.name,
          src: file.preview,
          name: 'Description',
          order: 1,
          selected: false,
          isNew: true
        }

        return formattedFile
      })

      return [...newMedia, ...state]
    }

    default:
      return state
  }
}
