import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Avatar from '../../../../../../../../views/components/Avatar/index'
import Contact from '../../../../../../../../models/Contact'

const Container = styled.div`
  height: 48px;
  display: flex;
  padding: 8px 2rem;
  background-color: ${props => (props.isHighlighted ? '#f5f5f5' : '#fff')};

  &:hover {
    cursor: pointer;
  }
`

const Title = styled.div`
  font-size: 1.5rem;
  line-height: 1;
  color: #1d364b;
`

const propTypes = {
  item: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired,
  isHighlighted: PropTypes.bool.isRequired
}

function ContactItem(props) {
  const { item } = props
  const user = extractUserInfoFromContactModel(item)
  const { email, phone } = user
  const title = getUserTitle(user)

  return (
    <Container key={item.id} {...props}>
      <div style={{ width: '32px', height: '32px', borderRadius: '50%' }}>
        <Avatar user={user} size={32} />
      </div>
      <div style={{ paddingLeft: '2rem', height: '32px' }}>
        <Title>{title}</Title>
        <div style={{ color: '#8696a4' }}>
          <span>{email}</span>
          {phone && <span>{`, ${phone}`}</span>}
        </div>
      </div>
    </Container>
  )
}

ContactItem.propTypes = propTypes

export default ContactItem

function extractUserInfoFromContactModel(contact) {
  const { display_name } = contact
  const email = Contact.get.email(contact)
  const phone = Contact.get.phone(contact)
  const profile_image_url = Contact.get.avatar(contact)

  const namesAttributes = {
    ...Contact.get._all(contact, 'names', 'name')[0]
  }
  const { first_name, last_name } = namesAttributes

  const user = {
    email,
    phone,
    last_name,
    first_name,
    display_name,
    profile_image_url
  }

  return user
}

function getUserTitle(user) {
  const { first_name, last_name, display_name } = user

  if (first_name && last_name) {
    return `${first_name} ${last_name}`
  }

  return display_name
}
