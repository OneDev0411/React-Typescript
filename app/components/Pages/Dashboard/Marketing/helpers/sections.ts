import MyDesignsIcon from '../components/IconMyDesigns/IconMyDesigns'

const urlGenerator = (url: string): string => `/dashboard/marketing${url}`

export const SECTIONS = [
  {
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
    title: 'Celebrations',
    items: [
      {
        title: 'Birthday',
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
    title: 'Listings',
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
        title: 'Multi Listings',
        link: urlGenerator('/Listings')
      }
    ]
  }
]
