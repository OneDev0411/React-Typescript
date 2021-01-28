import React, { FunctionComponent } from 'react'
import { Form, Field } from 'react-final-form'
import { Grid, Box, Button, Typography, Tooltip } from '@material-ui/core'

import { SelectInput } from 'components/Forms/SelectInput'
import { MUITextInput } from 'components/Forms/MUITextInput'
import { Divider } from 'components/Divider'

import { ActionFooter } from '../components/ActionFooter'
import { MAX_STEP_TITLE_LENGTH } from '../../../../constants'

import {
  timeToSeconds,
  ONE_DAY_IN_SECONDS,
  humanizeSeconds,
  formatTimeDigits
} from '../../../helpers'
import {
  validateStringInput,
  validateInput,
  validateTimeInput
} from '../../../../helpers'

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

  const emailTemplatesDropdownItems = [
    {
      label: 'Select a template',
      value: null
    },
    ...templates.map(template => ({
      label: template.name,
      value: template.id
    }))
  ]

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
          <form style={{ width: '100%' }} onSubmit={handleSubmit} noValidate>
            <Grid container item xs={12} alignItems="center">
              <Grid item xs={6}>
                <Field
                  isRequired
                  name="email_template"
                  label="Email Template"
                  text="Select an email template"
                  items={emailTemplatesDropdownItems}
                  dropdownOptions={{
                    fullWidth: true
                  }}
                  validate={value => {
                    if (value) {
                      return
                    }

                    return 'No email template selected'
                  }}
                  component={SelectInput as FunctionComponent}
                />
              </Grid>
              <Grid container item xs={6} style={{ paddingLeft: '1rem' }}>
                {values.email_template && (
                  <>
                    <Tooltip title="Review or edit selected email template">
                      <Button
                        variant="text"
                        color="primary"
                        disabled={submitting}
                        onClick={event => {
                          event.stopPropagation()

                          const selectedTemplate = templates.find(
                            ({ id }) => id === values.email_template
                          )

                          if (!selectedTemplate) {
                            return
                          }

                          onReviewTemplateClick(selectedTemplate)
                        }}
                      >
                        Review
                      </Button>
                    </Tooltip>

                    <Divider vertical height="auto" margin="0.5rem" />
                  </>
                )}

                <Button
                  variant="text"
                  color="primary"
                  disabled={submitting}
                  onClick={event => {
                    event.stopPropagation()
                    onNewTemplateClick()
                  }}
                >
                  Create a New Email Template
                </Button>
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <Box mb={2}>
                <Field
                  autoFocus
                  validate={value =>
                    validateStringInput(
                      value,
                      'event title',
                      MAX_STEP_TITLE_LENGTH
                    )
                  }
                  name="title"
                  label="Title"
                  variant="outlined"
                  margin="dense"
                  autoComplete="off"
                  fullWidth
                  required
                  component={MUITextInput}
                />
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Box mb={2}>
                <Field
                  name="description"
                  label="Description"
                  variant="outlined"
                  margin="dense"
                  autoComplete="off"
                  fullWidth
                  multiline
                  component={MUITextInput}
                />
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
                  <Field
                    name="at"
                    label="At"
                    margin="dense"
                    autoComplete="off"
                    type="time"
                    variant="outlined"
                    required
                    InputLabelProps={{ shrink: true }}
                    validate={validateTimeInput}
                    component={MUITextInput}
                  />
                </Box>
              </Grid>
            </Grid>

            <ActionFooter
              step={step || null}
              isSubmiting={submitting}
              onDelete={onDelete}
              onCancel={onCancel}
            />
          </form>
        )
      }}
    />
  )
}
