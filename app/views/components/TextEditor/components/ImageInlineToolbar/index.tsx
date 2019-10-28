import React from 'react'
import { createStyles, makeStyles, Paper, Theme } from '@material-ui/core'
import { EditorState } from 'draft-js'

import { ClassesProps } from 'utils/ts-utils'

import {
  DraftJsSelectionPopover,
  SelectionPopoverRenderProps
} from '../DraftJsSelectionPopover'
import { ImageToolbar } from '../ImageToolbar'

const styles = (theme: Theme) =>
  createStyles({
    paper: {
      padding: theme.spacing(0.5)
    }
  })
const useStyles = makeStyles(styles, { name: 'AlignmentTool' })

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
export function InlineImageToolbar(props: Props & ClassesProps<typeof styles>) {
  const classes = useStyles(props)

  return (
    <DraftJsSelectionPopover
      editorState={props.editorState}
      blockFilter="atomic"
      placement="top"
    >
      {({ block, close, entity }: SelectionPopoverRenderProps) => {
        return (
          <Paper
            elevation={10}
            className={classes.paper}
            onMouseDown={e => {
              e.preventDefault()
              e.stopPropagation()
            }}
          >
            <ImageToolbar
              editorState={props.editorState}
              onChange={props.setEditorState}
              block={block}
            />
          </Paper>
        )
      }}
    </DraftJsSelectionPopover>
  )
}
