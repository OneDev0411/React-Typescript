import React, { useState } from 'react'
import { Box } from '@material-ui/core'

import EventForm from './EventForm'
import ScheduledEmailForm from './ScheduledEmailForm'
import { AddButton } from './AddButton'
import { useCommonStyles } from '../Item/styles'

interface Props {
  index: number
  emailTemplates: IBrandEmailTemplate[]
  defaultSelectedEmailTemplate?: UUID
  isNewEventFormOpen?: boolean
  onSubmit: (data: IBrandFlowStepInput) => Promise<any>
  onNewEmailTemplateClick: () => void
  onReviewEmailTemplateClick: (template: IBrandEmailTemplate) => void
}

export const NewStep = ({
  isNewEventFormOpen: passedIsNewEventFormOpen,
  index,
  emailTemplates,
  defaultSelectedEmailTemplate,
  onSubmit,
  onNewEmailTemplateClick,
  onReviewEmailTemplateClick
}: Props) => {
  const commonClasses = useCommonStyles()
  const [isNewEventFormOpen, setIsNewEventFormOpen] = useState(
    passedIsNewEventFormOpen || false
  )
  const [
    isNewScheduledEmailFormOpen,
    setIsNewScheduledEmailFormOpen
  ] = useState(false)

  async function submitHandler(data: IBrandFlowStepInput) {
    const step: IBrandFlowStepInput = {
      ...data
    }

    await onSubmit(step)
    setIsNewEventFormOpen(false)
  }

  function cancelHandler() {
    setIsNewEventFormOpen(false)
    setIsNewScheduledEmailFormOpen(false)
  }

  const renderNewStep = () => {
    if (!isNewScheduledEmailFormOpen && !isNewEventFormOpen) {
      return null
    }

    return (
      <Box className={commonClasses.stepContainer} position="relative">
        <Box className={commonClasses.stepIndex}>{index}</Box>
        <Box className={commonClasses.itemContent}>
          {isNewEventFormOpen && (
            <EventForm
              index={index}
              onCancel={cancelHandler}
              onSubmit={submitHandler}
            />
          )}
          {isNewScheduledEmailFormOpen && (
            <ScheduledEmailForm
              index={index}
              templates={emailTemplates}
              defaultSelectedTemplate={defaultSelectedEmailTemplate}
              onCancel={cancelHandler}
              onSubmit={submitHandler}
              onNewTemplateClick={onNewEmailTemplateClick}
              onReviewTemplateClick={onReviewEmailTemplateClick}
            />
          )}
        </Box>
      </Box>
    )
  }

  function renderAddNewStep() {
    return (
      <Box mt={1}>
        <AddButton
          onNewEventClick={() => {
            setIsNewScheduledEmailFormOpen(false)
            setIsNewEventFormOpen(true)
          }}
          onNewScheduledEmailClick={() => {
            setIsNewEventFormOpen(false)
            setIsNewScheduledEmailFormOpen(true)
          }}
        />
      </Box>
    )
  }

  return (
    <>
      {renderNewStep()}
      {renderAddNewStep()}
    </>
  )
}
