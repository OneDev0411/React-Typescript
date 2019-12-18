import { SectionsEnum } from 'components/PageSideNav/types'

import MyDesignsIcon from '../components/IconMyDesigns/IconMyDesigns'

const urlGenerator = (url: string): string => `/dashboard/marketing${url}`

export const SECTIONS = [
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
        title: 'Life Layouts',
        link: urlGenerator('/Layout')
      },
      {
        title: 'Newsletter',
        link: urlGenerator('/Newsletter')
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
        title: 'Properties Layout',
        link: urlGenerator('/ListingLayout')
      },
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
