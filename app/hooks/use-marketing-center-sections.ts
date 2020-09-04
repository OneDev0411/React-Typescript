import { useSelector } from 'react-redux'

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
    type: SectionsEnum.Link,
    key: 'marketingCenter',
    title: 'Marketing Center',
    items: [
      {
        title: 'My Designs',
        link: urlGenerator('/')
      }
    ]
  },
  newsletters: {
    type: SectionsEnum.Link,
    key: 'newsletters',
    title: 'Newsletters',
    items: [
      {
        title: 'Newsletters',
        value: 'Newsletter',
        link: urlGenerator('/Newsletter')
      }
    ]
  },
  celebrations: {
    type: SectionsEnum.List,
    key: 'celebrations',
    title: 'Celebrations',
    items: [
      {
        title: 'Birthday',
        value: 'Birthday',
        link: urlGenerator('/Birthday')
      },
      {
        title: 'Home Anniversary',
        value: 'HomeAnniversary',
        link: urlGenerator('/HomeAnniversary')
      },
      {
        title: 'Wedding Anniversary',
        value: 'WeddingAnniversary',
        link: urlGenerator('/WeddingAnniversary')
      }
    ]
  },
  holidays: {
    type: SectionsEnum.List,
    key: 'holidays',
    title: 'Holidays',
    items: [
      {
        title: 'Christmas',
        value: 'Christmas',
        link: urlGenerator('/Christmas')
      },
      {
        title: 'New Year',
        value: 'NewYear',
        link: urlGenerator('/NewYear')
      },
      {
        title: "Valentine's Day",
        value: 'Valentines',
        link: urlGenerator('/Valentines')
      },
      {
        title: "St. Patrick's Day",
        value: 'StPatrick',
        link: urlGenerator('/StPatrick')
      },
      {
        title: 'Easter',
        value: 'Easter',
        link: urlGenerator('/Easter')
      },
      {
        title: "Father's Day",
        value: 'FathersDay',
        link: urlGenerator('/FathersDay')
      },
      {
        title: "Mother's Day",
        value: 'MothersDay',
        link: urlGenerator('/MothersDay')
      },
      {
        title: "International Women's Day",
        value: 'WomansDay',
        link: urlGenerator('/WomansDay')
      },
      {
        title: 'September 11',
        value: 'PatriotsDay',
        link: urlGenerator('/PatriotsDay')
      },
      {
        title: 'Memorial Day',
        value: 'MemorialDay',
        link: urlGenerator('/MemorialDay')
      },
      {
        title: 'Labor Day',
        value: 'LaborDay',
        link: urlGenerator('/LaborDay')
      },
      {
        title: 'Back To School',
        value: 'BackToSchool',
        link: urlGenerator('/BackToSchool')
      },
      {
        title: 'Hannukkah',
        value: 'Hannukkah',
        link: urlGenerator('/Hannukkah')
      },
      {
        title: 'Passover',
        value: 'Passover',
        link: urlGenerator('/Passover')
      },
      {
        title: 'Rosh Hashanah',
        value: 'RoshHashanah',
        link: urlGenerator('/RoshHashanah')
      },
      {
        title: 'Fourth of July',
        value: 'FourthOfJuly',
        link: urlGenerator('/FourthOfJuly')
      },
      {
        title: 'Veterans Day',
        value: 'VeteransDay',
        link: urlGenerator('/VeteransDay')
      },
      {
        title: 'Thanksgiving',
        value: 'Thanksgiving',
        link: urlGenerator('/Thanksgiving')
      },
      {
        title: 'Halloween',
        value: 'Halloween',
        link: urlGenerator('/Halloween')
      },
      {
        title: 'Martin Luther King Jr. Day',
        value: 'MLKDay',
        link: urlGenerator('/MLKDay')
      },
      {
        title: 'Chinese New Year',
        value: 'ChineseNewYear',
        link: urlGenerator('/ChineseNewYear')
      },
      {
        title: 'Diwali',
        value: 'Diwaly',
        link: urlGenerator('/Diwaly')
      },
      {
        title: 'Kwanzaa',
        value: 'Kwanzaa',
        link: urlGenerator('/Kwanzaa')
      },
      {
        title: 'Others',
        value: 'OtherHoliday',
        link: urlGenerator('/OtherHoliday')
      }
    ]
  },
  branding: {
    type: SectionsEnum.List,
    key: 'branding',
    title: 'Brand',
    items: [
      {
        title: 'Brand Campaigns',
        value: 'Brand',
        link: urlGenerator('/Brand')
      },
      {
        title: 'New Agent',
        value: 'NewAgent',
        link: urlGenerator('/NewAgent')
      }
    ]
  },

  properties: {
    type: SectionsEnum.List,
    key: 'properties',
    title: 'Properties',
    items: [
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
  },
  layouts: {
    type: SectionsEnum.List,
    key: 'layouts',
    title: 'Blank Layouts',
    items: [
      {
        title: 'Blank Layouts',
        value: 'Layout',
        link: urlGenerator('/Layout')
      },
      {
        title: 'Blank Listing Layouts',
        value: 'ListingLayout',
        link: urlGenerator('/ListingLayout')
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
