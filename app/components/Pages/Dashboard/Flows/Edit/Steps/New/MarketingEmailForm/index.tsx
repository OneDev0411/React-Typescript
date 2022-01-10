import { memo } from 'react'

import { Box } from '@material-ui/core'
import { mdiNewspaperVariantOutline } from '@mdi/js'
import { Form } from 'react-final-form'
import { useSelector } from 'react-redux'

import { selectActiveBrand } from '@app/selectors/brand'
import { selectUser } from '@app/selectors/user'

import { Description } from '../components/BaseFields/Description'
import { TemplateInctance } from '../components/BaseFields/TemplateInctance'
import { Title } from '../components/BaseFields/Title'
import { BaseFormLayout } from '../components/BaseFormLayout'
import { getMarketingEmailInitialValues } from '../helpers/get-initial-values'
import { marketingEmailFormPreSaveFormat } from '../helpers/pre-save-format'
import { BaseFormProps, MarketingEmailFormData } from '../types'

function MarketingEmailForm({
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
  const user = useSelector(selectUser)
  const brand = useSelector(selectActiveBrand)

  return (
    <Form
      onSubmit={async (data: MarketingEmailFormData) => {
        const order = prevStepOrder ? prevStepOrder + 1 : index

        const newStep: IBrandFlowStepInput =
          await marketingEmailFormPreSaveFormat(order, data, step ?? null, {
            user,
            brand
          })

        // Update step
        if (step) {
          return onSubmit(newStep, step.id)
        }

        // Create step
        return onSubmit(newStep)
      }}
      initialValues={getMarketingEmailInitialValues(step)}
      render={({ handleSubmit, submitting, pristine, values }) => {
        if (!pristine && makeDirtyStep && !isDirty) {
          makeDirtyStep()
        }

        return (
          <BaseFormLayout
            index={index}
            stepIcon={mdiNewspaperVariantOutline}
            title="Automated Marketing Email"
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
              <TemplateInctance
                disabled={disableEdit}
                currentTemplate={
                  step?.template_instance ?? step?.template ?? null
                }
              />
            </Box>
          </BaseFormLayout>
        )
      }}
    />
  )
}

export default memo(MarketingEmailForm)
