import { DraftEditorProps } from 'draft-js'

declare module 'draft-js' {
  export class Editor extends React.Component<DraftEditorProps, {}> {
    // Force focus back onto the editor node.
    focus(): void

    // Remove focus from the editor node.
    blur(): void

    /**
     * NOTE: these are not publicly documented in draft-js.
     * Please check for changes if draft.js is updated
     */
    editor: HTMLElement
  }

  export { Draft, EditorState, ContentBlock, convertToRaw }
}
