import React from 'react'
import { Form } from 'react-final-form'
import { Box } from '@material-ui/core'
import { mdiCalendarMonthOutline } from '@mdi/js'

import { EventType } from 'components/EventDrawer/components/EventType'

import { BaseFormProps, EventFormData } from '../types'
import { BaseFormLayout } from '../components/BaseFormLayout'
import { Title } from '../components/BaseFields/Title'
import { Description } from '../components/BaseFields/Description'
import { convertToServerInput } from '../components/BaseFields/WaitFor/helpers'
import { getEventInitialValues } from '../helpers/get-initial-values'

export default function EventForm({
  index,
  step,
  disableEdit = false,
  onSubmit,
  onDelete
}: BaseFormProps) {
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
      initialValues={getEventInitialValues(step)}
      render={({ handleSubmit, submitting, pristine, values }) => {
        return (
          <BaseFormLayout
            index={index}
            title="Reminder"
            stepIcon={mdiCalendarMonthOutline}
            step={step || null}
            disableEdit={disableEdit}
            submitting={submitting}
            pristine={pristine}
            onSubmit={handleSubmit}
            onDelete={onDelete}
          >
            <Box mb={2.5}>
              <EventType disabled={disableEdit} />
            </Box>
            <Box mb={2}>
              <Title textFieldProps={{ disabled: disableEdit }} />
            </Box>
            <Box mb={2}>
              <Description
                enabled={!!values.description}
                textFieldProps={{ disabled: disableEdit }}
              />
            </Box>
          </BaseFormLayout>
        )
      }}
    />
  )
}
