const TEMPLATE_TYPE_LABEL_MAP: {
  [key in IMarketingTemplateType]: string
} = {
  Agent: 'Agent',
  AsSeenIn: 'As Seen In',
  BackToSchool: 'Back To School',
  Birthday: 'Birthday',
  Brand: 'Brand Campaigns',
  ChineseNewYear: 'Chinese New Year',
  Christmas: 'Christmas',
  ColumbusDay: 'Columbus Day',
  ComingSoon: 'Coming Soon',
  Contact: 'Contact',
  CrmOpenHouse: 'Open House Registration',
  DaylightSaving: 'Daylight Saving',
  Diwali: 'Diwali',
  Easter: 'Easter',
  FathersDay: "Father's Day",
  FourthOfJuly: 'Fourth of July',
  Halloween: 'Halloween',
  Hanukkah: 'Hanukkah',
  HomeAnniversary: 'Home Anniversary',
  IndependenceDay: 'Independence Day',
  JustListed: 'Just Listed',
  JustSold: 'Just Sold',
  Kwanzaa: 'Kwanzaa',
  LaborDay: 'Labor Day',
  Layout: 'Layout',
  Listing: 'Blank Layouts',
  ListingLayout: 'Blank Listing Layouts',
  Listings: 'Multi Properties',
  MLKDay: 'Martin Luther King Jr. Day',
  MemorialDay: 'Memorial Day',
  MothersDay: "Mother's Day",
  NewAgent: 'New Agent',
  NewYear: 'New Year',
  Newsletter: 'Newsletters',
  OpenHouse: 'Open House',
  OtherHoliday: 'Others',
  Passover: 'Passover',
  PatriotsDay: 'September 11',
  PriceImprovement: 'New Price',
  RoshHashanah: 'Rosh Hashanah',
  StPatrick: "St. Patrick's Day",
  Thanksgiving: 'Thanksgiving',
  UnderContract: 'Under Contract',
  Valentines: "Valentine's Day",
  VeteransDay: 'Veterans Day',
  WeddingAnniversary: 'Wedding Anniversary',
  WomansDay: "International Women's Day"
}

export function getTemplateTypeLabel(
  templateType: IMarketingTemplateType
): string {
  return TEMPLATE_TYPE_LABEL_MAP[templateType] ?? templateType
}
