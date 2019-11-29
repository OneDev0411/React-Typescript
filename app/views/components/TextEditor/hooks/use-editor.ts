import { useContext } from 'react'

import { EditorContext } from '..'

import { EditorContextApi } from '../types'

export function useEditor(): EditorContextApi {
  return useContext(EditorContext)
}
