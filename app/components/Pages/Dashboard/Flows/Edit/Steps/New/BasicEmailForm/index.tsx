import { memo } from 'react'

import { Box } from '@material-ui/core'
import { mdiScriptTextOutline } from '@mdi/js'
import { Form } from 'react-final-form'

import { Description } from '../components/BaseFields/Description'
import { EmailTemplate } from '../components/BaseFields/EmailTemplate'
import { Title } from '../components/BaseFields/Title'
import { BaseFormLayout } from '../components/BaseFormLayout'
import { getBasicEmailInitialValues } from '../helpers/get-initial-values'
import { basicEmailFormPreSaveFormat } from '../helpers/pre-save-format'
import { BaseFormProps, BasicEmailFormData } from '../types'

function BasicEmailForm({
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
      onSubmit={(data: BasicEmailFormData) => {
        const order = prevStepOrder ? prevStepOrder + 1 : index

        const newStep: IBrandFlowStepInput = basicEmailFormPreSaveFormat(
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
      initialValues={getBasicEmailInitialValues(step)}
      render={({ handleSubmit, submitting, pristine, values }) => {
        if (!pristine && makeDirtyStep && !isDirty) {
          makeDirtyStep()
        }

        return (
          <BaseFormLayout
            index={index}
            title="Automated Simple Email"
            stepIcon={mdiScriptTextOutline}
            step={step || null}
            disableEdit={disableEdit}
            submitting={submitting}
            pristine={pristine}
            onSubmit={handleSubmit}
            onDelete={onDelete}
            onMoveUpStep={onMoveUpStep}
            onMoveDownStep={onMoveDownStep}
          >
            <Box mb={2}>
              <Title
                label="Email Subject"
                textFieldProps={{ disabled: disableEdit }}
              />
            </Box>
            <Box mb={2}>
              <Description
                enabled={!!values.description}
                textFieldProps={{ disabled: disableEdit }}
              />
            </Box>
            <Box mb={2}>
              <EmailTemplate
                currentTemplateId={values.email_template}
                disabled={submitting || disableEdit}
              />
            </Box>
          </BaseFormLayout>
        )
      }}
    />
  )
}

export default memo(BasicEmailForm)
