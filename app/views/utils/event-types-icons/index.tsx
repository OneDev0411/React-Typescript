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
  mdiChatProcessingOutline,
  mdiAccountMultipleOutline,
  mdiCardAccountMailOutline,
  mdiAccountArrowLeftOutline,
  mdiDotsHorizontalCircleOutline,
  mdiHomeOutline,
  mdiRing,
  mdiCakeVariant,
  mdiBriefcaseOutline,
  mdiHomeHeart,
  mdiCheckCircleOutline
} from '@mdi/js'

import {
  meetingRoomOutlined,
  importantDateIcon
} from 'components/SvgIcons/icons'
import { SvgIcon, Props as SvgIconProps } from 'components/SvgIcons/SvgIcon'

export interface EventTypeIcon {
  name: string
  color: string
  iconPath: string
  icon: React.FC<any>
}
// @ts-ignore js component
export const eventTypesIcons = [
  {
    name: 'Call',
    iconPath: mdiPhoneOutline,
    icon: (props: SvgIconProps) => (
      <SvgIcon {...props} path={mdiPhoneOutline} />
    ),
    color: '#04c6d9'
  },
  {
    name: 'In-Person Meeting',
    iconPath: mdiAccountMultipleOutline,
    icon: (props: SvgIconProps) => (
      <SvgIcon {...props} path={mdiAccountMultipleOutline} />
    ),
    color: '#f7a700'
  },
  {
    name: 'Text',
    iconPath: mdiMessageTextOutline,
    icon: (props: SvgIconProps) => (
      <SvgIcon {...props} path={mdiMessageTextOutline} />
    ),
    color: '#000'
  },
  {
    name: 'Chat',
    iconPath: mdiChatProcessingOutline,
    icon: (props: SvgIconProps) => (
      <SvgIcon {...props} path={mdiChatProcessingOutline} />
    ),
    color: '#ff00bf'
  },
  {
    name: 'Mail',
    iconPath: mdiCardAccountMailOutline,
    icon: (props: SvgIconProps) => (
      <SvgIcon {...props} path={mdiCardAccountMailOutline} />
    ),
    color: '#7ed321'
  },
  {
    name: 'Email',
    iconPath: mdiEmailOutline,
    icon: (props: SvgIconProps) => (
      <SvgIcon {...props} path={mdiEmailOutline} />
    ),
    color: '#8f6cf0'
  },
  {
    name: 'Open House',
    iconPath: meetingRoomOutlined,
    icon: (props: SvgIconProps) => (
      <SvgIcon {...props} path={meetingRoomOutlined} />
    ),
    color: '#50e3c2'
  },
  {
    name: 'Tour',
    iconPath: mdiShoePrint,
    icon: (props: SvgIconProps) => <SvgIcon {...props} path={mdiShoePrint} />,
    color: '#bd10e0'
  },
  {
    name: 'TouchDate',
    iconPath: mdiClockOutline,
    icon: (props: SvgIconProps) => (
      <SvgIcon {...props} path={mdiClockOutline} />
    ),
    color: '#f7a700'
  },
  {
    name: 'Closing',
    iconPath: mdiKeyOutline,
    icon: (props: SvgIconProps) => <SvgIcon {...props} path={mdiKeyOutline} />,
    color: '#287700'
  },
  {
    name: 'Follow Up',
    iconPath: mdiAccountArrowLeftOutline,
    icon: (props: SvgIconProps) => (
      <SvgIcon {...props} path={mdiAccountArrowLeftOutline} />
    ),
    color: '#9013fe'
  },
  {
    name: 'Todo',
    iconPath: mdiCheckCircleOutline,
    icon: (props: SvgIconProps) => (
      <SvgIcon {...props} path={mdiCheckCircleOutline} />
    ),
    color: '#4e709d'
  },
  {
    name: 'ListingAppointment',
    iconPath: mdiHomeImportOutline,
    icon: (props: SvgIconProps) => (
      <SvgIcon {...props} path={mdiHomeImportOutline} />
    ),
    color: '#8b572a'
  },
  {
    name: 'Task Critical',
    iconPath: importantDateIcon,
    icon: (props: SvgIconProps) => (
      <SvgIcon {...props} path={importantDateIcon} />
    ),
    color: '#f5a623'
  },
  {
    name: 'Note',
    iconPath: mdiNoteTextOutline,
    icon: (props: SvgIconProps) => (
      <SvgIcon {...props} path={mdiNoteTextOutline} />
    ),
    color: '#e6bf00'
  },
  {
    name: 'Other',
    iconPath: mdiDotsHorizontalCircleOutline,
    icon: (props: SvgIconProps) => (
      <SvgIcon {...props} path={mdiDotsHorizontalCircleOutline} />
    ),
    color: '#9013fe'
  },
  {
    name: 'list_date',
    iconPath: mdiHomeOutline,
    icon: (props: SvgIconProps) => <SvgIcon {...props} path={mdiHomeOutline} />,
    color: '#7ed321'
  },
  {
    name: 'expiration_date',
    iconPath: mdiHomeOutline,
    icon: (props: SvgIconProps) => <SvgIcon {...props} path={mdiHomeOutline} />,
    color: '#7ed321'
  },
  {
    name: 'contract_date',
    iconPath: mdiHomeOutline,
    icon: (props: SvgIconProps) => <SvgIcon {...props} path={mdiHomeOutline} />,
    color: '#7ed321'
  },
  {
    name: 'inspection_date',
    iconPath: mdiHomeOutline,
    icon: (props: SvgIconProps) => <SvgIcon {...props} path={mdiHomeOutline} />,
    color: '#7ed321'
  },
  {
    name: 'option_period',
    iconPath: mdiHomeOutline,
    icon: (props: SvgIconProps) => <SvgIcon {...props} path={mdiHomeOutline} />,
    color: '#7ed321'
  },
  {
    name: 'hoa_delivery',
    iconPath: mdiHomeOutline,
    icon: (props: SvgIconProps) => <SvgIcon {...props} path={mdiHomeOutline} />,
    color: '#7ed321'
  },
  {
    name: 'financing_due',
    iconPath: mdiHomeOutline,
    icon: (props: SvgIconProps) => <SvgIcon {...props} path={mdiHomeOutline} />,
    color: '#7ed321'
  },
  {
    name: 'title_due',
    iconPath: mdiHomeOutline,
    icon: (props: SvgIconProps) => <SvgIcon {...props} path={mdiHomeOutline} />,
    color: '#7ed321'
  },
  {
    name: 't47_due',
    iconPath: mdiHomeOutline,
    icon: (props: SvgIconProps) => <SvgIcon {...props} path={mdiHomeOutline} />,
    color: '#7ed321'
  },
  {
    name: 'closing_date',
    iconPath: mdiHomeOutline,
    icon: (props: SvgIconProps) => <SvgIcon {...props} path={mdiHomeOutline} />,
    color: '#7ed321'
  },
  {
    name: 'possession_date',
    iconPath: mdiHomeOutline,
    icon: (props: SvgIconProps) => <SvgIcon {...props} path={mdiHomeOutline} />,
    color: '#7ed321'
  },
  {
    name: 'lease_executed',
    iconPath: mdiHomeOutline,
    icon: (props: SvgIconProps) => <SvgIcon {...props} path={mdiHomeOutline} />,
    color: '#7ed321'
  },
  {
    name: 'lease_application_date',
    iconPath: mdiHomeOutline,
    icon: (props: SvgIconProps) => <SvgIcon {...props} path={mdiHomeOutline} />,
    color: '#7ed321'
  },
  {
    name: 'lease_begin',
    iconPath: mdiHomeOutline,
    icon: (props: SvgIconProps) => <SvgIcon {...props} path={mdiHomeOutline} />,
    color: '#7ed321'
  },
  {
    name: 'lease_end',
    iconPath: mdiHomeOutline,
    icon: (props: SvgIconProps) => <SvgIcon {...props} path={mdiHomeOutline} />,
    color: '#7ed321'
  },
  {
    name: 'birthday',
    iconPath: mdiCakeVariant,
    icon: (props: SvgIconProps) => <SvgIcon {...props} path={mdiCakeVariant} />,
    color: '#7ed321'
  },
  {
    name: 'wedding_anniversary',
    iconPath: mdiRing,
    icon: (props: SvgIconProps) => <SvgIcon {...props} path={mdiRing} />,
    color: '#7ed321'
  },
  {
    name: 'work_anniversary',
    iconPath: mdiBriefcaseOutline,
    icon: (props: SvgIconProps) => (
      <SvgIcon {...props} path={mdiBriefcaseOutline} />
    ),
    color: '#7ed321'
  },
  {
    name: 'home_anniversary',
    iconPath: mdiHomeHeart,
    icon: (props: SvgIconProps) => <SvgIcon {...props} path={mdiHomeHeart} />,
    color: '#7ed321'
  },
  {
    name: 'child_birthday',
    iconPath: mdiCakeVariant,
    icon: (props: SvgIconProps) => <SvgIcon {...props} path={mdiCakeVariant} />,
    color: '#7ed321'
  }
].reduce((acc, icon) => {
  return {
    ...acc,
    [icon.name]: icon
  }
}, {}) as Record<string, EventTypeIcon>
