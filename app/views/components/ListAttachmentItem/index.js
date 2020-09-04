import React from 'react'
import PropTypes from 'prop-types'
import fecha from 'fecha'

import { IconButton, useTheme } from '@material-ui/core'
import { mdiAttachment, mdiClose } from '@mdi/js'

import { TextMiddleTruncate } from 'components/TextMiddleTruncate'

import { SvgIcon } from '../SvgIcons/SvgIcon'

import { DateTime, DeleteIcon, Icon, Item, Title } from './styled'

export function ListAttachmentItem(props) {
  const theme = useTheme()

  return (
    <Item>
      <Icon>
        <SvgIcon path={mdiAttachment} color={theme.palette.common.white} />
      </Icon>

      <div>
        <Title>
          <a target="_blank" href={props.attachment.url}>
            <TextMiddleTruncate text={props.attachment.name} maxLength={25} />
          </a>
        </Title>

        <DateTime>
          Uploaded &nbsp;
          {fecha.format(
            new Date(props.attachment.created_at),
            'MMM DD, h:mm A'
          )}
        </DateTime>
      </div>

      <IconButton
        disabled={!props.isRemovable}
        size="small"
        onClick={() => props.onDelete(props.attachment)}
      >
        {props.isRemovable && <DeleteIcon path={mdiClose} />}
      </IconButton>
    </Item>
  )
}

ListAttachmentItem.propTypes = {
  attachment: PropTypes.shape({
    title: PropTypes.string,
    url: PropTypes.string,
    date: PropTypes.string
  }).isRequired,
  onDelete: PropTypes.func,
  isRemovable: PropTypes.bool
}

ListAttachmentItem.defaultProps = {
  onDelete: () => {},
  isRemovable: true
}
