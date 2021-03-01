import React from 'react'

import EventForm from '../New/EventForm'

import BasicEmailForm from '../New/BasicEmailForm'
import MarketingEmailForm from '../New/MarketingEmailForm'

interface Props {
  disableEdit: boolean
  index: number
  step: IBrandFlowStep
  emailTemplates: IBrandEmailTemplate[]
  defaultSelectedEmailTemplate?: UUID
  onDelete: (step: IBrandFlowStep) => Promise<any>
  onUpdate: (step: IBrandFlowStepInput, stepId: UUID) => Promise<any>
  onNewEmailTemplateClick: () => void
}

export default function Item({
  disableEdit,
  index,
  step,
  emailTemplates,
  defaultSelectedEmailTemplate,
  onDelete,
  onUpdate,
  onNewEmailTemplateClick
}: Props) {
  const renderEditForm = () => {
    if (!step) {
      return null
    }

    if (step.event) {
      return (
        <EventForm
          index={index}
          step={step}
          disableEdit={disableEdit}
          onSubmit={onUpdate}
          onDelete={() => onDelete(step)}
        />
      )
    }

    if (step.email) {
      return (
        <BasicEmailForm
          index={index}
          step={step}
          disableEdit={disableEdit}
          templates={emailTemplates}
          onSubmit={onUpdate}
          onDelete={() => onDelete(step)}
          defaultSelectedTemplate={defaultSelectedEmailTemplate}
          onNewTemplateClick={onNewEmailTemplateClick}
        />
      )
    }

    if (step.template || step.template_instance) {
      return (
        <MarketingEmailForm
          index={index}
          step={step}
          disableEdit={disableEdit}
          onSubmit={onUpdate}
          onDelete={() => onDelete(step)}
        />
      )
    }
  }

  return <>{renderEditForm()}</>
}
