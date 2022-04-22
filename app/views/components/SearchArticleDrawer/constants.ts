import { RSSSource } from './types'

const businessJournalsImageSanitizer = (image: string) =>
  image.replace(/\*[^\.]+\./, '.')

export const RSS_SOURCES: RSSSource[] = [
  // TODO: Bot protection
  // {
  //   icon: 'https://assets-far.rdc.moveaws.com/static/assets/images/favicon.ico',
  //   title: 'realtor.com',
  //   url: 'https://www.realtor.com/news/feed/'
  // },
  {
    icon: 'https://14av231vas55424hmywyupd1-wpengine.netdna-ssl.com/blog/wp-content/uploads/2020/03/cropped-Redfin-logo-512x512-1-150x150.jpg',
    title: 'Redfin',
    url: 'https://www.redfin.com/blog/feed/'
  },
  {
    icon: 'https://assets.reastatic.net/realestate.com.au/favicon.ico',
    title: 'Real Estate',
    url: 'https://www.realestate.com.au/news/feed/'
  },
  {
    icon: 'https://www.nar.realtor/sites/default/files/favicons/favicon-16x16.png',
    title: 'National Association of REALTORS®',
    url: 'http://feeds.feedburner.com/nar/culture-scan'
  },
  {
    icon: 'https://www.nytimes.com/vi-assets/static-assets/favicon-d2483f10ef688e6f89e23806b9700298.ico',
    title: 'The New York Times',
    url: 'https://www.nytimes.com/svc/collections/v1/publish/https://www.nytimes.com/section/realestate/rss.xml'
  },
  {
    icon: 'https://www.cnbc.com/favicon.ico',
    title: 'CNBC',
    url: 'http://www.cnbc.com/id/10000115/device/rss'
  },
  {
    icon: 'https://i.forbesimg.com/48X48-F.png',
    title: 'Forbes',
    url: 'https://www.forbes.com/real-estate/feed/'
  },
  {
    icon: 'https://www.latimes.com/favicon-16x16.png',
    title: 'Los Angeles Times',
    url: 'https://www.latimes.com/business/realestate/rss2.0.xml'
  },
  {
    icon: 'https://assets.bizjournals.com/lib/img/favicon.ico',
    title: 'The Business Journals',
    url: 'http://feeds.bizjournals.com/industry_20',
    imageSanitizer: businessJournalsImageSanitizer
  },
  {
    icon: 'https://assets.bizjournals.com/lib/img/favicon.ico',
    title: 'The Business Journals',
    url: 'http://feeds.bizjournals.com/industry_21',
    imageSanitizer: businessJournalsImageSanitizer
  },
  // TODO: timeout issue
  // {
  //   icon: 'https://www.seattletimes.com/favicon-16x16.png?v=7kovnr5xE4',
  //   title: 'The Seattle Times',
  //   url: 'https://www.seattletimes.com/business/real-estate/feed/'
  // },
  {
    icon: 'https://www.sothebysrealty.com/favicon.ico',
    title: "Sotheby's",
    url: 'https://www.sothebysrealty.com/extraordinary-living-blog/feed/'
  },
  {
    icon: 'https://blog.firstam.com/hs-fs/hub/17501/file-1438823984-ico/Firstam-Theme/Images/favicon.ico',
    title: 'First American',
    url: 'https://blog.firstam.com/commercial/rss.xml'
  },
  {
    icon: 'https://static-ind-elliman-blog-production.gtsstatic.net/uploads/2020/03/Logo_V3_72dpi-150x150.png',
    title: 'Elliman Insider',
    url: 'https://www.elliman.com/insider/feed/'
  },
  {
    icon: 'http://blog.rismedia.com/wp-content/uploads/2021/05/Housecall-Favicon-21.png',
    title: "RISMedia's Housecall",
    url: 'http://blog.rismedia.com/feed/'
  },
  {
    icon: 'https://www.smcrealty.com/images/favicon.png',
    title: 'SMC Realty',
    url: 'https://www.smcrealty.com/blog/feed/'
  },
  {
    icon: 'https://assets.keepingcurrentmatters.com/wp-content/uploads/2020/12/favicon.png',
    title: 'Keeping Current Matters',
    url: 'https://www.keepingcurrentmatters.com/feed/'
  },
  {
    icon: 'https://www.housingwire.com/wp-content/uploads/2019/09/cropped-HW-logo1-e1615477616160.png?w=32',
    title: 'HousingWire',
    url: 'https://www.housingwire.com/feed'
  },
  {
    icon: 'https://resources.realestate.co.jp/favicons/apple-touch-icon-57x57.png?v=2',
    title: 'Real Estate Japan Resources',
    url: 'https://resources.realestate.co.jp/feed/'
  },
  {
    icon: 'https://www.brickunderground.com/sites/all/themes/brick_underground/favicon.ico',
    title: 'Brick Underground',
    url: 'https://www.brickunderground.com/rss.xml'
  },
  {
    icon: 'https://wellingtonhometeam.com/wp-content/uploads/2019/01/cropped-Favicon-2-32x32.jpg',
    title: 'Wellington Florida Homes for Sale and Real Estate',
    url: 'https://wellingtonhometeam.com/category/recent-wellington-florida-posts/feed/'
  },
  {
    icon: 'https://realtytimes.com/templates/shaper_news365/images/favicon.ico',
    title: 'Realty Times',
    url: 'https://realtytimes.com/headlines/itemlist/category/11-todaysheadlines?format=feed&Itemid=651'
  },
  {
    icon: 'https://www.hiltonhyland.com/wp-content/themes/hiltonhylandcom/frontend/images/favicon/favicon-16x16.png',
    title: 'Hilton & Hyland',
    url: 'https://www.hiltonhyland.com/blog/feed/'
  },
  {
    icon: 'https://www.luxuryrealestate.com/images/lion-head-white.svg',
    title: 'LuxuryRealEstate.com',
    url: 'https://www.luxuryrealestate.com/blog?format=rss'
  },
  {
    icon: 'https://www.houzz.com/favicon/favicon.ico',
    title: 'Houzz',
    url: 'http://feeds.feedburner.com/houzz'
  },
  {
    icon: 'https://www.latimes.com/favicon-16x16.png',
    title: 'Los Angeles Times',
    url: 'https://www.latimes.com/food/rss2.0.xml#nt=0000016c-0bf3-d57d-afed-2fff84fd0000-1col-7030col1'
  },
  {
    icon: 'https://www.latimes.com/favicon-16x16.png',
    title: 'Los Angeles Times',
    url: 'https://www.latimes.com/lifestyle/rss2.0.xml#nt=0000016c-0bf3-d57d-afed-2fff84fd0000-1col-7030col1'
  },
  {
    icon: 'https://www.briggsfreeman.com/blog/wp-content/uploads/2020/09/B_blog_logo_circle-200x200-1.jpg',
    title: 'Briggs Freeman',
    url: 'https://www.briggsfreeman.com/blog/feed/'
  }
]
