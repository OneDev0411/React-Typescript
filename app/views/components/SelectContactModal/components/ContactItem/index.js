import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import Avatar from '../../../Avatar'

const Container = styled.div`
  height: 48px;
  display: flex;
  padding: 0.5em 1rem;
  background-color: ${props => (props.isHighlighted ? '#f5f5f5' : '#fff')};

  &:hover {
    cursor: pointer;
  }
`

const Title = styled.div`
  line-height: 1;
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
  const summary =
    props.summary ||
    [email, phone_number].filter(i => i && i !== title).join(', ')

  return (
    <Container {...props} onClick={() => onClickHandler(item)}>
      <Avatar {...getAvatarProps(item.summary)} />
      <div style={{ paddingLeft: '1em' }}>
        <Title>{title}</Title>
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
    size: 32,
    image: profile_image_url,
    title:
      email !== display_name && phone_number !== display_name
        ? display_name
        : ''
  }
}
