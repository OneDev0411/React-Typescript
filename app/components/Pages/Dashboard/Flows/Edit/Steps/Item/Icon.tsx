import React from 'react'
import styled, { StyledComponent } from 'styled-components'

import { fade } from '@material-ui/core/styles'

import Email from 'components/SvgIcons/EmailOutline/IconEmailOutline'
import IconCall from 'components/SvgIcons/CallOutline/IconCallOutline'
import Text from 'components/SvgIcons/Text/IconText'
import Chat from 'components/SvgIcons/Chat/IconChat'
import IconMessage from 'components/SvgIcons/Mail/IconMail'
import Other from 'components/SvgIcons/MenuRounded/IconMenuRounded'
import IconInPerson from 'components/SvgIcons/InPerson/IconInPerson'

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 100%;
  margin-right: 1rem;
`

interface EventIcon {
  type: TTaskType
  icon: StyledComponent<'svg', any>
  color: string
}

const EVENT_ICONS: EventIcon[] = [
  {
    type: 'Call',
    icon: IconCall,
    color: '#04C6D9'
  },
  {
    type: 'In-Person Meeting',
    icon: IconInPerson,
    color: '#F7A700'
  },
  {
    type: 'Text',
    icon: Text,
    color: '#000'
  },
  {
    type: 'Chat',
    icon: Chat,
    color: '#ff00bf'
  },
  {
    type: 'Mail',
    icon: IconMessage,
    color: '#7ED321'
  },
  {
    type: 'Email',
    icon: Email,
    color: '#8F6CF0'
  },
  {
    type: 'Other',
    icon: Other,
    color: '#9013FE'
  }
]

const DEFAULT_ICON = EVENT_ICONS[EVENT_ICONS.length - 1]

interface Props {
  type: TTaskType
}

export default function Icon({ type }: Props) {
  const icon = EVENT_ICONS.find(item => item.type === type) || DEFAULT_ICON

  return (
    <Container
      style={{
        backgroundColor: fade(icon.color, 0.2)
      }}
    >
      <icon.icon fill={icon.color} />
    </Container>
  )
}
