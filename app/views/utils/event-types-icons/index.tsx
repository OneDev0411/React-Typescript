import React from 'react'

import {
  mdiKeyOutline,
  mdiClockOutline,
  mdiEmailOutline,
  mdiPhoneOutline,
  mdiNoteTextOutline,
  mdiHomeImportOutline,
  mdiMessageTextOutline,
  mdiClipboardCheckOutline,
  mdiChatProcessingOutline,
  mdiAccountMultipleOutline,
  mdiCardAccountMailOutline,
  mdiAccountArrowLeftOutline,
  mdiDotsHorizontalCircleOutline
} from '@mdi/js'

import IconOpenHouseOutline from 'components/SvgIcons/OpenHouseOutline/IconOpenHouseOutline'
import Tour from 'components/SvgIcons/TourOutline/IconTourOutline'
import IconTaskCritical from 'components/SvgIcons/TaskCritical/IconTaskCritical'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'

export interface EventTypeIcon {
  name: string
  color: string
  icon: React.FC<any>
}
// @ts-ignore js component
export const eventTypesIcons = [
  {
    name: 'Call',
    icon: () => <SvgIcon path={mdiPhoneOutline} />,
    color: '#04c6d9'
  },
  {
    name: 'In-Person Meeting',
    icon: () => <SvgIcon path={mdiAccountMultipleOutline} />,
    color: '#f7a700'
  },
  {
    name: 'Text',
    icon: () => <SvgIcon path={mdiMessageTextOutline} />,
    color: '#000'
  },
  {
    name: 'Chat',
    icon: () => <SvgIcon path={mdiChatProcessingOutline} />,
    color: '#ff00bf'
  },
  {
    name: 'Mail',
    icon: () => <SvgIcon path={mdiCardAccountMailOutline} />,
    color: '#7ed321'
  },
  {
    name: 'Email',
    icon: () => <SvgIcon path={mdiEmailOutline} />,
    color: '#8f6cf0'
  },
  {
    name: 'Open House',
    icon: IconOpenHouseOutline,
    color: '#50e3c2'
  },
  {
    name: 'Tour',
    icon: Tour,
    color: '#bd10e0'
  },
  {
    name: 'TouchDate',
    icon: () => <SvgIcon path={mdiClockOutline} />,
    color: '#f7a700'
  },
  {
    name: 'Closing',
    icon: () => <SvgIcon path={mdiKeyOutline} />,
    color: '#287700'
  },
  {
    name: 'Follow Up',
    icon: () => <SvgIcon path={mdiAccountArrowLeftOutline} />,
    color: '#9013fe'
  },
  {
    name: 'Todo',
    icon: () => <SvgIcon path={mdiClipboardCheckOutline} />,
    color: '#4e709d'
  },
  {
    name: 'ListingAppointment',
    icon: () => <SvgIcon path={mdiHomeImportOutline} />,
    color: '#8b572a'
  },
  {
    name: 'Task Critical',
    icon: IconTaskCritical,
    color: '#f5a623'
  },
  {
    name: 'Note',
    icon: () => <SvgIcon path={mdiNoteTextOutline} />,
    color: '#e6bf00'
  },
  {
    name: 'Other',
    icon: () => <SvgIcon path={mdiDotsHorizontalCircleOutline} />,
    color: '#9013fe'
  }
].reduce((acc, icon) => {
  return {
    ...acc,
    [icon.name]: icon
  }
}, {}) as Record<string, EventTypeIcon>
