import React from 'react'

import {
  mdiEmailOutline,
  mdiCalendarOutline,
  mdiCalendarTextOutline,
  mdiCurrencyUsdCircleOutline,
  mdiShoePrint
} from '@mdi/js'

import { SingleEmailComposeDrawer } from 'components/EmailCompose'

import { goTo } from 'utils/go-to'

import { EventDrawer } from 'components/EventDrawer'
import NewContactDrawer from 'components/CreateContact/NewContactDrawer'
import { TourDrawer } from 'components/tour/TourDrawer'
import { DONE_STATUS } from 'components/EventDrawer/components/FutureEventDoneConfirmation'
import { initialValueGenerator } from 'components/EventDrawer/helpers/initial-value-generator'

import {
  meetingRoomOutlined,
  permContactCalendarOutlined
} from '../../SvgIcons/icons'

import CreateOpenHouse from './OpenHouse'

import { Item } from '../types'

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
    title: 'Reminder',
    type: 'event',
    Icon: mdiCalendarOutline,
    render: props => {
      return <EventDrawer title="Add Reminder" {...props} />
    }
  },
  {
    title: 'Log Activity',
    type: 'log',
    Icon: mdiCalendarTextOutline,
    render: props => {
      return (
        <EventDrawer
          title="Add Log Activity"
          {...props}
          initialValues={{
            ...initialValueGenerator(props.user, [], new Date()),
            status: DONE_STATUS
          }}
        />
      )
    }
  },
  {
    title: 'Log',
    type: 'log',
    Icon: mdiCalendarTextOutline,
    render: props => {
      return <EventDrawer {...props} />
    }
  },
  {
    title: 'Contact',
    type: 'contact',
    Icon: permContactCalendarOutlined,
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
    Icon: meetingRoomOutlined,
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
