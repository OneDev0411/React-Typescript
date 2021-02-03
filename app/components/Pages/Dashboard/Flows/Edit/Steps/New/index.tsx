import React, { useState } from 'react'
import { Grid, Box } from '@material-ui/core'

import EventForm from './EventForm'
import ScheduledEmailForm from './ScheduledEmailForm'
import AddButton from './AddButton'
import { useCommonStyles } from '../Item/styles'

interface Props {
  index: number
  startFrom: number
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
  startFrom,
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
      ...data,
      due_in: data.due_in
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
              startFrom={startFrom}
              onCancel={cancelHandler}
              onSubmit={submitHandler}
            />
          )}
          {isNewScheduledEmailFormOpen && (
            <ScheduledEmailForm
              startFrom={startFrom}
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
      <Grid item xs={12}>
        <Box m={2}>
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
      </Grid>
    )
  }

  return (
    <>
      {renderNewStep()}
      {renderAddNewStep()}
    </>
  )
}
