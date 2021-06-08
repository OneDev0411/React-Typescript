import React from 'react'

import {
  mdiPaw,
  mdiRing,
  mdiHomeHeart,
  mdiCakeVariant,
  mdiHomeOutline,
  mdiSchoolOutline,
  mdiBriefcaseOutline,
  mdiAccountChildOutline
} from '@mdi/js'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'

export interface ImportantDatesIcon {
  name: string
  color: string
  icon: React.FC<any>
}

export const calendarEventIcons = {
  Birthday: mdiCakeVariant,
  'graduation anniversary': mdiSchoolOutline,
  'New Home': mdiHomeOutline,
  'Home Anniversary': mdiHomeHeart,
  'Work Anniversary': mdiBriefcaseOutline,
  'Wedding Anniversary': mdiRing,
  'Child birthday': mdiAccountChildOutline,
  Pet: mdiPaw
}

export const importantDatesIcons = [
  {
    name: 'Birthday',
    icon: () => <SvgIcon path={calendarEventIcons.Birthday} />,
    color: '#ff6f6f'
  },
  {
    name: 'graduation anniversary',
    icon: () => <SvgIcon path={calendarEventIcons['graduation anniversary']} />,
    color: '#702283'
  },
  {
    name: 'New Home',
    icon: () => <SvgIcon path={calendarEventIcons['New Home']} />,
    color: '#64d9ff'
  },
  {
    name: 'Home Anniversary',
    icon: () => <SvgIcon path={calendarEventIcons['Home Anniversary']} />,
    color: '#ef3f61'
  },
  {
    name: 'Work Anniversary',
    icon: () => <SvgIcon path={calendarEventIcons['Work Anniversary']} />,
    color: '#804205'
  },
  {
    name: 'Wedding Anniversary',
    icon: () => <SvgIcon path={calendarEventIcons['Wedding Anniversary']} />,
    color: '#ef3F61'
  },
  {
    name: 'Child birthday',
    icon: () => <SvgIcon path={calendarEventIcons['Child birthday']} />,
    color: '#ffb7b9'
  },
  {
    name: 'Pet',
    icon: () => <SvgIcon path={calendarEventIcons.Pet} />,
    color: '#c57e3e'
  }
].reduce((acc, icon) => {
  return {
    ...acc,
    [icon.name]: icon
  }
}, {}) as Record<string, ImportantDatesIcon>
