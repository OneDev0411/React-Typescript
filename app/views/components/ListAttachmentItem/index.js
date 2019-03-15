import React from 'react'
import PropTypes from 'prop-types'
import fecha from 'fecha'

import IconAttacment from 'components/SvgIcons/Attachment/IconAttacment'
import { TextMiddleTruncate } from 'components/TextMiddleTruncate'

import { Icon, Item, Title, DateTime, DeleteIcon } from './styled'

export function ListAttachmentItem(props) {
  return (
    <Item>
      <Icon>
        <IconAttacment />
      </Icon>

      <div>
        <Title>
          <a target="_blank" href={props.attachment.url}>
            <TextMiddleTruncate text={props.attachment.title} maxLength={25} />
          </a>
        </Title>

        <DateTime>
          Uploaded in&nbsp;
          {fecha.format(new Date(props.attachment.date), 'MMM DD, h:mm A')}
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
