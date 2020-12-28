import { makeStyles } from '@material-ui/core'
import React from 'react'

import { useWizardForm } from '../use-context'

interface Styles {
  step: number
  currentStep: number
  lastVisitedStep: number
}

interface Props {
  step?: number
  children: React.ReactNode
}

const useStyles = makeStyles(() => ({
  root: ({ step, currentStep, lastVisitedStep }: Styles) => ({
    marginBottom: '32px',
    opacity: step !== currentStep ? 0.3 : 1,
    display: step > lastVisitedStep ? 'none' : 'block',
    '& .only-visible-in-step': {
      display: step === currentStep ? 'inherit' : 'none'
    },
    '&:hover': {
      opacity: 1
    }
  })
}))

export function QuestionSection({ children, step }: Props) {
  const context = useWizardForm()
  const classes = useStyles({
    step: step!,
    currentStep: context.currentStep,
    lastVisitedStep: context.lastVisitedStep
  })

  return <div className={classes.root}>{children}</div>
}
