import React, { useState } from 'react'
import { Box } from '@material-ui/core'

import EventForm from './EventForm'
import BasicEmailForm from './BasicEmailForm'
import MarketingEmailForm from './MarketingEmailForm'
import { AddButtons } from './components/AddButtons'

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
  const [openForm, setOpenForm] = useState<
    Nullable<'event' | 'basic_email' | 'marketing_email'>
  >(shouldShowDefaultForm ? 'event' : null)

  async function submitHandler(data: IBrandFlowStepInput) {
    await onSubmit(data)
    setOpenForm(null)
  }

  const renderEventForm = () => (
    <EventForm index={index} onSubmit={submitHandler} />
  )

  const rebderBasicEmailForm = () => (
    <BasicEmailForm
      index={index}
      templates={emailTemplates}
      defaultSelectedTemplate={defaultSelectedEmailTemplate}
      onSubmit={submitHandler}
      onNewTemplateClick={onNewEmailTemplateClick}
      onReviewTemplateClick={onReviewEmailTemplateClick}
    />
  )
  const rebderTemplateEmailForm = () => (
    <MarketingEmailForm index={index} onSubmit={submitHandler} />
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
      <Box width="100%" mb={2}>
        {renderForm()}
      </Box>
    )
  }

  function renderAddNewStep() {
    return (
      <Box width="100%">
        <AddButtons
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
