import { useSelector } from 'react-redux'

import MyDesignsIcon from 'components/SvgIcons/IconMyDesigns/IconMyDesigns'

import { IAppState } from 'reducers'
import { hasUserAccess } from 'utils/user-teams'

import {
  SectionsEnum,
  Section,
  SectionItem
} from 'components/PageSideNav/types'

interface ExtendedSection extends Section {
  key: string
}

export type SectionCollection = { [key: string]: ExtendedSection }

function urlGenerator(url: string | string[]): string {
  return `/dashboard/marketing${
    typeof url === 'string' ? url : `/${url.join(',')}`
  }`
}

const ALL_SECTIONS: SectionCollection = {
  marketingCenter: {
    type: SectionsEnum.LINK,
    key: 'marketingCenter',
    title: 'Marketing Center',
    items: [
      {
        isIndex: true,
        title: 'My Designs',
        link: urlGenerator('/'),
        icon: MyDesignsIcon
      }
    ]
  },
  life: {
    type: SectionsEnum.LINK,
    key: 'life',
    title: 'Life',
    items: [
      {
        title: '‌Blank Layouts',
        value: 'Layout',
        link: urlGenerator('/Layout'),
        access: ['BackOffice']
      },
      {
        title: 'Newsletters',
        value: 'Newsletter',
        link: urlGenerator('/Newsletter')
      },
      {
        title: 'Occasions',
        value: 'Birthday',
        link: urlGenerator('/Birthday')
      },
      {
        title: 'Brand Campaigns',
        value: 'Brand',
        link: urlGenerator('/Brand')
      },
      {
        title: 'Holiday',
        value: [
          'Christmas',
          'NewYear',
          'Valentines',
          'StPatrick',
          'Easter',
          'OtherHoliday'
        ],
        link: urlGenerator([
          'Christmas',
          'NewYear',
          'Valentines',
          'StPatrick',
          'Easter',
          'OtherHoliday'
        ])
      },
      {
        title: 'New Agent',
        value: 'NewAgent',
        link: urlGenerator('/NewAgent')
      }
    ]
  },
  properties: {
    type: SectionsEnum.LINK,
    key: 'properties',
    title: 'Properties',
    items: [
      {
        title: '‌Blank Layouts',
        value: 'ListingLayout',
        link: urlGenerator('/ListingLayout'),
        access: ['BackOffice']
      },
      {
        title: 'As Seen In',
        value: 'AsSeenIn',
        link: urlGenerator('/AsSeenIn')
      },
      {
        title: 'Open House',
        value: 'OpenHouse',
        link: urlGenerator('/OpenHouse')
      },
      {
        title: 'Coming Soon',
        value: 'ComingSoon',
        link: urlGenerator('/ComingSoon')
      },
      {
        title: 'Just Listed',
        value: 'JustListed',
        link: urlGenerator('/JustListed')
      },
      {
        title: 'New Price',
        value: 'PriceImprovement',
        link: urlGenerator('/PriceImprovement')
      },
      {
        title: 'Under Contract',
        value: 'UnderContract',
        link: urlGenerator('/UnderContract')
      },
      {
        title: 'Just Sold',
        value: 'JustSold',
        link: urlGenerator('/JustSold')
      },
      {
        title: 'Multi Properties',
        value: 'Listings',
        link: urlGenerator('/Listings')
      }
    ]
  }
}

function getPrivilegedSectionItems(
  user: IUser,
  section: Section
): SectionItem[] {
  return section.items.filter(item => {
    const hasAccessToItem = (item.access || []).every(access =>
      hasUserAccess(user, access)
    )

    return hasAccessToItem
  })
}

function getSerializedValue(value?: string | string[]): string {
  if (!value) {
    return ''
  }

  return Array.isArray(value) ? value.join(',') : value
}

export function useMarketingCenterSections({ types }): SectionCollection {
  const user = useSelector<IAppState, IUser>(state => state.user)

  const newSections: SectionCollection = {}
  const sectionKeys = Object.keys(ALL_SECTIONS)

  sectionKeys.forEach(key => {
    const section = ALL_SECTIONS[key]
    const hasAccessToSection = (section.access || []).every(access =>
      hasUserAccess(user, access)
    )

    // No section access!
    // No section items access!
    if (!hasAccessToSection) {
      return
    }

    const activeType = section.items.find(
      item => getSerializedValue(item.value) === types
    )

    const newSection: ExtendedSection = {
      ...section,
      items: getPrivilegedSectionItems(user, section),
      title: activeType
        ? `${section.title}: ${activeType.title}`
        : section.title,
      value: activeType ? getSerializedValue(activeType.value) : null
    }

    newSections[key] = newSection
  })

  return newSections
}
