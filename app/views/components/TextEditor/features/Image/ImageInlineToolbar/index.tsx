import React from 'react'

import { EditorState } from 'draft-js'

import {
  DraftJsSelectionPopover,
  SelectionPopoverRenderProps
} from '../../../components/DraftJsSelectionPopover'
import { SelectionPopoverPaper } from '../../../components/SelectionPopoverPaper'
import { ImageToolbar } from '../ImageToolbar'

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
      blockFilter={block => {
        const blockIsAtomic = block.getType() === 'atomic'
        const { value: firstEntry, done } = block.getData().entries().next()
        const blockIsImage =
          done || (firstEntry[0] !== 'srcDoc' && firstEntry[0] !== 'outerHTML')

        return blockIsAtomic && blockIsImage
      }}
      placement="top"
    >
      {({ block, close, entity }: SelectionPopoverRenderProps) => (
        <SelectionPopoverPaper>
          <ImageToolbar
            editorState={props.editorState}
            onChange={props.setEditorState}
            block={block}
          />
        </SelectionPopoverPaper>
      )}
    </DraftJsSelectionPopover>
  )
}
