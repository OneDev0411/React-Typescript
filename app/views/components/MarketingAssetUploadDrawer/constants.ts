import { getTemplateTypeLabel } from '@app/utils/marketing-center/get-template-type-label'

export const TEMPLATE_TYPES: IMarketingTemplateType[] = [
  'AsSeenIn',
  'BackToSchool',
  'Birthday',
  'Blank',
  'Blog',
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
  'News',
  'Newsletter',
  'NewYear',
  'OpenHouse',
  'OtherHoliday',
  'Passover',
  'PatriotsDay',
  'PriceImprovement',
  'Recruitment',
  'RoshHashanah',
  'September11',
  'StPatrick',
  'Thanksgiving',
  'UnderContract',
  'Valentines',
  'VeteransDay',
  'WeddingAnniversary',
  'WomansDay'
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
