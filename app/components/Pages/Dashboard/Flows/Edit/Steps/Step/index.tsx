import React from 'react'

import EventForm from '../New/EventForm'

import BasicEmailForm from '../New/BasicEmailForm'
import MarketingEmailForm from '../New/MarketingEmailForm'

interface Props {
  index: number
  step: IBrandFlowStep
  prevStep?: Nullable<IBrandFlowStep>
  disableEdit: boolean
  isLastStep: boolean
  emailTemplates: IBrandEmailTemplate[]
  defaultSelectedEmailTemplate?: UUID
  onDelete: (step: IBrandFlowStep) => Promise<any>
  onUpdate: (step: IBrandFlowStepInput, stepId: UUID) => Promise<any>
  onStepMove: (
    stepId: UUID,
    sourceIndex: number,
    destinationIndex: number
  ) => Promise<any>
  onNewEmailTemplateClick: () => void
}

export function Step({
  step,
  index,
  prevStep,
  isLastStep,
  disableEdit,
  emailTemplates,
  defaultSelectedEmailTemplate,
  onDelete,
  onUpdate,
  onStepMove,
  onNewEmailTemplateClick
}: Props) {
  const prevStepOrder = prevStep ? prevStep.order : null

  const handleMoveUpStep = () => {
    if (index <= 1) {
      return
    }

    const destination = index - 1

    onStepMove(step.id, index, destination)
  }

  const handleMoveDownStep = () => {
    if (isLastStep) {
      return
    }

    const destination = index + 1

    onStepMove(step.id, index, destination)
  }

  const onMoveUpStep = index > 1 ? handleMoveUpStep : undefined
  const onMoveDownStep = !isLastStep ? handleMoveDownStep : undefined

  const renderForm = () => {
    if (!step) {
      return null
    }

    if (step.event) {
      return (
        <EventForm
          index={index}
          step={step}
          disableEdit={disableEdit}
          prevStepOrder={prevStepOrder}
          onSubmit={onUpdate}
          onDelete={() => onDelete(step)}
          onMoveUpStep={onMoveUpStep}
          onMoveDownStep={onMoveDownStep}
        />
      )
    }

    if (step.email) {
      return (
        <BasicEmailForm
          index={index}
          step={step}
          disableEdit={disableEdit}
          prevStepOrder={prevStepOrder}
          templates={emailTemplates}
          onSubmit={onUpdate}
          onDelete={() => onDelete(step)}
          onMoveUpStep={onMoveUpStep}
          onMoveDownStep={onMoveDownStep}
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
          prevStepOrder={prevStepOrder}
          onSubmit={onUpdate}
          onDelete={() => onDelete(step)}
          onMoveUpStep={onMoveUpStep}
          onMoveDownStep={onMoveDownStep}
        />
      )
    }
  }

  return <>{renderForm()}</>
}
