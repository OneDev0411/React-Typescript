declare module 'draft-js-plugins-editor' {
  import Draft, {
    Editor as DraftEditor,
    EditorState,
    DraftEditorProps
  } from 'draft-js'
  import * as React from 'react'
  import { RefObject } from 'react'

  export default class Editor extends React.Component<DraftEditorProps> {
    getEditorState(): EditorState

    editor: DraftEditor

    focus()
  }

  export interface PluginFunctions {
    getPlugins(): any[]
    getProps: any[]
    setEditorState(editorState: EditorState): void
    getEditorState(): EditorState
    getReadOnly(): boolean
    setReadOnly(readonly: Readonly): void
    getEditorRef(): RefObject<DraftEditor>
  }
  export function composeDecorators(...decorators: any[]): any
}
