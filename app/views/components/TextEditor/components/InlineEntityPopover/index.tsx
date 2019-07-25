import { EditorState } from 'draft-js'
import { getSelectionEntity } from 'draftjs-utils'

import * as React from 'react'
import { ReactNode, useCallback, useEffect, useState } from 'react'

import { Popper, useTheme } from '@material-ui/core'
import { isEqual } from 'lodash'

import usePrevious from 'react-use/lib/usePrevious'

import { getSelectionAnchorElement } from '../LinkEditorPopover/utils'
import { Entity } from '../../types'

interface RenderProps {
  entity: Entity
  close: () => void
}

interface Props {
  editorState: EditorState
  entityFilter: string | ((entity: Entity) => boolean)
  children: (renderProps: RenderProps) => ReactNode
}

export function InlineEntityPopover({
  editorState,
  entityFilter,
  children
}: Props) {
  const entityKey: string = getSelectionEntity(editorState)

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

  if (entityKey === undefined) {
    return null
  }

  const entity = editorState.getCurrentContent().getEntity(entityKey)

  const anchorEl = getSelectionAnchorElement()

  const conditionFn =
    typeof entityFilter === 'string'
      ? (entity: Entity) => entity.getType() === entityFilter
      : entityFilter

  if (conditionFn(entity) && anchorEl) {
    return (
      <Popper
        open={!closed}
        anchorEl={anchorEl}
        placement="bottom-start"
        style={{ zIndex: theme.zIndex.modal }}
      >
        {children({ entity, close })}
      </Popper>
    )
  }

  return null
}
