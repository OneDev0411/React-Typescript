import React, { useState } from 'react'
import { Box } from '@material-ui/core'

import EventForm from '../New/EventForm'

import { useCommonStyles } from './styles'
import { View } from './Components/View'
import ScheduledEmailForm from '../New/ScheduledEmailForm'

interface Props {
  disableEdit: boolean
  index: number
  step: IBrandFlowStep
  prevStep?: IBrandFlowStep
  emailTemplates: IBrandEmailTemplate[]
  defaultSelectedEmailTemplate?: UUID
  onDelete: (step: IBrandFlowStep) => Promise<any>
  onUpdate: (step: IBrandFlowStepInput, stepId: UUID) => Promise<any>
  onNewEmailTemplateClick: () => void
  onReviewEmailTemplateClick: (template: IBrandEmailTemplate) => void
}

export default function Item({
  disableEdit,
  index,
  step,
  // prevStep,
  emailTemplates,
  defaultSelectedEmailTemplate,
  onDelete,
  onUpdate,
  onNewEmailTemplateClick,
  onReviewEmailTemplateClick
}: Props) {
  const commonClasses = useCommonStyles()
  const [isEditing, setIsEditing] = useState<boolean>(false)

  if (isEditing) {
    return (
      <Box className={commonClasses.stepContainer} position="relative">
        <Box className={commonClasses.stepIndex}>{index + 1}</Box>
        <Box className={commonClasses.itemContent}>
          {step.event && (
            <EventForm
              onCancel={() => setIsEditing(false)}
              onSubmit={onUpdate}
              onDelete={() => onDelete(step)}
              step={step}
              index={index}
            />
          )}
          {step.email && (
            <ScheduledEmailForm
              onCancel={() => setIsEditing(false)}
              onSubmit={onUpdate}
              onDelete={() => onDelete(step)}
              step={step}
              templates={emailTemplates}
              defaultSelectedTemplate={defaultSelectedEmailTemplate}
              index={index}
              onNewTemplateClick={onNewEmailTemplateClick}
              onReviewTemplateClick={onReviewEmailTemplateClick}
            />
          )}
        </Box>
      </Box>
    )
  }

  return (
    <View
      step={step}
      disableEdit={disableEdit}
      isEditing={isEditing}
      setIsEditing={setIsEditing}
      index={index}
    />
  )
}
