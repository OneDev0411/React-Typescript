import React from 'react'

import { makeStyles, Theme } from '@material-ui/core'

import { useWizardContext } from '../hooks/use-wizard-context'
import { useSectionContext } from '../hooks/use-section-context'

interface StyleProps {
  step: number
  currentStep: number
  lastVisitedStep: number
}

interface Props {
  children: React.ReactNode
  disabled?: boolean
  hidden?: boolean
}

const useStyles = makeStyles((theme: Theme) => ({
  root: ({ step, currentStep, lastVisitedStep }: StyleProps) => ({
    position: 'relative',
    display: step > lastVisitedStep ? 'none' : 'block',
    marginBottom: theme.spacing(4),
    opacity: step !== currentStep ? 0.3 : 1,
    '& .only-visible-in-step': {
      display: step === currentStep ? 'inherit' : 'none'
    },
    '&:hover': {
      opacity: 1
    }
  }),
  disabled: {
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: theme.shape.borderRadius,
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    zIndex: 2
  }
}))

export function QuestionSection({
  children,
  hidden = false,
  disabled = false
}: Props) {
  const { currentStep, lastVisitedStep } = useWizardContext()
  const { step } = useSectionContext()

  const classes = useStyles({
    step,
    currentStep,
    lastVisitedStep
  })

  if (hidden) {
    return null
  }

  return (
    <div className={classes.root}>
      {disabled && <div className={classes.disabled} />}
      {children}
    </div>
  )
}
