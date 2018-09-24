import React from 'react'
import styled from 'styled-components'
import Flex from 'styled-flex-component'

import { grey } from '../../../utils/colors'
import Avatar from '../../Avatar'
import { Item } from '../../Dropdown/Item'
import CheckmarkIcon from '../../SvgIcons/Checkmark/IconCheckmark'

const Info = styled.div`
  color: ${grey.A500};
`
const Container = Item.extend`
  pointer-events: ${props => (props.isDisabled ? 'none' : 'initial')};

  &:hover {
    ${Info} {
      color: ${grey.A300};
    }

    ${CheckmarkIcon} {
      fill: '#fff';
    }
  }
`

export function TeamMember(props) {
  const { user, title } = props

  if (!user) {
    return null
  }

  const info = [user.email, user.phone_numner].filter(i => i != null).join(', ')

  return (
    <Container {...props}>
      <Avatar image={user.profile_image_url} title={title} />
      <Flex
        column
        style={{
          width: `calc(100% - ${props.isSelected ? '7em' : '3.5em'})`,
          marginLeft: '1em'
        }}
      >
        <div>{title}</div>
        <Info>{info}</Info>
      </Flex>
      {props.isSelected && <CheckmarkIcon style={{ marginLeft: '2em' }} />}
    </Container>
  )
}
