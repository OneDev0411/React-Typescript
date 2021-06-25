import React, { useState } from 'react'
import { Box, Theme, makeStyles } from '@material-ui/core'

import EventForm from './EventForm'
import BasicEmailForm from './BasicEmailForm'
import MarketingEmailForm from './MarketingEmailForm'
import { AddButtons } from './components/AddButtons'

const useStyles = makeStyles(
  (theme: Theme) => ({
    container: {
      width: '100%'
    },
    plus: {
      width: '55px', // from figma
      height: '55px', // from figma
      margin: 'auto',
      background: theme.palette.background.paper,
      border: `1px solid ${theme.palette.divider}`,
      borderRadius: '50%',
      color: theme.palette.secondary.main,
      fontSize: '1.3rem',
      textAlign: 'center',
      lineHeight: '52px',
      cursor: 'pointer'
    }
  }),
  { name: 'NewStep' }
)

interface Props {
  index: number
  miniMode?: boolean
  emailTemplates: IBrandEmailTemplate[]
  defaultSelectedEmailTemplate?: UUID
  shouldShowDefaultForm?: boolean
  onSubmit: (data: IBrandFlowStepInput) => Promise<any>
  onNewEmailTemplateClick: () => void
}

export const NewStep = ({
  index,
  emailTemplates,
  miniMode = false,
  shouldShowDefaultForm,
  defaultSelectedEmailTemplate,
  onSubmit,
  onNewEmailTemplateClick
}: Props) => {
  const classes = useStyles()
  const [isMiniMode, setIsMiniMode] = useState(miniMode)
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

    return <Box className={classes.container}>{renderForm()}</Box>
  }

  function renderAddNewStep() {
    if (isMiniMode) {
      return (
        <Box className={classes.plus} onClick={() => setIsMiniMode(false)}>
          +
        </Box>
      )
    }

    return (
      <Box className={classes.container} mt={openForm ? 2 : 0}>
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
