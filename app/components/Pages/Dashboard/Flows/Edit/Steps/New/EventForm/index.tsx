import React from 'react'
import { Form } from 'react-final-form'
import { Grid, Box, Typography } from '@material-ui/core'

import { EventType } from 'components/EventDrawer/components/EventType'

import { ActionFooter } from '../components/ActionFooter'
import { useCommonStyles } from '../styles'
import { Title } from '../components/Title'
import { Description } from '../components/Description'
import { Time } from '../components/Time'

interface FormData
  extends Pick<
    IBrandFlowStepInput,
    'title' | 'description' | 'wait_for' | 'time'
  > {
  task_type: {
    title: string
    value: TTaskType
  }
}

interface Props {
  index: number
  step?: IBrandFlowStep
  onDelete?: (data: IBrandFlowStep) => Promise<any>
  onSubmit: (data: IBrandFlowStepInput, stepId?: UUID) => Promise<any>
  onCancel: () => void
}

export default function EventForm({
  index,
  step,
  onSubmit,
  onCancel,
  onDelete
}: Props) {
  const commonClasses = useCommonStyles()

  function getInitialValues(stepData?: IBrandFlowStep): FormData {
    if (!stepData || !stepData.event) {
      return {
        task_type: {
          value: 'Call',
          title: 'Call'
        },
        title: '',
        wait_for: {
          days: 1
        },
        time: '08:00'
      }
    }

    return {
      task_type: {
        value: stepData.event.task_type,
        title: stepData.event.task_type
      },
      title: stepData.title,
      description: stepData.description,
      time: stepData.time,
      wait_for: {
        days: 3434
      }
    }
  }

  return (
    <Form
      onSubmit={(data: FormData) => {
        const newStep: IBrandFlowStepInput = {
          order: index,
          title: data.title,
          description: data.description,
          event_type: 'last_step_date',
          event: {
            title: data.title,
            description: data.description,
            task_type: data.task_type.value
          },
          time: data.time,
          wait_for: {
            days: 1
          }
        }

        // Update step
        if (step) {
          return onSubmit(newStep, step.id)
        }

        // Create step
        return onSubmit(newStep)
      }}
      initialValues={getInitialValues(step)}
      render={({ handleSubmit, submitting }) => {
        return (
          <Box className={commonClasses.container}>
            <form style={{ width: '100%' }} onSubmit={handleSubmit} noValidate>
              <Box className={commonClasses.content}>
                <Typography variant="subtitle1" className={commonClasses.title}>
                  Add a reminder for
                </Typography>
                <Grid
                  container
                  direction="row"
                  justify="flex-start"
                  alignItems="flex-start"
                >
                  <Grid item xl={4} lg={4} md={6} sm={7} xs={12}>
                    <Box mb={2.5}>
                      <EventType />
                    </Box>
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
