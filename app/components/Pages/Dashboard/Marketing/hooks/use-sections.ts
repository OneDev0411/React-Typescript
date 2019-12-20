import { useSelector } from 'react-redux'

import { IAppState } from 'reducers'
import { hasUserAccess } from 'utils/user-teams'

import {
  SectionsEnum,
  Section,
  SectionItem
} from 'components/PageSideNav/types'

import MyDesignsIcon from '../components/IconMyDesigns/IconMyDesigns'

function urlGenerator(url: string): string {
  return `/dashboard/marketing${url}`
}

const ALL_SECTIONS: Section[] = [
  {
    type: SectionsEnum.LINK,
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
  {
    type: SectionsEnum.LINK,
    title: 'Life',
    items: [
      {
        title: 'Newsletters',
        link: urlGenerator('/Newsletter'),
        access: ['BetaFeatures']
      },
      {
        title: 'Occasions',
        link: urlGenerator('/Birthday')
      },
      {
        title: 'Brand Campaigns',
        link: urlGenerator('/Brand')
      },
      {
        title: 'Holiday',
        link: urlGenerator(
          '/Christmas,NewYear,Valentines,StPatrick,Easter,OtherHoliday'
        )
      },
      {
        title: 'New Agent',
        link: urlGenerator('/NewAgent')
      }
    ]
  },
  {
    type: SectionsEnum.LINK,
    title: 'Properties',
    items: [
      {
        title: 'As Seen In',
        link: urlGenerator('/AsSeenIn')
      },
      {
        title: 'Open House',
        link: urlGenerator('/OpenHouse')
      },
      {
        title: 'Coming Soon',
        link: urlGenerator('/ComingSoon')
      },
      {
        title: 'Just Listed',
        link: urlGenerator('/JustListed')
      },
      {
        title: 'New Price',
        link: urlGenerator('/PriceImprovement')
      },
      {
        title: 'Under Contract',
        link: urlGenerator('/UnderContract')
      },
      {
        title: 'Just Sold',
        link: urlGenerator('/JustSold')
      },
      {
        title: 'Multi Properties',
        link: urlGenerator('/Listings')
      }
    ]
  }
]

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

export function useSections(): Section[] {
  const user = useSelector<IAppState, IUser>(state => state.user)

  const newSections: Section[] = []

  ALL_SECTIONS.forEach(section => {
    const hasAccessToSection = (section.access || []).every(access =>
      hasUserAccess(user, access)
    )

    // No section access!
    // No section items access!
    if (!hasAccessToSection) {
      return
    }

    const newSection: Section = {
      ...section,
      items: getPrivilegedSectionItems(user, section)
    }

    newSections.push(newSection)
  })

  return newSections
}
