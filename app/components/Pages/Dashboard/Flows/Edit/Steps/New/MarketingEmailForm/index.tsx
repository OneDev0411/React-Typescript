import React from 'react'
import { Form } from 'react-final-form'
import { Box } from '@material-ui/core'
import { mdiNewspaperVariantOutline } from '@mdi/js'

import { BaseFormProps, MarketingEmailFormData } from '../types'
import { BaseFormLayout } from '../components/BaseFormLayout'

import { Title } from '../components/BaseFields/Title'
import { Description } from '../components/BaseFields/Description'
import { TemplateInctance } from '../components/BaseFields/TemplateInctance'
import { getMarketingEmailInitialValues } from '../helpers/get-initial-values'
import { marketingEmailFormPreSaveFormat } from '../helpers/pre-save-format'

export default function MarketingEmailForm({
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
      onSubmit={(data: MarketingEmailFormData) => {
        const order = prevStepOrder ? prevStepOrder + 1 : index

        const newStep: IBrandFlowStepInput = marketingEmailFormPreSaveFormat(
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
      initialValues={getMarketingEmailInitialValues(step)}
      render={({ handleSubmit, submitting, pristine, values }) => {
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
              <Title textFieldProps={{ disabled: disableEdit }} />
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
                currentBrandTemplate={step?.template || null}
                currentTemplateInstance={step?.template_instance || null}
              />
            </Box>
          </BaseFormLayout>
        )
      }}
    />
  )
}
