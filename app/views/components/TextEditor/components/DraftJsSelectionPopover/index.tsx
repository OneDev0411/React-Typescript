import React, {
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState
} from 'react'
import { ContentBlock, EditorState } from 'draft-js'
import { getSelectionEntity } from 'draftjs-utils'
import {
  Grow,
  Popper,
  PopperPlacementType,
  PopperProps,
  useTheme
} from '@material-ui/core'
import { isEqual } from 'lodash'
import PopperJs from 'popper.js'
import usePrevious from 'react-use/lib/usePrevious'
import useDeepCompareEffect from 'react-use/lib/useDeepCompareEffect'

import { getSelectionAnchorElement } from '../../features/RichText/LinkEditorPopover/utils'
import { Entity } from '../../types'
import { getSelectedAtomicBlock } from '../../utils/get-selected-atomic-block'
import { getAtomicBlockEntityData } from '../../utils/get-atomic-block-entity-data'
import { getBlockElement } from '../../utils/get-block-element'
import { useAtomicBlockFocusBugDetector } from './use-atomic-block-focus-bug-detector'

export interface SelectionPopoverRenderProps {
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
  inlineEntityFilter?: string | ((entity: Entity) => boolean)
  /**
   * Determines if the popover should be shown based on the currently selected
   * block. It can be a block type (string) or any boolean-returning function
   * which receives the currently selected block
   */
  blockFilter?: string | ((block: ContentBlock) => boolean)

  placement?: PopperProps['placement']
  children:
    | ((renderProps: SelectionPopoverRenderProps) => ReactNode)
    | ReactNode
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
  children,
  ...props
}: Props) {
  const selectedEntityKey: string = getSelectionEntity(editorState)
  const selectedBlock = getSelectedAtomicBlock(editorState, true)

  const entity = selectedEntityKey
    ? editorState.getCurrentContent().getEntity(selectedEntityKey)
    : null

  const theme = useTheme()

  const [closed, setClosed] = useState(false)

  const close = useCallback(() => setClosed(true), [])

  const popperRef = useRef<PopperJs | null>(null)

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

  const blockData =
    (selectedBlock &&
      getAtomicBlockEntityData(
        editorState.getCurrentContent(),
        selectedBlock
      )) ||
    {}

  const isReallyFocused = useAtomicBlockFocusBugDetector(
    selectedBlock,
    editorState
  )

  useDeepCompareEffect(() => {
    if (popperRef.current && blockData) {
      popperRef.current.update()
    }
  }, [blockData, selectedBlock])

  /**
   * We show the popup only if selection is changed ever
   */
  if (conditionIsMet) {
    const selectedBlock = getSelectedAtomicBlock(editorState)

    const anchorEl = selectedBlock
      ? getBlockElement(selectedBlock)
      : getSelectionAnchorElement()

    const placement: PopperPlacementType =
      props.placement || (selectedBlock ? 'bottom' : 'bottom-start')

    return (
      anchorEl && (
        <Popper
          open={!closed && isReallyFocused}
          anchorEl={anchorEl}
          placement={placement}
          popperRef={popperRef}
          transition
          disablePortal
          style={{ zIndex: theme.zIndex.modal }}
        >
          {({ TransitionProps }) => (
            <Grow {...TransitionProps} timeout={150}>
              <div>
                {typeof children === 'function'
                  ? children({ entity, block: selectedBlock || null, close })
                  : children}
              </div>
            </Grow>
          )}
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
  filter: string | ((input: Typed) => boolean) | undefined = () => false
): (input: Typed) => boolean {
  return typeof filter === 'string'
    ? (input: Typed) => input.getType() === filter
    : filter
}
