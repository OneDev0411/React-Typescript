import React, { useMemo } from 'react'
import { Form } from 'react-final-form'
import { Box } from '@material-ui/core'

import { mdiScriptTextOutline } from '@mdi/js'

import { BaseFormProps, BasicEmailFormData } from '../types'
import { BaseFormLayout } from '../components/BaseFormLayout'
import { Title } from '../components/BaseFields/Title'
import { Description } from '../components/BaseFields/Description'
import { EmailTemplate } from '../components/BaseFields/EmailTemplate'
import { convertToServerInput } from '../components/BaseFields/WaitFor/helpers'
import { getBasicEmailInitialValues } from '../helpers/get-initial-values'

interface Props extends BaseFormProps {
  defaultSelectedTemplate?: UUID
  templates: IBrandEmailTemplate[]
  onNewTemplateClick: () => void
}

export default function BasicEmailForm({
  index,
  step,
  disableEdit = false,
  templates,
  defaultSelectedTemplate,
  onSubmit,
  onDelete,
  onNewTemplateClick
}: Props) {
  const defaultTemplate = useMemo(
    () => (templates.find(({ id }) => id === defaultSelectedTemplate) || {}).id,
    [defaultSelectedTemplate, templates]
  )

  return (
    <Form
      onSubmit={(data: BasicEmailFormData) => {
        const newStep: IBrandFlowStepInput = {
          order: index,
          title: data.title,
          description: data.description,
          email: data.email_template,
          time: data.time,
          event_type: data.event_type,
          wait_for: convertToServerInput(data.wait_for)
        }

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
