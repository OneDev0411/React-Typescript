import { getTemplateTypeLabel } from '@app/utils/marketing-center/get-template-type-label'

export const TEMPLATE_TYPES: IMarketingTemplateType[] = [
  'AsSeenIn',
  'BackToSchool',
  'Birthday',
  'Blank',
  'Blog',
  'BoxingDay',
  'Brand',
  'ChineseNewYear',
  'Christmas',
  'ColumbusDay',
  'ComingSoon',
  'Contact',
  'CrmOpenHouse',
  'DaylightSaving',
  'Diwali',
  'Easter',
  'EidalFitr',
  'Event',
  'FathersDay',
  'FourthOfJuly',
  'Halloween',
  'Hanukkah',
  'HomeAnniversary',
  'IndependenceDay',
  'JustListed',
  'JustSold',
  'Kwanzaa',
  'LaborDay',
  'Layout',
  'Listing',
  'ListingLayout',
  'Listings',
  'MarketReport',
  'MemorialDay',
  'MLKDay',
  'MothersDay',
  'NewAgent',
  'Recruiting',
  'News',
  'Newsletter',
  'NewYear',
  'OpenHouse',
  'OtherHoliday',
  'Passover',
  'PatriotsDay',
  'PriceImprovement',
  'Ramadan',
  'Recruitment',
  'RoshHashanah',
  'September11',
  'StPatrick',
  'Thanksgiving',
  'UnderContract',
  'Valentines',
  'VeteransDay',
  'WeddingAnniversary',
  'WomansDay',
  'JuneTeenth',
  'FirstDayOfSummer',
  'Pride',
  'AsianAmericanAndPacificIslanderHeritageMonth',
  'BlackHistoryMonth',
  'EarthDay',
  'FirstDayOfSpring',
  'CincoDeMayo',
  'FirstDayOfFall',
  'FirstDayOfWinter',
  'YomKippur'
]

export const SORTED_TEMPLATE_TYPES_BY_LABEL: IMarketingTemplateType[] =
  TEMPLATE_TYPES.sort((a, b) =>
    getTemplateTypeLabel(a).localeCompare(getTemplateTypeLabel(b))
  )

export const MEDIUMS: IMarketingTemplateMedium[] = [
  'Email',
  'Social',
  'Letter',
  'LinkedInCover',
  'FacebookCover',
  'InstagramStory',
  'TwitterCover',
  'RealtorCover',
  'YouTubeCover'
]
