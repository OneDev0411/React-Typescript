import React from 'react'
import { Box, Grid, IconButton, Tooltip, Typography } from '@material-ui/core'

import { EditorState } from 'draft-js'

import copyTextToClipboard from 'utils/copy-text-to-clipboard'

import IconLinkOpen from 'components/SvgIcons/LinkOpen/IconLink'
import EditIcon from 'components/SvgIcons/Edit/EditIcon'
import IconUnlink from 'components/SvgIcons/Unlink/IconUnlink'
import IconCopy from 'components/SvgIcons/Copy/IconCopy'
import IconEmail from 'components/SvgIcons/Email/IconEmail'

import { removeLink } from '../../../utils/remove-link'
import { useToolbarIconClass } from '../../../hooks/use-toolbar-icon-class'
import { SelectionPopoverPaper } from '../../../components/SelectionPopoverPaper'

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

  const LinkIcon = props.url.match(/^mailto:.+/) ? IconEmail : IconLinkOpen

  const iconClassNames = useToolbarIconClass()

  return (
    <SelectionPopoverPaper style={{ width: '18rem' }}>
      <Grid container alignItems="center" wrap="nowrap">
        <LinkIcon className={iconClassNames} />
        {/*
        // @ts-ignore typing doesn't work for Box props */}
        <Typography noWrap component={Box} flexGrow={1} pl={1}>
          <a href={props.url} target="_blank">
            {props.url}
          </a>
        </Typography>
        <Tooltip title="Copy Link">
          <IconButton size="small" onClick={copyLink}>
            <IconCopy className={iconClassNames} />
          </IconButton>
        </Tooltip>
        <Tooltip title="Edit Link">
          <IconButton size="small" onClick={props.onEdit}>
            <EditIcon className={iconClassNames} />
          </IconButton>
        </Tooltip>
        <Tooltip title="Remove Link">
          <IconButton size="small" onClick={unlink}>
            <IconUnlink className={iconClassNames} />
          </IconButton>
        </Tooltip>
      </Grid>
    </SelectionPopoverPaper>
  )
}
