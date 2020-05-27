import React from 'react'

import {
  mdiEmailOutline,
  mdiCalendarOutline,
  mdiContactsOutline,
  mdiCurrencyUsdCircleOutline,
  mdiShoePrint
} from '@mdi/js'

import { SingleEmailComposeDrawer } from 'components/EmailCompose'

import { goTo } from 'utils/go-to'

import { EventDrawer } from 'components/EventDrawer'
import NewContactDrawer from 'components/CreateContact/NewContactDrawer'
import { TourDrawer } from 'components/tour/TourDrawer'

import { MeetingRoomOutlined } from '../SvgIcons/icons'

import CreateOpenHouse from './OpenHouse'

import { Item } from './types'

const items: Item[] = [
  {
    title: 'Email',
    type: 'email',
    Icon: mdiEmailOutline,
    render: props => {
      return <SingleEmailComposeDrawer {...props} />
    }
  },
  {
    title: 'Event',
    type: 'event',
    Icon: mdiCalendarOutline,
    render: props => {
      return <EventDrawer {...props} />
    }
  },
  {
    title: 'Contact',
    type: 'contact',
    Icon: mdiContactsOutline,
    render: props => {
      return <NewContactDrawer {...props} />
    }
  },
  {
    title: 'Deal',
    type: 'deal',
    Icon: mdiCurrencyUsdCircleOutline,
    redirectTo: url => {
      goTo(url)
    }
  },
  {
    title: 'OH Registration Page',
    type: 'openhouse',
    Icon: MeetingRoomOutlined,
    render: props => {
      return <CreateOpenHouse {...props} />
    }
  },
  {
    title: 'Toursheet',
    type: 'tour',
    Icon: mdiShoePrint,
    render: props => {
      return <TourDrawer {...props} />
    }
  }
]

export default items
