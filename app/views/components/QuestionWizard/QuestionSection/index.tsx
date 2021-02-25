import React from 'react'

import { makeStyles, Theme, Typography } from '@material-ui/core'

import { useWizardContext } from '../hooks/use-wizard-context'
import { useSectionContext } from '../hooks/use-section-context'

interface StyleProps {
  step: number
  disabled: boolean
  currentStep: number
  lastVisitedStep: number
}

interface Props {
  children: React.ReactNode
  disabled?: boolean
  hidden?: boolean
  disableMessage?: string
}

const useStyles = makeStyles((theme: Theme) => ({
  root: ({ step, disabled, currentStep, lastVisitedStep }: StyleProps) => ({
    position: 'relative',
    padding: disabled ? theme.spacing(0.5) : 0,
    display: step > lastVisitedStep ? 'none' : 'block',
    marginBottom: theme.spacing(4),
    opacity: step !== currentStep ? 0.9 : 1,
    '& .only-visible-in-step': {
      display: step === currentStep ? 'inherit' : 'none'
    },
    '&:hover': {
      opacity: 1
    }
  }),
  disabled: {
    position: 'absolute',
    backgroundColor: 'rgba(220, 220, 220, 0.6)',
    borderRadius: theme.shape.borderRadius,
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    zIndex: 2,
    display: 'flex',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    textShadow: '1px 0 1px #fff',
    '& > .message': {
      opacity: 0
    },
    '&:hover > .message': {
      opacity: 1
    }
  }
}))

export function QuestionSection({
  children,
  hidden = false,
  disabled = false,
  disableMessage = 'You are not allowed to edit this section'
}: Props) {
  const { currentStep, lastVisitedStep } = useWizardContext()
  const { step } = useSectionContext()

  const classes = useStyles({
    step,
    disabled,
    currentStep,
    lastVisitedStep
  })

  if (hidden) {
    return null
  }

  return (
    <div className={classes.root}>
      {disabled && (
        <div className={classes.disabled}>
          <Typography variant="h6" className="message">
            {disableMessage}
          </Typography>
        </div>
      )}
      {children}
    </div>
  )
}
