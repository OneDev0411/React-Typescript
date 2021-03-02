import React from 'react'
import { Form } from 'react-final-form'
import { Box } from '@material-ui/core'

import { mdiScriptTextOutline } from '@mdi/js'

import { BaseFormProps, BasicEmailFormData } from '../types'
import { BaseFormLayout } from '../components/BaseFormLayout'
import { Title } from '../components/BaseFields/Title'
import { Description } from '../components/BaseFields/Description'
import { EmailTemplate } from '../components/BaseFields/EmailTemplate'
import { defaultWaitForValue } from '../components/BaseFields/WaitFor/Fields'
import {
  convertToWebInput,
  convertToServerInput
} from '../components/BaseFields/WaitFor/helpers'

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
  function getInitialValues(stepData?: IBrandFlowStep): BasicEmailFormData {
    if (!stepData || !stepData.email) {
      return {
        email_template:
          (templates.find(({ id }) => id === defaultSelectedTemplate) || {})
            .id || '',
        title: '',
        wait_for: defaultWaitForValue,
        time: '08:00',
        event_type: ''
      }
    }

    return {
      email_template:
        (templates.find(({ id }) => id === defaultSelectedTemplate) || {}).id ||
        stepData.email.id,
      title: stepData.title,
      description: stepData.description,
      wait_for: convertToWebInput(stepData.wait_for),
      event_type: stepData.event_type,
      time: stepData.time
    }
  }

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
      initialValues={getInitialValues(step)}
      render={({ handleSubmit, submitting, values, pristine }) => {
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
              <Title />
            </Box>
            <Box mb={2}>
              <Description />
            </Box>
            <Box mb={2}>
              <EmailTemplate
                templates={templates}
                currentTemplateId={values.email_template}
                disabled={submitting}
                onNewTemplateClick={onNewTemplateClick}
              />
            </Box>
          </BaseFormLayout>
        )
      }}
    />
  )
}
