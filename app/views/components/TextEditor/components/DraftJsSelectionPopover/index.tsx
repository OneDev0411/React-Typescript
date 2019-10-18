import { ContentBlock, EditorState } from 'draft-js'
import { getSelectionEntity } from 'draftjs-utils'

import * as React from 'react'
import { ReactNode, useCallback, useEffect, useState } from 'react'

import { Popper, useTheme } from '@material-ui/core'
import { isEqual } from 'lodash'

import usePrevious from 'react-use/lib/usePrevious'

import { getSelectionAnchorElement } from '../LinkEditorPopover/utils'
import { Entity } from '../../types'
import { getSelectedBlock } from '../../utils/get-selected-block'

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
  const selectedBlock = getSelectedBlock(editorState)

  const entity = selectedEntityKey
    ? editorState.getCurrentContent().getEntity(selectedEntityKey)
    : null

  const theme = useTheme()

  const [closed, setClosed] = useState(false)

  const close = useCallback(() => setClosed(true), [])

  const previousEditorState = usePrevious(editorState)

  useEffect(() => {
    if (
      closed &&
      editorState !== previousEditorState &&
      previousEditorState &&
      !isEqual(
        previousEditorState.getSelection().toJS(),
        editorState.getSelection().toJS()
      )
    ) {
      setClosed(false)
    }
  }, [previousEditorState, editorState, closed])

  const inlineEntityFilterFn = normalizeFilter(inlineEntityFilter)
  const blockFilterFn = normalizeFilter(blockFilter)

  const shouldRender =
    (entity && inlineEntityFilterFn(entity)) ||
    (selectedBlock && blockFilterFn(selectedBlock))

  if (shouldRender) {
    const anchorEl = getSelectionAnchorElement()

    return (
      anchorEl && (
        <Popper
          open={!closed}
          anchorEl={anchorEl}
          placement="bottom-start"
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
