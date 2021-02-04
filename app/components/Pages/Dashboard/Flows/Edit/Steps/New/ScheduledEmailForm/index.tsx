import React from 'react'
import { Form, Field } from 'react-final-form'
import { Grid, Box, Typography } from '@material-ui/core'

import { MUITextInput } from 'components/Forms/MUITextInput'

import { ActionFooter } from '../components/ActionFooter'
import { useCommonStyles } from '../styles'
import {
  timeToSeconds,
  ONE_DAY_IN_SECONDS,
  humanizeSeconds,
  formatTimeDigits
} from '../../../helpers'
import { validateInput } from '../../../../helpers'
import { Title } from '../components/Title'
import { Description } from '../components/Description'
import { Time } from '../components/Time'
import { EmailTemplate } from '../components/EmailTemplate'

interface FormData {
  email_template: UUID
  title: string
  description?: string
  wait_for: number
  at: string
}

interface Props {
  startFrom?: number
  step?: IBrandFlowStep
  defaultSelectedTemplate?: UUID
  templates: IBrandEmailTemplate[]
  onDelete?: (data: IBrandFlowStep) => Promise<any>
  onSubmit: (data: IBrandFlowStepInput, stepId?: UUID) => Promise<any>
  onCancel: () => void
  onNewTemplateClick: () => void
  onReviewTemplateClick: (template: IBrandEmailTemplate) => void
}

export default function ScheduledEmailForm({
  startFrom = 0,
  step,
  templates,
  defaultSelectedTemplate,
  onSubmit,
  onCancel,
  onDelete,
  onNewTemplateClick,
  onReviewTemplateClick
}: Props) {
  const commonClasses = useCommonStyles()

  function getInitialValues(stepData?: IBrandFlowStep): FormData {
    if (!stepData || !stepData.email) {
      return {
        email_template:
          (templates.find(({ id }) => id === defaultSelectedTemplate) || {})
            .id || '',
        title: '',
        wait_for: 1,
        at: '08:00'
      }
    }

    const { days } = humanizeSeconds(stepData.due_in - startFrom)
    const { hours, minutes } = humanizeSeconds(
      stepData.due_in - days * ONE_DAY_IN_SECONDS
    )
    const at = `${formatTimeDigits(hours)}:${formatTimeDigits(minutes)}`

    return {
      email_template:
        (templates.find(({ id }) => id === defaultSelectedTemplate) || {}).id ||
        stepData.email.id,
      title: stepData.title,
      description: stepData.description,
      wait_for: days,
      at
    }
  }

  return (
    <Form
      onSubmit={(data: FormData) => {
        const dueIn =
          data.wait_for * ONE_DAY_IN_SECONDS +
          timeToSeconds(data.at) +
          startFrom

        const newStep: IBrandFlowStepInput = {
          title: data.title,
          description: data.description,
          due_in: dueIn,
          email: data.email_template
        }

        // Update step
        if (step) {
          return onSubmit(newStep, step.id)
        }

        // Create step
        return onSubmit(newStep)
      }}
      initialValues={getInitialValues(step)}
      render={({ handleSubmit, submitting, values }) => {
        return (
          <Box className={commonClasses.container}>
            <form style={{ width: '100%' }} onSubmit={handleSubmit} noValidate>
              <Box className={commonClasses.content}>
                <Grid container item xs={12} alignItems="center">
                  <Grid item xs={6}>
                    <EmailTemplate
                      templates={templates}
                      currentTemplateId={values.email_template}
                      disabled={submitting}
                      onNewTemplateClick={onNewTemplateClick}
                      onReviewTemplateClick={onReviewTemplateClick}
                    />
                  </Grid>
                </Grid>

                <Grid item xs={12}>
                  <Box mb={2}>
                    <Title />
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <Box mb={2}>
                    <Description />
                  </Box>
                </Grid>

                <Grid container item xs={12}>
                  <Grid container item xs={3}>
                    <Box mb={2}>
                      <Field
                        name="wait_for"
                        label="Wait for"
                        type="number"
                        min="1"
                        max="365"
                        variant="outlined"
                        margin="dense"
                        autoComplete="off"
                        required
                        validate={value =>
                          validateInput(value, 'wait days', () => {
                            return value >= 0 && value <= 365
                          })
                        }
                        component={MUITextInput}
                      />
                    </Box>
                  </Grid>

                  <Grid container item alignItems="flex-start" xs={5}>
                    <Box mb={2} pt={2} pl={1}>
                      <Typography variant="subtitle2" color="textSecondary">
                        days after{' '}
                        {startFrom === 0 ? 'Flow start' : 'previous step'}
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid container item xs={4} justify="flex-end">
                    <Box mb={2}>
                      <Time />
                    </Box>
                  </Grid>
                </Grid>
              </Box>
              <ActionFooter
                step={step || null}
                isSubmiting={submitting}
                onDelete={onDelete}
                onCancel={onCancel}
              />
            </form>
          </Box>
        )
      }}
    />
  )
}
