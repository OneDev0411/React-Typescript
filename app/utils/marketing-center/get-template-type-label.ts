const TEMPLATE_TYPE_LABEL_MAP: {
  [key in IMarketingTemplateType]: string
} = {
  Agent: 'Agent',
  AsSeenIn: 'As Seen In',
  BackToSchool: 'Back To School',
  Birthday: 'Birthday',
  Blank: 'Blank',
  Blog: 'Blog Content',
  BoxingDay: 'Boxing Day',
  Brand: 'Brand Campaigns',
  ChineseNewYear: 'Lunar New Year',
  Christmas: 'Christmas',
  CMA: 'CMA',
  ColumbusDay: 'Columbus Day',
  ComingSoon: 'Coming Soon',
  Contact: 'Contact',
  CrmOpenHouse: 'Open House Registration',
  DaylightSaving: 'Daylight Saving',
  Diwali: 'Diwali',
  Easter: 'Easter',
  EidalFitr: 'Eid al-Fitr',
  Event: 'Events',
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
  Listing: ' Listing Website',
  ListingLayout: 'Blank Listing Layouts',
  Listings: 'Multi Properties',
  MarketReport: 'Market Reports',
  MemorialDay: 'Memorial Day',
  MLKDay: 'Martin Luther King Jr. Day',
  MothersDay: "Mother's Day",
  NewAgent: 'New Agent',
  Recruiting: 'Recruiting',
  News: 'Brand News',
  Newsletter: 'Newsletters',
  NewYear: 'New Year',
  OpenHouse: 'Open House',
  OtherHoliday: 'Others',
  Passover: 'Passover',
  PatriotsDay: "Patriots' Day",
  PriceImprovement: 'New Price',
  Ramadan: 'Ramadan',
  Recruitment: 'Recruitment',
  RoshHashanah: 'Rosh Hashanah',
  September11: 'September 11',
  StPatrick: "St. Patrick's Day",
  Thanksgiving: 'Thanksgiving',
  UnderContract: 'Under Contract',
  Valentines: "Valentine's Day",
  VeteransDay: 'Veterans Day',
  WeddingAnniversary: 'Wedding Anniversary',
  WomansDay: "International Women's Day",
  JuneTeenth: 'JuneTeenth',
  FirstDayOfSummer: 'Summer',
  Pride: 'Pride',
  AsianAmericanAndPacificIslanderHeritageMonth:
    'Asian American & Pacific Islander Heritage Month',
  BlackHistoryMonth: 'Black History Month',
  EarthDay: 'Earth Day',
  FirstDayOfSpring: 'Spring',
  CincoDeMayo: 'Cinco De Mayo',
  FirstDayOfFall: 'Fall',
  FirstDayOfWinter: 'Winter',
  YomKippur: 'Yom Kippur',
  Announcements: 'Announcements'
}

export function getTemplateTypeLabel(
  templateType: IMarketingTemplateType
): string {
  return TEMPLATE_TYPE_LABEL_MAP[templateType] ?? templateType
}
