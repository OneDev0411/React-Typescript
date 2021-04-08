import { useSelector } from 'react-redux'

import { hasUserAccess } from 'utils/user-teams'

import {
  SectionsEnum,
  Section,
  SectionItem
} from 'components/PageSideNav/types'
import { getTemplateTypeLabel } from 'utils/marketing-center/get-template-type-label'
import { selectUser } from 'selectors/user'

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
  overview: {
    type: SectionsEnum.Link,
    key: 'overview',
    title: 'Overview',
    items: [
      {
        title: 'Overview',
        link: urlGenerator('/')
      }
    ]
  },
  designs: {
    type: SectionsEnum.Link,
    key: 'designs',
    title: 'Designs',
    items: [
      {
        title: 'My Designs',
        link: urlGenerator('/designs')
      }
    ]
  },
  newsletters: {
    type: SectionsEnum.Link,
    key: 'newsletters',
    title: 'Newsletters',
    items: [
      {
        title: getTemplateTypeLabel('Newsletter'),
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
        title: getTemplateTypeLabel('Birthday'),
        value: 'Birthday',
        link: urlGenerator('/Birthday')
      },
      {
        title: getTemplateTypeLabel('HomeAnniversary'),
        value: 'HomeAnniversary',
        link: urlGenerator('/HomeAnniversary')
      },
      {
        title: getTemplateTypeLabel('WeddingAnniversary'),
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
        title: getTemplateTypeLabel('BackToSchool'),
        value: 'BackToSchool',
        link: urlGenerator('/BackToSchool')
      },
      {
        title: getTemplateTypeLabel('ChineseNewYear'),
        value: 'ChineseNewYear',
        link: urlGenerator('/ChineseNewYear')
      },
      {
        title: getTemplateTypeLabel('Christmas'),
        value: 'Christmas',
        link: urlGenerator('/Christmas')
      },
      {
        title: getTemplateTypeLabel('ColumbusDay'),
        value: 'ColumbusDay',
        link: urlGenerator('/ColumbusDay')
      },
      {
        title: getTemplateTypeLabel('DaylightSaving'),
        value: 'DaylightSaving',
        link: urlGenerator('/DaylightSaving')
      },
      {
        title: getTemplateTypeLabel('Diwali'),
        value: 'Diwali',
        link: urlGenerator('/Diwali')
      },
      {
        title: getTemplateTypeLabel('Easter'),
        value: 'Easter',
        link: urlGenerator('/Easter')
      },
      {
        title: getTemplateTypeLabel('FathersDay'),
        value: 'FathersDay',
        link: urlGenerator('/FathersDay')
      },
      {
        title: getTemplateTypeLabel('FourthOfJuly'),
        value: 'FourthOfJuly',
        link: urlGenerator('/FourthOfJuly')
      },
      {
        title: getTemplateTypeLabel('Halloween'),
        value: 'Halloween',
        link: urlGenerator('/Halloween')
      },
      {
        title: getTemplateTypeLabel('Hanukkah'),
        value: 'Hanukkah',
        link: urlGenerator('/Hanukkah')
      },
      {
        title: getTemplateTypeLabel('WomansDay'),
        value: 'WomansDay',
        link: urlGenerator('/WomansDay')
      },
      {
        title: getTemplateTypeLabel('Kwanzaa'),
        value: 'Kwanzaa',
        link: urlGenerator('/Kwanzaa')
      },
      {
        title: getTemplateTypeLabel('LaborDay'),
        value: 'LaborDay',
        link: urlGenerator('/LaborDay')
      },
      {
        title: getTemplateTypeLabel('MLKDay'),
        value: 'MLKDay',
        link: urlGenerator('/MLKDay')
      },
      {
        title: getTemplateTypeLabel('MemorialDay'),
        value: 'MemorialDay',
        link: urlGenerator('/MemorialDay')
      },
      {
        title: getTemplateTypeLabel('MothersDay'),
        value: 'MothersDay',
        link: urlGenerator('/MothersDay')
      },
      {
        title: getTemplateTypeLabel('NewYear'),
        value: 'NewYear',
        link: urlGenerator('/NewYear')
      },
      {
        title: getTemplateTypeLabel('OtherHoliday'),
        value: 'OtherHoliday',
        link: urlGenerator('/OtherHoliday')
      },
      {
        title: getTemplateTypeLabel('Passover'),
        value: 'Passover',
        link: urlGenerator('/Passover')
      },
      {
        title: getTemplateTypeLabel('RoshHashanah'),
        value: 'RoshHashanah',
        link: urlGenerator('/RoshHashanah')
      },
      {
        title: getTemplateTypeLabel('PatriotsDay'),
        value: 'PatriotsDay',
        link: urlGenerator('/PatriotsDay')
      },
      {
        title: getTemplateTypeLabel('StPatrick'),
        value: 'StPatrick',
        link: urlGenerator('/StPatrick')
      },
      {
        title: getTemplateTypeLabel('Thanksgiving'),
        value: 'Thanksgiving',
        link: urlGenerator('/Thanksgiving')
      },
      {
        title: getTemplateTypeLabel('Valentines'),
        value: 'Valentines',
        link: urlGenerator('/Valentines')
      },
      {
        title: getTemplateTypeLabel('VeteransDay'),
        value: 'VeteransDay',
        link: urlGenerator('/VeteransDay')
      }
    ]
  },
  branding: {
    type: SectionsEnum.List,
    key: 'branding',
    title: 'Brand',
    items: [
      {
        title: getTemplateTypeLabel('Brand'),
        value: 'Brand',
        link: urlGenerator('/Brand')
      },
      {
        title: getTemplateTypeLabel('NewAgent'),
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
        title: getTemplateTypeLabel('AsSeenIn'),
        value: 'AsSeenIn',
        link: urlGenerator('/AsSeenIn')
      },
      {
        title: getTemplateTypeLabel('OpenHouse'),
        value: 'OpenHouse',
        link: urlGenerator('/OpenHouse')
      },
      {
        title: getTemplateTypeLabel('ComingSoon'),
        value: 'ComingSoon',
        link: urlGenerator('/ComingSoon')
      },
      {
        title: getTemplateTypeLabel('JustListed'),
        value: 'JustListed',
        link: urlGenerator('/JustListed')
      },
      {
        title: getTemplateTypeLabel('PriceImprovement'),
        value: 'PriceImprovement',
        link: urlGenerator('/PriceImprovement')
      },
      {
        title: getTemplateTypeLabel('UnderContract'),
        value: 'UnderContract',
        link: urlGenerator('/UnderContract')
      },
      {
        title: getTemplateTypeLabel('JustSold'),
        value: 'JustSold',
        link: urlGenerator('/JustSold')
      },
      {
        title: getTemplateTypeLabel('Listings'),
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
        title: getTemplateTypeLabel('Layout'),
        value: 'Layout',
        link: urlGenerator('/Layout')
      },
      {
        title: getTemplateTypeLabel('ListingLayout'),
        value: 'ListingLayout',
        link: urlGenerator('/ListingLayout')
      }
    ]
  },
  flows: {
    type: SectionsEnum.Link,
    key: 'flows',
    title: 'Flows',
    items: [
      {
        title: 'Flows',
        link: urlGenerator('/flows')
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
  const user = useSelector(selectUser)

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
