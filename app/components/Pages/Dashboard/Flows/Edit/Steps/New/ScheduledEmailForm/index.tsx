import React from 'react'
import { Form } from 'react-final-form'
import { Grid, Box, Typography } from '@material-ui/core'

import { ActionFooter } from '../components/ActionFooter'
import { useCommonStyles } from '../styles'
import {
  timeToSeconds,
  ONE_DAY_IN_SECONDS,
  humanizeSeconds,
  formatTimeDigits
} from '../../../helpers'
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
                <Typography variant="subtitle1" className={commonClasses.title}>
                  Send A Marketing Email
                </Typography>
                <Grid
                  container
                  direction="row"
                  justify="flex-start"
                  alignItems="flex-start"
                >
                  <Grid item xl={4} lg={4} md={6} sm={7} xs={12}>
                    <Box mb={2}>
                      <Title />
                    </Box>
                    <Box mb={2}>
                      <Description />
                    </Box>
                    <Box>
                      <Time />
                    </Box>
                  </Grid>
                  <Grid
                    item
                    xl={3}
                    lg={3}
                    md={5}
                    sm={5}
                    xs={12}
                    className={commonClasses.extraItems}
                  >
                    <EmailTemplate
                      templates={templates}
                      currentTemplateId={values.email_template}
                      disabled={submitting}
                      onNewTemplateClick={onNewTemplateClick}
                      onReviewTemplateClick={onReviewTemplateClick}
                    />
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
