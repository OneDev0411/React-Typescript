import React from 'react'
import { EditorState } from 'draft-js'

import {
  DraftJsSelectionPopover,
  SelectionPopoverRenderProps
} from '../../../components/DraftJsSelectionPopover'
import { ImageToolbar } from '../ImageToolbar'
import { SelectionPopoverPaper } from '../../../components/SelectionPopoverPaper'

interface Props {
  editorState: EditorState
  setEditorState: (editorState: EditorState) => void
}

/**
 * A wrapper around {@link ImageToolbar} which provides it as an inline toolbar
 * to be shown on top of atomic blocks (currently images)
 * @param props
 * @constructor
 */
export function InlineImageToolbar(props: Props) {
  return (
    <DraftJsSelectionPopover
      editorState={props.editorState}
      blockFilter="atomic"
      placement="top"
    >
      {({ block, close, entity }: SelectionPopoverRenderProps) => {
        return (
          <SelectionPopoverPaper>
            <ImageToolbar
              editorState={props.editorState}
              onChange={props.setEditorState}
              block={block}
            />
          </SelectionPopoverPaper>
        )
      }}
    </DraftJsSelectionPopover>
  )
}
