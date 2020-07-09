import React from 'react'
import { ContentBlock, EditorState } from 'draft-js'
import { IconButton, Tooltip } from '@material-ui/core'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'
import { muiIconSizes } from 'components/SvgIcons/icon-sizes'
import {
  imageAlignLeft,
  imageAlignRight,
  imageAlignCenter,
  imageAlignDefault
} from 'components/SvgIcons/icons'

import { AtomicBlockEntityData } from '../../../types'
import { getSelectedAtomicBlock } from '../../../utils/get-selected-atomic-block'
import { updateAtomicBlockEntityData } from '../../../modifiers/update-atomic-block-entity-data'
import { getAtomicBlockEntityData } from '../../../utils/get-atomic-block-entity-data'

type Alignment = AtomicBlockEntityData['alignment']

const alignmentButton = [
  {
    icon: imageAlignDefault,
    alignment: 'default' as Alignment,
    tooltip: 'Default'
  },
  {
    icon: imageAlignLeft,
    alignment: 'left' as Alignment,
    tooltip: 'Inline with text (Left)'
  },
  {
    icon: imageAlignCenter,
    alignment: 'center' as Alignment,
    tooltip: 'Center'
  },
  {
    icon: imageAlignRight,
    alignment: 'right' as Alignment,
    tooltip: 'Inline with text (Right)'
  }
]

interface Props {
  editorState: EditorState
  onChange: (editorState: EditorState) => void
  /**
   * By default, the currently selected atomic block will be used, but this can
   * override it.
   */
  block: ContentBlock | null
}

export function BlockAlignmentButtons({ block, editorState, onChange }: Props) {
  const targetBlock = block || getSelectedAtomicBlock(editorState)
  const blockEntityData: AtomicBlockEntityData =
    (targetBlock &&
      getAtomicBlockEntityData(editorState.getCurrentContent(), targetBlock)) ||
    {}
  const currentAlignment = blockEntityData.alignment || 'default'

  const setAlignment = (alignment: Alignment) => {
    if (targetBlock) {
      onChange(
        updateAtomicBlockEntityData(editorState, targetBlock, {
          alignment
        })
      )
    }
  }

  return (
    <>
      {alignmentButton.map(({ alignment, tooltip, icon }, index) => (
        <Tooltip key={index} title={tooltip}>
          <IconButton
            size="small"
            onClick={() => setAlignment(alignment)}
            edge={index === alignmentButton.length - 1 && 'end'}
            color={currentAlignment === alignment ? 'primary' : undefined}
          >
            <SvgIcon path={icon} size={muiIconSizes.small} />
          </IconButton>
        </Tooltip>
      ))}
    </>
  )
}
