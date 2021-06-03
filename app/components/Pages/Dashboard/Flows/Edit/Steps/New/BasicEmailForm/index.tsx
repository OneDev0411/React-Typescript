import React, { useMemo } from 'react'
import { Form } from 'react-final-form'
import { Box } from '@material-ui/core'

import { mdiScriptTextOutline } from '@mdi/js'

import { BaseFormProps, BasicEmailFormData } from '../types'
import { BaseFormLayout } from '../components/BaseFormLayout'
import { Title } from '../components/BaseFields/Title'
import { Description } from '../components/BaseFields/Description'
import { EmailTemplate } from '../components/BaseFields/EmailTemplate'
import { getBasicEmailInitialValues } from '../helpers/get-initial-values'
import { basicEmailFormPreSaveFormat } from '../helpers/pre-save-format'

interface Props extends BaseFormProps {
  defaultSelectedTemplate?: UUID
  templates: IBrandEmailTemplate[]
  onNewTemplateClick: () => void
}

export default function BasicEmailForm({
  index,
  step,
  disableEdit = false,
  prevStepOrder,
  templates,
  defaultSelectedTemplate,
  onSubmit,
  onDelete,
  onMoveUpStep,
  onMoveDownStep,
  onNewTemplateClick
}: Props) {
  const defaultTemplate = useMemo(
    () => (templates.find(({ id }) => id === defaultSelectedTemplate) || {}).id,
    [defaultSelectedTemplate, templates]
  )

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
      initialValues={getBasicEmailInitialValues(step, defaultTemplate)}
      render={({ handleSubmit, submitting, pristine, values }) => {
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
              <Title textFieldProps={{ disabled: disableEdit }} />
            </Box>
            <Box mb={2}>
              <Description
                enabled={!!values.description}
                textFieldProps={{ disabled: disableEdit }}
              />
            </Box>
            <Box mb={2}>
              <EmailTemplate
                templates={templates}
                currentTemplateId={values.email_template}
                disabled={submitting || disableEdit}
                onNewTemplateClick={onNewTemplateClick}
              />
            </Box>
          </BaseFormLayout>
        )
      }}
    />
  )
}
