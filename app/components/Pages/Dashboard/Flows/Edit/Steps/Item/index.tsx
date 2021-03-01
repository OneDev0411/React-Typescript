import React from 'react'
import { Box } from '@material-ui/core'

import EventForm from '../New/EventForm'

// import { View } from './Components/View'
import BasicEmailForm from '../New/BasicEmailForm'
import MarketingEmailForm from '../New/MarketingEmailForm'

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

  return <Box mb={2}>{renderEditForm()}</Box>
  // if (isEditing) {
  //   return (
  //     <Box className={commonClasses.stepContainer} position="relative">
  //       <Box className={commonClasses.stepIndex}>{index + 1}</Box>
  //       <Box className={commonClasses.itemContent}>{renderEditForm()}</Box>
  //     </Box>
  //   )
  // }

  // return (
  //   <View
  //     step={step}
  //     disableEdit={disableEdit}
  //     isEditing={isEditing}
  //     setIsEditing={setIsEditing}
  //     index={index}
  //   />
  // )
}
