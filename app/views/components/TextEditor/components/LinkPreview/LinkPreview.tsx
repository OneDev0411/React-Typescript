import { Grid, IconButton, Tooltip } from '@material-ui/core'
import * as React from 'react'

import { EditorState } from 'draft-js'

import copyTextToClipboard from 'utils/copy-text-to-clipboard'

import IconLinkOpen from 'components/SvgIcons/LinkOpen/IconLink'
import EditIcon from 'components/SvgIcons/Edit/EditIcon'
import IconUnlink from 'components/SvgIcons/Unlink/IconUnlink'
import IconCopy from 'components/SvgIcons/Copy/IconCopy'
import IconEmail from 'components/SvgIcons/Email/IconEmail'

import { removeLink } from '../../utils/remove-link'
import { LinkPreviewContainer, LinkText } from './styled'

interface Props {
  url: string
  onEdit: () => void
  editorState: EditorState
  setEditorState: (editorState: EditorState) => void
  onClose: () => void
}

const iconSizeProps = {
  noStyles: true,
  style: { width: 18, minWidth: 18, height: 18, margin: 4 }
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

  return (
    <LinkPreviewContainer
      elevation={10}
      onMouseDown={e => {
        e.preventDefault()
        e.stopPropagation()
      }}
    >
      <Grid container alignItems="center" wrap="nowrap">
        <LinkIcon {...iconSizeProps} />
        <LinkText flexGrow={1} pl={1}>
          <a href={props.url} target="_blank">
            {props.url}
          </a>
        </LinkText>
        <Tooltip title="Copy Link">
          <IconButton size="small" onClick={copyLink}>
            <IconCopy {...iconSizeProps} />
          </IconButton>
        </Tooltip>
        <Tooltip title="Edit Link">
          <IconButton size="small" onClick={props.onEdit}>
            <EditIcon {...iconSizeProps} />
          </IconButton>
        </Tooltip>
        <Tooltip title="Remove Link">
          <IconButton size="small" onClick={unlink} edge="end">
            <IconUnlink {...iconSizeProps} />
          </IconButton>
        </Tooltip>
      </Grid>
    </LinkPreviewContainer>
  )
}
