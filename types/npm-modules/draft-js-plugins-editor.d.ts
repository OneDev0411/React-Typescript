declare module 'draft-js-plugins-editor' {
  import { Editor as DraftEditor } from 'draft-js'
  import * as React from 'react'
  import EditorState = Draft.Model.ImmutableData.EditorState

  export default class Editor extends React.Component<DraftEditor['props']> {
    getEditorState(): EditorState

    editor: DraftEditor

    focus()
  }

  export function composeDecorators(...decorators: any[]): any
}
