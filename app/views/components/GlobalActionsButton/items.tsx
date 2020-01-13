import React from 'react'

import { goTo } from 'utils/go-to'

import { BulkEmailComposeDrawer } from 'components/EmailCompose'
import EmailIcon from 'components/SvgIcons/EmailOutline/IconEmailOutline'

import { EventDrawer } from 'components/EventDrawer'
import CalendarIcon from 'components/SvgIcons/Calendar2/IconCalendar'

import NewContactDrawer from 'components/CreateContact/NewContactDrawer'
import IconContacts from 'components/SvgIcons/Contacts/IconContacts'

import IconDeal from 'components/SvgIcons/Deals/IconDeal'

import { OpenHouseDrawer } from 'components/open-house/OpenHouseDrawer'
import IconOpenHouseOutline from 'components/SvgIcons/OpenHouseOutline/IconOpenHouseOutline'

import { TourDrawer } from 'components/tour/TourDrawer'
import IconTourOutline from 'components/SvgIcons/TourOutline/IconTourOutline'

import { Item } from './types'

const items: Item[] = [
  {
    title: 'Send an email',
    type: 'email',
    Icon: EmailIcon,
    render: props => {
      return <BulkEmailComposeDrawer {...props} />
    }
  },
  {
    title: 'Create an event',
    type: 'event',
    Icon: CalendarIcon,
    render: props => {
      return <EventDrawer {...props} />
    }
  },
  {
    title: 'Create a contact',
    type: 'contact',
    Icon: IconContacts,
    render: props => {
      return <NewContactDrawer {...props} />
    }
  },
  {
    title: 'Create a deal',
    type: 'deal',
    Icon: IconDeal,
    redirectTo: url => {
      goTo(url)
    }
  },
  {
    title: 'Create open house registration page',
    type: 'openhouse',
    Icon: IconOpenHouseOutline,
    render: props => {
      return <OpenHouseDrawer {...props} />
    }
  },
  {
    title: 'Create a toursheet',
    type: 'tour',
    Icon: IconTourOutline,
    render: props => {
      return <TourDrawer {...props} />
    }
  }
]

export default items
