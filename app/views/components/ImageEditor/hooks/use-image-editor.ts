import { useContext } from 'react'

import { ImageEditorContext } from '../context'

export function useImageEditor() {
  return useContext(ImageEditorContext)
}
