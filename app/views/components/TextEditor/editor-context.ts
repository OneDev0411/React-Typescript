import { createContext, createRef } from 'react'

import { EditorContextApi, EditorToolbarContextApi } from './types'

const editorContextMethodStub = () => {
  throw new Error(
    'Editor context is meant to be used within the editor. You are probably using a Feature Component outside the editor'
  )
}
export const EditorContext = createContext<EditorContextApi>({
  addPlugins: editorContextMethodStub,
  editorRef: createRef(),
  editorState: null as any, // We can provide exception throwing getter instead
  addDropzonePropsInterceptor: editorContextMethodStub,
  setEditorState: editorContextMethodStub
})
const editorToolbarContextMethodStub = () => {
  throw new Error(
    'Editor Toolbar context is meant to be used within the editor. You are probably using ToolbarFragment outside the editor'
  )
}
export const EditorToolbarContext = createContext<EditorToolbarContextApi>({
  createToolbarFragment: editorToolbarContextMethodStub
})
