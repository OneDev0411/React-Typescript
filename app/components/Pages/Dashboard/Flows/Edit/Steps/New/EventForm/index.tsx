import React from 'react'
import { Form } from 'react-final-form'
import { Box } from '@material-ui/core'

import { EventType } from 'components/EventDrawer/components/EventType'

import { BaseFormProps, EventFormData } from '../types'
import { BaseFormLayout } from '../components/BaseFormLayout'
import { Title } from '../components/BaseFields/Title'
import { Description } from '../components/BaseFields/Description'
import { defaultWaitForValue } from '../components/BaseFields/WaitFor/Fields'
import {
  convertToWebInput,
  convertToServerInput
} from '../components/BaseFields/WaitFor/helpers'

export default function EventForm({
  index,
  step,
  disableEdit = false,
  onSubmit,
  onDelete
}: BaseFormProps) {
  function getInitialValues(stepData?: IBrandFlowStep): EventFormData {
    if (!stepData || !stepData.event) {
      return {
        task_type: {
          value: 'Call',
          title: 'Call'
        },
        title: '',
        event_type: '',
        wait_for: defaultWaitForValue,
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
      event_type: stepData.event_type,
      wait_for: convertToWebInput(stepData.wait_for)
    }
  }

  return (
    <Form
      onSubmit={(data: EventFormData) => {
        const newStep: IBrandFlowStepInput = {
          order: index,
          title: data.title,
          description: data.description,
          event_type: data.event_type,
          event: {
            title: data.title,
            description: data.description,
            task_type: data.task_type.value
          },
          time: data.time,
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
      render={({ handleSubmit, submitting }) => {
        return (
          <BaseFormLayout
            index={index}
            title="Reminder"
            step={step || null}
            disableEdit={disableEdit}
            submitting={submitting}
            onSubmit={handleSubmit}
            onDelete={onDelete}
          >
            <Box mb={2.5}>
              <EventType />
            </Box>
            <Box mb={2}>
              <Title />
            </Box>
            <Box mb={2}>
              <Description />
            </Box>
          </BaseFormLayout>
        )
      }}
    />
  )
}
