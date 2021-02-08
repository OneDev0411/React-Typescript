import React from 'react'
import { Form } from 'react-final-form'
import { Grid, Box, Typography } from '@material-ui/core'

import { MarketingEmailFormData } from '../types'
import { ActionFooter } from '../components/ActionFooter'
import { useCommonStyles } from '../styles'

import { Title } from '../components/Title'
import { Description } from '../components/Description'
import { Time } from '../components/Time'
import { WaitFor } from '../components/WaitFor'
import { defaultWaitForValue } from '../components/WaitFor/Fields'
import {
  convertToWebInput,
  convertToServerInput
} from '../components/WaitFor/helpers'

interface Props {
  index: number
  step?: IBrandFlowStep
  onDelete?: (data: IBrandFlowStep) => Promise<any>
  onSubmit: (data: IBrandFlowStepInput, stepId?: UUID) => Promise<any>
  onCancel: () => void
}

export default function MarketingEmailForm({
  index,
  step,
  onSubmit,
  onCancel,
  onDelete
}: Props) {
  const commonClasses = useCommonStyles()

  function getInitialValues(stepData?: IBrandFlowStep): MarketingEmailFormData {
    if (!stepData || !stepData.email) {
      return {
        template_instance: 'ddadas',
        title: '',
        wait_for: defaultWaitForValue,
        time: '08:00'
      }
    }

    return {
      template_instance: 'dsdfsd',
      title: stepData.title,
      description: stepData.description,
      wait_for: convertToWebInput(stepData.wait_for),
      time: stepData.time
    }
  }

  return (
    <Form
      onSubmit={(data: MarketingEmailFormData) => {
        const newStep: IBrandFlowStepInput = {
          order: index,
          title: data.title,
          description: data.description,
          template_instance: 'asas',
          time: data.time,
          event_type: 'last_step_date',
          wait_for: convertToServerInput(data.wait_for)
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
                    <Box mb={2}>
                      <WaitFor />
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
                    sdfsd
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
