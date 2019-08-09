import React from 'react'
import { StyledComponent } from 'styled-components'

import Email from 'components/SvgIcons/EmailOutline/IconEmailOutline'
import IconCall from 'components/SvgIcons/CallOutline/IconCallOutline'
import Text from 'components/SvgIcons/Text/IconText'
import Chat from 'components/SvgIcons/Chat/IconChat'
import IconMessage from 'components/SvgIcons/Mail/IconMail'
import Other from 'components/SvgIcons/MenuRounded/IconMenuRounded'
import IconInPerson from 'components/SvgIcons/InPerson/IconInPerson'

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

  return <icon.icon fill={icon.color} />
}
