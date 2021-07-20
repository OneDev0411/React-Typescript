import React from 'react'

import {
  mdiEmailOutline,
  mdiCalendarOutline,
  mdiCalendarTextOutline,
  mdiCurrencyUsdCircleOutline,
  mdiShoePrint
} from '@mdi/js'

import NewContactDrawer from 'components/CreateContact/NewContactDrawer'
import { SingleEmailComposeDrawer } from 'components/EmailCompose'
import { EventDrawer } from 'components/EventDrawer'
import { DONE_STATUS } from 'components/EventDrawer/components/FutureEventDoneConfirmation'
import { initialValueGenerator } from 'components/EventDrawer/helpers/initial-value-generator'
import { TourDrawer } from 'components/tour/TourDrawer'
import { goTo } from 'utils/go-to'

import {
  meetingRoomOutlined,
  permContactCalendarOutlined,
  showingIcon
} from '../../SvgIcons/icons'
import { Item } from '../types'

import CreateOpenHouse from './OpenHouse'

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
          title="Log Activity"
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
  },
  {
    title: 'Showing',
    type: 'showing',
    Icon: showingIcon,
    redirectTo: url => {
      goTo(url)
    }
  }
]

export default items
