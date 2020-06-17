import React from 'react'
import PropTypes from 'prop-types'
import fecha from 'fecha'

import { TextMiddleTruncate } from 'components/TextMiddleTruncate'

import IconAttachment from '../SvgIcons/Attachment/IconAttachment'

import { DateTime, DeleteIcon, Icon, Item, Title } from './styled'

export function ListAttachmentItem(props) {
  return (
    <Item>
      <Icon>
        <IconAttachment />
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

      {props.isRemovable && (
        <DeleteIcon onClick={() => props.onDelete(props.attachment)} />
      )}
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
