import React from 'react'

import {
  mdiShoePrint,
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

import {
  meetingRoomOutlined,
  importantDateIcon
} from 'components/SvgIcons/icons'

import { SvgIcon, Props as SvgIconProps } from 'components/SvgIcons/SvgIcon'

export interface EventTypeIcon {
  name: string
  color: string
  icon: React.FC<any>
}
// @ts-ignore js component
export const eventTypesIcons = [
  {
    name: 'Call',
    icon: (props: SvgIconProps) => (
      <SvgIcon {...props} path={mdiPhoneOutline} />
    ),
    color: '#04c6d9'
  },
  {
    name: 'In-Person Meeting',
    icon: (props: SvgIconProps) => (
      <SvgIcon {...props} path={mdiAccountMultipleOutline} />
    ),
    color: '#f7a700'
  },
  {
    name: 'Text',
    icon: (props: SvgIconProps) => (
      <SvgIcon {...props} path={mdiMessageTextOutline} />
    ),
    color: '#000'
  },
  {
    name: 'Chat',
    icon: (props: SvgIconProps) => (
      <SvgIcon {...props} path={mdiChatProcessingOutline} />
    ),
    color: '#ff00bf'
  },
  {
    name: 'Mail',
    icon: (props: SvgIconProps) => (
      <SvgIcon {...props} path={mdiCardAccountMailOutline} />
    ),
    color: '#7ed321'
  },
  {
    name: 'Email',
    icon: (props: SvgIconProps) => (
      <SvgIcon {...props} path={mdiEmailOutline} />
    ),
    color: '#8f6cf0'
  },
  {
    name: 'Open House',
    icon: (props: SvgIconProps) => (
      <SvgIcon {...props} path={meetingRoomOutlined} />
    ),
    color: '#50e3c2'
  },
  {
    name: 'Tour',
    icon: (props: SvgIconProps) => <SvgIcon {...props} path={mdiShoePrint} />,
    color: '#bd10e0'
  },
  {
    name: 'TouchDate',
    icon: (props: SvgIconProps) => (
      <SvgIcon {...props} path={mdiClockOutline} />
    ),
    color: '#f7a700'
  },
  {
    name: 'Closing',
    icon: (props: SvgIconProps) => <SvgIcon {...props} path={mdiKeyOutline} />,
    color: '#287700'
  },
  {
    name: 'Follow Up',
    icon: (props: SvgIconProps) => (
      <SvgIcon {...props} path={mdiAccountArrowLeftOutline} />
    ),
    color: '#9013fe'
  },
  {
    name: 'Todo',
    icon: (props: SvgIconProps) => (
      <SvgIcon {...props} path={mdiClipboardCheckOutline} />
    ),
    color: '#4e709d'
  },
  {
    name: 'ListingAppointment',
    icon: (props: SvgIconProps) => (
      <SvgIcon {...props} path={mdiHomeImportOutline} />
    ),
    color: '#8b572a'
  },
  {
    name: 'Task Critical',
    icon: (props: SvgIconProps) => (
      <SvgIcon {...props} path={importantDateIcon} />
    ),
    color: '#f5a623'
  },
  {
    name: 'Note',
    icon: (props: SvgIconProps) => (
      <SvgIcon {...props} path={mdiNoteTextOutline} />
    ),
    color: '#e6bf00'
  },
  {
    name: 'Other',
    icon: (props: SvgIconProps) => (
      <SvgIcon {...props} path={mdiDotsHorizontalCircleOutline} />
    ),
    color: '#9013fe'
  }
].reduce((acc, icon) => {
  return {
    ...acc,
    [icon.name]: icon
  }
}, {}) as Record<string, EventTypeIcon>
