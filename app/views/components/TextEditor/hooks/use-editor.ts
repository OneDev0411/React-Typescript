import { useContext } from 'react'

import { EditorContext } from '..'

export function useEditor() {
  return useContext(EditorContext)
}
