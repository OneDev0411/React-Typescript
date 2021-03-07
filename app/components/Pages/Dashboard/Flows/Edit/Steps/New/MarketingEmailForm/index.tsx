import React from 'react'
import { Form } from 'react-final-form'
import { Box } from '@material-ui/core'
import { mdiNewspaperVariantOutline } from '@mdi/js'

import { BaseFormProps, MarketingEmailFormData } from '../types'
import { BaseFormLayout } from '../components/BaseFormLayout'

import { Title } from '../components/BaseFields/Title'
import { Description } from '../components/BaseFields/Description'
import { TemplateInctance } from '../components/BaseFields/TemplateInctance'
import { convertToServerInput } from '../components/BaseFields/WaitFor/helpers'
import { getMarketingEmailInitialValues } from '../helpers/get-initial-values'

export default function MarketingEmailForm({
  index,
  step,
  disableEdit = false,
  onSubmit,
  onDelete
}: BaseFormProps) {
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
