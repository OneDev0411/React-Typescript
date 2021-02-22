import React, { useState } from 'react'
import { Box } from '@material-ui/core'

import EventForm from './EventForm'
import BasicEmailForm from './BasicEmailForm'
import MarketingEmailForm from './MarketingEmailForm'
import { AddButton } from './components/AddButtons'
import { useCommonStyles } from '../Item/styles'

interface Props {
  index: number
  emailTemplates: IBrandEmailTemplate[]
  defaultSelectedEmailTemplate?: UUID
  shouldShowDefaultForm?: boolean
  onSubmit: (data: IBrandFlowStepInput) => Promise<any>
  onNewEmailTemplateClick: () => void
  onReviewEmailTemplateClick: (template: IBrandEmailTemplate) => void
}

export const NewStep = ({
  shouldShowDefaultForm,
  index,
  emailTemplates,
  defaultSelectedEmailTemplate,
  onSubmit,
  onNewEmailTemplateClick,
  onReviewEmailTemplateClick
}: Props) => {
  const commonClasses = useCommonStyles()
  const [openForm, setOpenForm] = useState<
    Nullable<'event' | 'basic_email' | 'marketing_email'>
  >(shouldShowDefaultForm ? 'event' : null)

  async function submitHandler(data: IBrandFlowStepInput) {
    const step: IBrandFlowStepInput = {
      ...data
    }

    await onSubmit(step)
    setOpenForm(null)
  }

  function cancelHandler() {
    setOpenForm(null)
  }

  const renderEventForm = () => (
    <EventForm
      index={index}
      onCancel={cancelHandler}
      onSubmit={submitHandler}
    />
  )

  const rebderBasicEmailForm = () => (
    <BasicEmailForm
      index={index}
      templates={emailTemplates}
      defaultSelectedTemplate={defaultSelectedEmailTemplate}
      onCancel={cancelHandler}
      onSubmit={submitHandler}
      onNewTemplateClick={onNewEmailTemplateClick}
      onReviewTemplateClick={onReviewEmailTemplateClick}
    />
  )
  const rebderTemplateEmailForm = () => (
    <MarketingEmailForm
      index={index}
      onCancel={cancelHandler}
      onSubmit={submitHandler}
    />
  )

  const renderForm = () => {
    switch (openForm) {
      case 'event':
        return renderEventForm()
      case 'basic_email':
        return rebderBasicEmailForm()
      case 'marketing_email':
        return rebderTemplateEmailForm()
    }
  }

  const renderNewStep = () => {
    if (!openForm) {
      return null
    }

    return (
      <Box className={commonClasses.stepContainer} position="relative">
        <Box className={commonClasses.stepIndex}>{index}</Box>
        <Box className={commonClasses.itemContent}>{renderForm()}</Box>
      </Box>
    )
  }

  function renderAddNewStep() {
    return (
      <Box mt={1}>
        <AddButton
          onNewEventClick={() => setOpenForm('event')}
          onNewMarketingEmailClick={() => setOpenForm('marketing_email')}
          onNewBasicEmailClick={() => setOpenForm('basic_email')}
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
