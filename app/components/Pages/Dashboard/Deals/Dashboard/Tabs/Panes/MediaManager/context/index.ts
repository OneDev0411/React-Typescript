import { createContext } from 'react'
import { IMediaManagerAPI, IMediaGallery } from '../types'

export const MediaManagerAPI = createContext<IMediaManagerAPI>({
  state: [],
  dispatch: () => {}
})

export function toggleMediaSelection(state: IMediaGallery, file: string) {
  const newState = state.map(media => {
    if (media.file === file) {
      let selected = media.selected

      return { ...media, selected: !selected }
    }

    return media
  })

  return newState
}

export function setMediaName(state: IMediaGallery, file: string, name: string) {
  const newState = state.map(media => {
    if (media.file === file) {
      return { ...media, name }
    }

    return media
  })

  return newState
}

export function toggleGallerySelection(
  state: IMediaGallery,
  selected: boolean
) {
  const newState = state.map(media => {
    return { ...media, selected }
  })

  return newState
}

export function getSelectedItems(state: IMediaGallery) {
  return state.filter(item => item.selected)
}
