declare module 'draft-js-plugins-editor' {
  import { Editor as DraftEditor } from 'draft-js'
  import * as React from 'react'
  import EditorState = Draft.Model.ImmutableData.EditorState
  import { RefObject } from 'react'

  export default class Editor extends React.Component<DraftEditor['props']> {
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
