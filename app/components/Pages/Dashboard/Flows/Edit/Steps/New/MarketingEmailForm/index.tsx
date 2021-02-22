import React from 'react'
import { Form } from 'react-final-form'
import { Grid, Box, Typography } from '@material-ui/core'

import { MarketingEmailFormData } from '../types'
import { ActionFooter } from '../components/ActionFooter'
import { useCommonStyles } from '../styles'

import { Title } from '../components/BaseFields/Title'
import { Description } from '../components/BaseFields/Description'
import { Time } from '../components/BaseFields/Time'
import { TemplateInctance } from '../components/BaseFields/TemplateInctance'
import { WaitFor } from '../components/BaseFields/WaitFor'
import { EventType } from '../components/BaseFields/EventType'
import { defaultWaitForValue } from '../components/BaseFields/WaitFor/Fields'
import {
  convertToWebInput,
  convertToServerInput
} from '../components/BaseFields/WaitFor/helpers'
import { getInitialTemplateValue } from './helpers'

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
    if (!stepData) {
      return {
        template: null,
        title: '',
        wait_for: defaultWaitForValue,
        time: '08:00',
        event_type: ''
      }
    }

    return {
      template: getInitialTemplateValue(stepData),
      title: stepData.title,
      description: stepData.description,
      wait_for: convertToWebInput(stepData.wait_for),
      event_type: stepData.event_type,
      time: stepData.time
    }
  }

  return (
    <Form
      onSubmit={(data: MarketingEmailFormData) => {
        const template = data.template?.isInstance
          ? { template_instance: data.template?.id }
          : { template: data.template?.id }

        const newStep: IBrandFlowStepInput = {
          order: index,
          title: data.title,
          description: data.description,
          time: data.time,
          event_type: data.event_type,
          wait_for: convertToServerInput(data.wait_for),
          ...template
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
            <form onSubmit={handleSubmit} noValidate>
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
                    <Box mb={2}>
                      <EventType />
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
                    <TemplateInctance
                      currentBrandTemplate={step?.template || null}
                      currentTemplateInstance={step?.template_instance || null}
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
