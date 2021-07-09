import { Grid, Box, useTheme, useMediaQuery } from '@material-ui/core'
import { useForm, Controller } from 'react-hook-form'

import { ScrollableArea } from 'views/components/ScrollableArea'
import { QuestionWizard } from 'components/QuestionWizard'

import { getFormattedAppointmentDateTime } from '../../utils'
import { FormFields } from './types'
import {
  CLIENT_INTEREST_QUESTION,
  LISTING_RATE_QUESTION,
  PRICE_OPINION_QUESTION,
  OVERALL_EXPERIENCE_QUESTION,
  COMMENTS_QUESTION,
  CLIENT_INTEREST_OPTIONS,
  LISTING_RATE_OPTIONS,
  PRICE_OPINION_OPTIONS,
  OVERALL_EXPERIENCE_OPTIONS
} from './constants'
import IntroStep from './Intro'
import MultiOptionQuestion from './components/MultiOptionQuestion'
import TextQuestion from './components/TextQuestion'

interface Props {
  appointment: IPublicShowingAppointment<'showing'>
  onSubmit: (data: FormFields) => Promise<void>
}

export default function ShowingAppointmentFeedbackForm({
  appointment,
  onSubmit
}: Props) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'))

  const { handleSubmit, control } = useForm<FormFields>({
    mode: 'onChange'
  })

  return (
    <Grid item xs={12}>
      <Box mt={3} position="relative" height="80vh">
        <form onSubmit={handleSubmit(onSubmit)}>
          <ScrollableArea
            hasInvisibleScrollbar
            shadowColor="transparent"
            style={{ position: 'absolute', height: '100%' }}
          >
            <QuestionWizard
              onFinish={console.log}
              styles={isMobile ? undefined : { paddingRight: '2rem' }}
            >
              <IntroStep>
                <>
                  We'd love to have your feedback from your{' '}
                  <span style={{ color: theme.palette.primary.main }}>
                    {getFormattedAppointmentDateTime(appointment)}
                  </span>{' '}
                  visit. Hope everything went as planned.
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
                      question={CLIENT_INTEREST_QUESTION}
                      options={CLIENT_INTEREST_OPTIONS}
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
                      goNext
                      question={LISTING_RATE_QUESTION}
                      options={LISTING_RATE_OPTIONS}
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
                      question={PRICE_OPINION_QUESTION}
                      options={PRICE_OPINION_OPTIONS}
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
                      question={OVERALL_EXPERIENCE_QUESTION}
                      options={OVERALL_EXPERIENCE_OPTIONS}
                      value={value}
                      onChange={onChange}
                    />
                  )
                }}
              />
              <Box>
                <Controller
                  name="comment"
                  control={control}
                  defaultValue={null}
                  render={({ onChange, value }) => {
                    return (
                      <TextQuestion
                        question={COMMENTS_QUESTION}
                        textFieldProps={{
                          placeholder: 'Enter comments or recommendations',
                          variant: 'outlined',
                          multiline: true,
                          fullWidth: true,
                          rows: 3
                        }}
                        nextButtonCopy="Done"
                        nextButtonProps={{
                          type: 'submit',
                          variant: 'contained',
                          color: 'primary'
                        }}
                        value={value}
                        onChange={onChange}
                      />
                    )
                  }}
                />
              </Box>
            </QuestionWizard>
          </ScrollableArea>
        </form>
      </Box>
    </Grid>
  )
}
