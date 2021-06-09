import { Grid, Box, useTheme } from '@material-ui/core'
import { useForm, Controller } from 'react-hook-form'

import { ScrollableArea } from 'views/components/ScrollableArea'
import { QuestionWizard } from 'components/QuestionWizard'

import { getWeekdayName } from 'utils/date-utils'

import { getFormattedAppointmentDateTime } from '../../utils'
import {
  ClientInterested,
  OverallExperience,
  PriceOpinion,
  ListingRate
} from './types'
import {
  CLIENT_INTEREST_OPTIONS,
  OVERALL_EXPERIENCE_OPTIONS,
  PRICE_OPINION_OPTIONS,
  LISTING_RATE_OPTIONS
} from './constants'
import IntroStep from './Intro'
import MultiOptionQuestion from './components/MultiOptionQuestion'

interface FormFields {
  clientInterested: ClientInterested
  overallExperience: OverallExperience
  priceOpinion: PriceOpinion
  listingRate: ListingRate
}

interface Props {
  appointment: IPublicShowingAppointment<'showing'>
  onSubmit: () => Promise<void>
}

export default function ShowingAppointmentFeedbackForm({
  appointment,
  onSubmit
}: Props) {
  const theme = useTheme()
  // const wizard = useWizardContext()

  const { handleSubmit, control, formState } = useForm<FormFields>({
    mode: 'onChange'
  })

  const appointmentTime = new Date(appointment.time)

  return (
    <Grid item xs={12}>
      <Box mt={3} position="relative" height="80vh">
        <ScrollableArea
          hasInvisibleScrollbar
          shadowColor="transparent"
          style={{ position: 'absolute', height: '100%' }}
        >
          <QuestionWizard
            onFinish={console.log}
            styles={{ paddingRight: '2rem' }}
          >
            <IntroStep>
              <>
                Please let us know your feedback about the appointment on{' '}
                <span style={{ color: theme.palette.primary.main }}>
                  {getWeekdayName(appointmentTime)},{' '}
                  {getFormattedAppointmentDateTime(appointment)}
                </span>
                .
              </>
            </IntroStep>
            <Controller
              name="clientInterested"
              control={control}
              rules={{
                required: 'Required'
              }}
              defaultValue={null}
              render={({ onChange, value }) => {
                return (
                  <MultiOptionQuestion
                    goNext
                    question="Is your client interested in this listing?"
                    options={CLIENT_INTEREST_OPTIONS}
                    value={value}
                    onChange={onChange}
                  />
                )
              }}
            />
            <Controller
              name="overallExperience"
              control={control}
              rules={{
                required: 'Required'
              }}
              defaultValue={null}
              render={({ onChange, value }) => {
                return (
                  <MultiOptionQuestion
                    goNext
                    question="Please rate your overall experience at this showing"
                    options={OVERALL_EXPERIENCE_OPTIONS}
                    value={value}
                    onChange={onChange}
                  />
                )
              }}
            />
            <Controller
              name="priceOpinion"
              control={control}
              rules={{
                required: 'Required'
              }}
              defaultValue={null}
              render={({ onChange, value }) => {
                return (
                  <MultiOptionQuestion
                    goNext
                    question="Your and your client’s opinion of the price"
                    options={PRICE_OPINION_OPTIONS}
                    value={value}
                    onChange={onChange}
                  />
                )
              }}
            />
            <Controller
              name="listingRate"
              control={control}
              rules={{
                required: 'Required'
              }}
              defaultValue={null}
              render={({ onChange, value }) => {
                return (
                  <MultiOptionQuestion
                    question="Please rate this listing"
                    options={LISTING_RATE_OPTIONS}
                    value={value}
                    onChange={onChange}
                  />
                )
              }}
            />
          </QuestionWizard>
        </ScrollableArea>
      </Box>
    </Grid>
  )
}
