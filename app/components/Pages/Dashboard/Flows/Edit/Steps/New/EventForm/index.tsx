import { memo } from 'react'

import { Box } from '@material-ui/core'
import { mdiCalendarMonthOutline } from '@mdi/js'
import { Form } from 'react-final-form'

import { EventType } from 'components/EventDrawer/components/EventType'

import { Description } from '../components/BaseFields/Description'
import { Title } from '../components/BaseFields/Title'
import { BaseFormLayout } from '../components/BaseFormLayout'
import { getEventInitialValues } from '../helpers/get-initial-values'
import { eventFormPreSaveFormat } from '../helpers/pre-save-format'
import { BaseFormProps, EventFormData } from '../types'

function EventForm({
  index,
  step,
  isDirty = false,
  disableEdit = false,
  prevStepOrder,
  onSubmit,
  onDelete,
  onMoveUpStep,
  makeDirtyStep,
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
        if (!pristine && makeDirtyStep && !isDirty) {
          makeDirtyStep()
        }

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

export default memo(EventForm)
