import { ContentBlock, EditorState } from 'draft-js'
import { getSelectionEntity } from 'draftjs-utils'

import * as React from 'react'
import { ReactNode, useCallback, useEffect, useState } from 'react'

import { Popper, useTheme } from '@material-ui/core'
import { isEqual } from 'lodash'

import usePrevious from 'react-use/lib/usePrevious'

import { PopperPlacementType } from '@material-ui/core/Popper'

import {
  getBlockElement,
  getSelectionAnchorElement
} from '../LinkEditorPopover/utils'
import { Entity } from '../../types'
import { getSelectedAtomicBlock } from '../../utils/get-selected-atomic-block'

interface RenderProps {
  entity: Entity | null
  block: ContentBlock | null
  close: () => void
}

interface Props {
  editorState: EditorState
  /**
   * Determines if the popover should be shown based on entity of the currently
   * selected content. It can be an entityKey or any boolean-returning function
   * which receives the entity for the currently selected content
   */
  inlineEntityFilter: string | ((entity: Entity) => boolean)
  /**
   * Determines if the popover should be shown based on the currently selected
   * block. It can be a block type (string) or any boolean-returning function
   * which receives the currently selected block
   */
  blockFilter?: string | ((block: ContentBlock) => boolean)
  children: (renderProps: RenderProps) => ReactNode
}

/**
 * shows a popup over the selection based on selection state
 * @param editorState
 * @param entityFilter
 * @param children
 * @constructor
 */
export function DraftJsSelectionPopover({
  editorState,
  inlineEntityFilter,
  blockFilter,
  children
}: Props) {
  const selectedEntityKey: string = getSelectionEntity(editorState)
  const selectedBlock = getSelectedAtomicBlock(editorState)

  const entity = selectedEntityKey
    ? editorState.getCurrentContent().getEntity(selectedEntityKey)
    : null

  const theme = useTheme()

  const [closed, setClosed] = useState(false)

  const close = useCallback(() => setClosed(true), [])

  const previousEditorState = usePrevious(editorState)

  const selectionChanged =
    previousEditorState &&
    !isEqual(
      previousEditorState.getSelection().toJS(),
      editorState.getSelection().toJS()
    )

  useEffect(() => {
    if (closed && editorState !== previousEditorState && selectionChanged) {
      setClosed(false)
    }
  }, [previousEditorState, editorState, closed, selectionChanged])

  const inlineEntityFilterFn = normalizeFilter(inlineEntityFilter)
  const blockFilterFn = normalizeFilter(blockFilter)

  const conditionIsMet =
    (entity && inlineEntityFilterFn(entity)) ||
    (selectedBlock && blockFilterFn(selectedBlock))

  /**
   * We show the popup only if selection is changed ever
   */
  if (selectionChanged && conditionIsMet) {
    const selectedBlock = getSelectedAtomicBlock(editorState)

    const anchorEl = selectedBlock
      ? getBlockElement(selectedBlock)
      : getSelectionAnchorElement()

    const placement: PopperPlacementType = selectedBlock
      ? 'bottom'
      : 'bottom-start'

    return (
      anchorEl && (
        <Popper
          open={!closed}
          anchorEl={anchorEl}
          placement={placement}
          style={{ zIndex: theme.zIndex.modal }}
        >
          {children({ entity, block: selectedBlock || null, close })}
        </Popper>
      )
    )
  }

  return null
}

interface Typed {
  getType(): string
}

function normalizeFilter(
  filter: string | ((input: Typed) => boolean) | undefined
): (input: Typed) => boolean {
  return typeof filter === 'string'
    ? (input: Typed) => input.getType() === filter
    : filter || (() => false)
}
