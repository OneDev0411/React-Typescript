import React from 'react'
import { Form } from 'react-final-form'
import { Box } from '@material-ui/core'
import { mdiCalendarMonthOutline } from '@mdi/js'

import { EventType } from 'components/EventDrawer/components/EventType'

import { BaseFormProps, EventFormData } from '../types'
import { BaseFormLayout } from '../components/BaseFormLayout'
import { Title } from '../components/BaseFields/Title'
import { Description } from '../components/BaseFields/Description'
import { getEventInitialValues } from '../helpers/get-initial-values'
import { eventFormPreSaveFormat } from '../helpers/pre-save-format'

export default function EventForm({
  index,
  step,
  disableEdit = false,
  prevStepOrder,
  onSubmit,
  onDelete,
  onMoveUpStep,
  onMoveDownStep
}: BaseFormProps) {
  return (
    <Form
      onSubmit={(data: EventFormData) => {
        const order = prevStepOrder ? prevStepOrder + 1 : index

        const newStep: IBrandFlowStepInput = eventFormPreSaveFormat(
          order,
          data,
          step
        )

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
            onMoveUpStep={onMoveUpStep}
            onMoveDownStep={onMoveDownStep}
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
