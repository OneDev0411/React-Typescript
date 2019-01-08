import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Flex from 'styled-flex-component'

import { formatPhoneNumber } from 'utils/format'

import Avatar from '../../../Avatar'

export const Container = styled(Flex)`
  display: flex;
  padding: ${props => (props.isDrawer ? '0.5rem 1.5rem' : '0.5em 1rem')};
  background-color: ${props => (props.isHighlighted ? '#f5f5f5' : '#fff')};

  &:hover {
    cursor: pointer;
    background-color: #f5f5f5;
  }
`

const propTypes = {
  item: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired,
  isHighlighted: PropTypes.bool.isRequired,
  summary: PropTypes.string
}

function ContactItem(props) {
  const { item, onClickHandler } = props
  const { phone_number, email, display_name: title } = item.summary
  const formatedPhoneNumber = formatPhoneNumber(phone_number)
  const summary =
    props.summary ||
    [email, formatedPhoneNumber].filter(i => i && i !== title).join(', ')

  return (
    <Container {...props} onClick={() => onClickHandler(item)}>
      <Avatar {...getAvatarProps(item.summary)} />
      <div style={{ paddingLeft: '1em' }}>
        <div style={{ lineHeight: 1 }}>{title}</div>
        <div style={{ color: '#7f7f7f' }}>{summary}</div>
      </div>
    </Container>
  )
}

ContactItem.propTypes = propTypes

export default ContactItem

function getAvatarProps(user) {
  const { email, phone_number, display_name, profile_image_url } = user

  return {
    size: 40,
    image: profile_image_url,
    placeHolderImage: '/static/icons/contact-association-avatar.svg',
    title:
      email !== display_name && phone_number !== display_name
        ? display_name
        : ''
  }
}
