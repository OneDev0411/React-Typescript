import { Field } from 'react-final-form'

import { TemplateSelector } from './Selector'

const allMarketingTemplateType: IMarketingTemplateType[] = [
  'BackToSchool',
  'Birthday',
  'Blank',
  'Blog',
  'BoxingDay',
  'Brand',
  'ChineseNewYear',
  'Christmas',
  'ColumbusDay',
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
  'Kwanzaa',
  'LaborDay',
  'Layout',
  'MarketReport',
  'MemorialDay',
  'MLKDay',
  'MothersDay',
  'NewAgent',
  'Recruiting',
  'News',
  'Newsletter',
  'NewYear',
  'OtherHoliday',
  'Passover',
  'PatriotsDay',
  'Ramadan',
  'Recruitment',
  'RoshHashanah',
  'September11',
  'StPatrick',
  'Thanksgiving',
  'Testimonial',
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
  'YomKippur',
  'Announcements'
]

interface Props {
  disabled?: boolean
  currentTemplate?: Nullable<
    IMarketingTemplateInstance | IBrandMarketingTemplate
  >
}

export const TemplateInctance = ({
  disabled = false,
  currentTemplate = null
}: Props) => {
  const handleValidation = (value, allValues) => {
    if (allValues.title && allValues.event_type && !value) {
      return 'No Template selected'
    }
  }

  return (
    <Field
      name="template"
      label="template"
      validate={handleValidation}
      render={({ input: { onChange }, meta }) => {
        const showError = Boolean(meta.submitFailed && meta.error)

        return (
          <TemplateSelector
            disabled={disabled}
            templateTypes={allMarketingTemplateType}
            hasError={showError}
            error={meta.error}
            currentTemplate={currentTemplate}
            onChange={onChange}
          />
        )
      }}
    />
  )
}
