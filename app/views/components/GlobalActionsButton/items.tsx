import React from 'react'

import MailOutlineOutlinedIcon from '@material-ui/icons/MailOutlineOutlined'

import EventOutlinedIcon from '@material-ui/icons/EventOutlined'

import ContactsOutlinedIcon from '@material-ui/icons/ContactsOutlined'

import LocalAtmOutlinedIcon from '@material-ui/icons/LocalAtmOutlined'

import MeetingRoomOutlinedIcon from '@material-ui/icons/MeetingRoomOutlined'

import { SingleEmailComposeDrawer } from 'components/EmailCompose'

import { goTo } from 'utils/go-to'

import { EventDrawer } from 'components/EventDrawer'
import NewContactDrawer from 'components/CreateContact/NewContactDrawer'
import { TourDrawer } from 'components/tour/TourDrawer'
import IconTourOutline from 'components/SvgIcons/TourOutline/IconTourOutline'

import CreateOpenHouse from './OpenHouse'

import { Item } from './types'

const items: Item[] = [
  {
    title: 'Email',
    type: 'email',
    Icon: MailOutlineOutlinedIcon,
    render: props => {
      return <SingleEmailComposeDrawer {...props} />
    }
  },
  {
    title: 'Event',
    type: 'event',
    Icon: EventOutlinedIcon,
    render: props => {
      return <EventDrawer {...props} />
    }
  },
  {
    title: 'Contact',
    type: 'contact',
    Icon: ContactsOutlinedIcon,
    render: props => {
      return <NewContactDrawer {...props} />
    }
  },
  {
    title: 'Deal',
    type: 'deal',
    Icon: LocalAtmOutlinedIcon,
    redirectTo: url => {
      goTo(url)
    }
  },
  {
    title: 'OH Registration Page',
    type: 'openhouse',
    Icon: MeetingRoomOutlinedIcon,
    render: props => {
      return <CreateOpenHouse {...props} />
    }
  },
  {
    title: 'Toursheet',
    type: 'tour',
    Icon: IconTourOutline,
    render: props => {
      return <TourDrawer {...props} />
    }
  }
]

export default items
