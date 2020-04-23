import React from 'react'

import { SingleEmailComposeDrawer } from 'components/EmailCompose'

import { goTo } from 'utils/go-to'

import EmailIcon from 'components/SvgIcons/EmailOutlined/IconEmailOutlined'

import { EventDrawer } from 'components/EventDrawer'
import CalendarIcon from 'components/SvgIcons/Calendar2/IconCalendar'

import NewContactDrawer from 'components/CreateContact/NewContactDrawer'
import IconContacts from 'components/SvgIcons/Contacts/IconContacts'

import IconDeal from 'components/SvgIcons/Deals/IconDeal'

import IconOpenHouseOutline from 'components/SvgIcons/OpenHouseOutline/IconOpenHouseOutline'

import { TourDrawer } from 'components/tour/TourDrawer'
import IconTourOutline from 'components/SvgIcons/TourOutline/IconTourOutline'

import CreateOpenHouse from './OpenHouse'

import { Item } from './types'

const items: Item[] = [
  {
    title: 'Email',
    type: 'email',
    Icon: EmailIcon,
    render: props => {
      return <SingleEmailComposeDrawer {...props} />
    }
  },
  {
    title: 'Event',
    type: 'event',
    Icon: CalendarIcon,
    render: props => {
      return <EventDrawer {...props} />
    }
  },
  {
    title: 'Contact',
    type: 'contact',
    Icon: IconContacts,
    render: props => {
      return <NewContactDrawer {...props} />
    }
  },
  {
    title: 'Deal',
    type: 'deal',
    Icon: IconDeal,
    redirectTo: url => {
      goTo(url)
    }
  },
  {
    title: 'OH Registration Page',
    type: 'openhouse',
    Icon: IconOpenHouseOutline,
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
