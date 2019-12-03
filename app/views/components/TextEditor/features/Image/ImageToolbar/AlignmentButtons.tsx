import { IconButton, Tooltip } from '@material-ui/core'

import React from 'react'

import { ContentBlock, EditorState } from 'draft-js'

import IconAlignDefault from 'components/SvgIcons/AlignDefault/IconAlignDefault'
import IconAlignLeft from 'components/SvgIcons/AlignLeft/IconAlignLeft'
import IconAlignCenter from 'components/SvgIcons/AlignCenter/IconAlignCenter'
import IconAlignRight from 'components/SvgIcons/AlignRight/IconAlignRight'

import { AtomicBlockEntityData } from '../../../types'
import { getSelectedAtomicBlock } from '../../../utils/get-selected-atomic-block'
import { updateAtomicBlockEntityData } from '../../../modifiers/update-atomic-block-entity-data'
import { getAtomicBlockEntityData } from '../../../utils/get-atomic-block-entity-data'
import { useToolbarIconClass } from '../../../hooks/use-toolbar-icon-class'

type Alignment = AtomicBlockEntityData['alignment']

const alignmentButton = [
  {
    icon: IconAlignDefault,
    alignment: 'default' as Alignment,
    tooltip: 'Default'
  },
  {
    icon: IconAlignLeft,
    alignment: 'left' as Alignment,
    tooltip: 'Inline with text (Left)'
  },
  {
    icon: IconAlignCenter,
    alignment: 'center' as Alignment,
    tooltip: 'Center'
  },
  {
    icon: IconAlignRight,
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

  const iconClassNames = useToolbarIconClass()

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
      {alignmentButton.map(({ alignment, tooltip, icon: Icon }, index) => (
        <Tooltip key={index} title={tooltip}>
          <IconButton
            size="small"
            onClick={() => setAlignment(alignment)}
            edge={index === alignmentButton.length - 1 && 'end'}
            color={currentAlignment === alignment ? 'primary' : undefined}
          >
            <Icon className={iconClassNames} />
          </IconButton>
        </Tooltip>
      ))}
    </>
  )
}
