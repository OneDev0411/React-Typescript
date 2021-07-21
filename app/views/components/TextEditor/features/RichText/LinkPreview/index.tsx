import React from 'react'

import { Box, Grid, IconButton, Tooltip, Typography } from '@material-ui/core'
import {
  mdiContentCopy,
  mdiPencilOutline,
  mdiLinkOff,
  mdiLink,
  mdiEmail
} from '@mdi/js'
import { EditorState } from 'draft-js'

import { muiIconSizes } from 'components/SvgIcons/icon-sizes'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'
import copyTextToClipboard from 'utils/copy-text-to-clipboard'

import { SelectionPopoverPaper } from '../../../components/SelectionPopoverPaper'
import { removeLink } from '../../../utils/remove-link'

interface Props {
  url: string
  onEdit: () => void
  editorState: EditorState
  setEditorState: (editorState: EditorState) => void
  onClose: () => void
}

export function LinkPreview(props: Props) {
  const copyLink = () => {
    copyTextToClipboard(props.url)
    props.onClose()
  }

  const unlink = () => {
    const newEditorState = removeLink(props.editorState)

    if (newEditorState) {
      props.setEditorState(newEditorState)
    }

    props.onClose()
  }

  const LinkIcon = props.url.match(/^mailto:.+/) ? mdiEmail : mdiLink

  return (
    <SelectionPopoverPaper style={{ width: '18rem' }}>
      <Grid container alignItems="center" wrap="nowrap">
        <SvgIcon path={LinkIcon} size={muiIconSizes.small} />
        {/*
        // @ts-ignore typing doesn't work for Box props */}
        <Typography noWrap component={Box} flexGrow={1} pl={1}>
          <a href={props.url} target="_blank">
            {props.url}
          </a>
        </Typography>
        <Tooltip title="Copy Link">
          <IconButton size="small" onClick={copyLink}>
            <SvgIcon path={mdiContentCopy} size={muiIconSizes.small} />
          </IconButton>
        </Tooltip>
        <Tooltip title="Edit Link">
          <IconButton size="small" onClick={props.onEdit}>
            <SvgIcon path={mdiPencilOutline} size={muiIconSizes.small} />
          </IconButton>
        </Tooltip>
        <Tooltip title="Remove Link">
          <IconButton size="small" onClick={unlink}>
            <SvgIcon path={mdiLinkOff} size={muiIconSizes.small} />
          </IconButton>
        </Tooltip>
      </Grid>
    </SelectionPopoverPaper>
  )
}
