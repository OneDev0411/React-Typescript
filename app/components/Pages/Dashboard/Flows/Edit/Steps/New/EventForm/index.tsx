import React from 'react'
import { Form, Field } from 'react-final-form'
import { Grid, Box, Typography } from '@material-ui/core'

import { MUITextInput } from 'components/Forms/MUITextInput'

import { TaskType } from 'components/NewEvent/components/TaskType'

import { ActionFooter } from '../components/ActionFooter'
import { useCommonStyles } from '../styles'
import {
  timeToSeconds,
  ONE_DAY_IN_SECONDS,
  humanizeSeconds,
  formatTimeDigits
} from '../../../helpers'
import { validateInput, validateTimeInput } from '../../../../helpers'
import { Title } from '../components/Title'

interface FormData {
  task_type: {
    title: string
    value: TTaskType
  }
  title: string
  description?: string
  wait_for: number
  at: string
}

interface Props {
  startFrom?: number
  step?: IBrandFlowStep
  onDelete?: (data: IBrandFlowStep) => Promise<any>
  onSubmit: (data: IBrandFlowStepInput, stepId?: UUID) => Promise<any>
  onCancel: () => void
}

export default function EventForm({
  startFrom = 0,
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
        wait_for: 1,
        at: '08:00'
      }
    }

    const { hours, minutes } = humanizeSeconds(stepData.due_in)
    const at = `${formatTimeDigits(hours)}:${formatTimeDigits(minutes)}`

    return {
      task_type: {
        value: stepData.event.task_type,
        title: stepData.event.task_type
      },
      title: stepData.title,
      description: stepData.description,
      wait_for: stepData.wait_days,
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
          event: {
            title: data.title,
            description: data.description,
            task_type: data.task_type.value
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
                <Grid item xs={12}>
                  <Box mb={2}>
                    <TaskType />
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <Box mb={2}>
                    <Title />
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
