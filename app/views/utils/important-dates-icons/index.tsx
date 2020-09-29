import React from 'react'

import {
  mdiPaw,
  mdiRing,
  mdiCakeVariant,
  mdiHomeOutline,
  mdiSchoolOutline,
  mdiBriefcaseOutline,
  mdiAccountChildOutline
} from '@mdi/js'

import IconHomeAnniversary from 'components/SvgIcons/HomeAnniversary/IconHomeAnniversary'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'

export interface ImportantDatesIcon {
  name: string
  color: string
  icon: React.FC<any>
}

export const importantDatesIcons = [
  {
    name: 'Birthday',
    icon: () => <SvgIcon path={mdiCakeVariant} />,
    color: '#ff6f6f'
  },
  {
    name: 'graduation anniversary',
    icon: () => <SvgIcon path={mdiSchoolOutline} />,
    color: '#702283'
  },
  {
    name: 'New Home',
    icon: () => <SvgIcon path={mdiHomeOutline} />,
    color: '#64d9ff'
  },
  {
    name: 'Home Anniversary',
    icon: IconHomeAnniversary,
    color: '#ef3f61'
  },
  {
    name: 'Work Anniversary',
    icon: () => <SvgIcon path={mdiBriefcaseOutline} />,
    color: '#804205'
  },
  {
    name: 'Wedding Anniversary',
    icon: () => <SvgIcon path={mdiRing} />,
    color: '#ef3F61'
  },
  {
    name: 'Child birthday',
    icon: () => <SvgIcon path={mdiAccountChildOutline} />,
    color: '#ffb7b9'
  },
  {
    name: 'Pet',
    icon: () => <SvgIcon path={mdiPaw} />,
    color: '#c57e3e'
  }
].reduce((acc, icon) => {
  return {
    ...acc,
    [icon.name]: icon
  }
}, {}) as Record<string, ImportantDatesIcon>
