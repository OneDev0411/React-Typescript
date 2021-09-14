import { useState, useContext, useCallback } from 'react'

import { Box, Theme, makeStyles } from '@material-ui/core'

import ConfirmationModalContext from '@app/views/components/ConfirmationModal/context'

import BasicEmailForm from './BasicEmailForm'
import { AddButtons } from './components/AddButtons'
import EventForm from './EventForm'
import MarketingEmailForm from './MarketingEmailForm'

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
  shouldShowDefaultForm?: boolean
  onSubmit: (data: IBrandFlowStepInput) => Promise<any>
}

export type Forms = Nullable<'event' | 'basic_email' | 'marketing_email'>

export const NewStep = ({
  index,
  miniMode = false,
  shouldShowDefaultForm,
  onSubmit
}: Props) => {
  const classes = useStyles()
  const modal = useContext(ConfirmationModalContext)
  const [isMiniMode, setIsMiniMode] = useState(miniMode)
  const [hasDirtyStep, setHasDirtyStep] = useState(false)
  const [openForm, setOpenForm] = useState<Forms>(
    shouldShowDefaultForm ? 'event' : null
  )

  const submitHandler = async (data: IBrandFlowStepInput) => {
    await onSubmit(data)
    setOpenForm(null)
  }

  const creatNewStep = (type: Forms) => {
    if (type === openForm) {
      return
    }

    if (hasDirtyStep) {
      return modal.setConfirmationModal({
        message: 'Warning!',
        description:
          'You have not saved your work yet, are you sure you want to cancel it?',
        confirmLabel: 'Cancel',
        cancelLabel: "Don't Cancel",
        onConfirm: () => {
          setOpenForm(type)
        },
        onCancel: () => {
          return null
        }
      })
    }

    setOpenForm(type)
  }

  const makeDirtyStep = () => {
    if (hasDirtyStep) {
      return
    }

    setHasDirtyStep(true)
  }

  const renderEventForm = () => (
    <EventForm
      index={index}
      isDirty={openForm === 'event' && hasDirtyStep}
      makeDirtyStep={makeDirtyStep}
      onSubmit={submitHandler}
    />
  )

  const rebderBasicEmailForm = () => (
    <BasicEmailForm
      index={index}
      isDirty={openForm === 'basic_email' && hasDirtyStep}
      makeDirtyStep={makeDirtyStep}
      onSubmit={submitHandler}
    />
  )
  const rebderTemplateEmailForm = () => (
    <MarketingEmailForm
      index={index}
      isDirty={openForm === 'marketing_email' && hasDirtyStep}
      makeDirtyStep={makeDirtyStep}
      onSubmit={submitHandler}
    />
  )
  const renderForm = useCallback(() => {
    switch (openForm) {
      case 'event':
        return renderEventForm()
      case 'basic_email':
        return rebderBasicEmailForm()
      case 'marketing_email':
        return rebderTemplateEmailForm()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openForm])

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
          activeForm={openForm}
          onNewEventClick={() => creatNewStep('event')}
          onNewMarketingEmailClick={() => creatNewStep('marketing_email')}
          onNewBasicEmailClick={() => creatNewStep('basic_email')}
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
