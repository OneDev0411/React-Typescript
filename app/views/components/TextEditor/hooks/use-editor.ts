import { useContext } from 'react'

import { EditorContextApi } from '../types'
import { EditorContext } from '../editor-context'

export function useEditor(): EditorContextApi {
  return useContext(EditorContext)
}
