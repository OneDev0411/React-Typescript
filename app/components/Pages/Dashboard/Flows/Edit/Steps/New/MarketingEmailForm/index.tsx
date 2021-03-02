import React from 'react'
import { Form } from 'react-final-form'
import { Box } from '@material-ui/core'
import { mdiNewspaperVariantOutline } from '@mdi/js'

import { BaseFormProps, MarketingEmailFormData } from '../types'
import { BaseFormLayout } from '../components/BaseFormLayout'

import { Title } from '../components/BaseFields/Title'
import { Description } from '../components/BaseFields/Description'
import { TemplateInctance } from '../components/BaseFields/TemplateInctance'
import { defaultWaitForValue } from '../components/BaseFields/WaitFor/Fields'
import {
  convertToWebInput,
  convertToServerInput
} from '../components/BaseFields/WaitFor/helpers'
import { getInitialTemplateValue } from './helpers'

export default function MarketingEmailForm({
  index,
  step,
  disableEdit = false,
  onSubmit,
  onDelete
}: BaseFormProps) {
  function getInitialValues(stepData?: IBrandFlowStep): MarketingEmailFormData {
    if (!stepData) {
      return {
        template: null,
        title: '',
        wait_for: defaultWaitForValue,
        time: '08:00',
        event_type: ''
      }
    }

    return {
      template: getInitialTemplateValue(stepData),
      title: stepData.title,
      description: stepData.description,
      wait_for: convertToWebInput(stepData.wait_for),
      event_type: stepData.event_type,
      time: stepData.time
    }
  }

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
      initialValues={getInitialValues(step)}
      render={({ handleSubmit, submitting, pristine }) => {
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
              <Title />
            </Box>
            <Box mb={2}>
              <Description />
            </Box>
            <Box mb={2}>
              <TemplateInctance
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
