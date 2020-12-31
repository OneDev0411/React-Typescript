import React from 'react'

import { makeStyles, Theme } from '@material-ui/core'

import { useWizardForm } from '../use-context'

interface StyleProps {
  step: number
  currentStep: number
  lastVisitedStep: number
}

interface Props {
  step?: number
  children: React.ReactNode
}

const useStyles = makeStyles((theme: Theme) => ({
  root: ({ step, currentStep, lastVisitedStep }: StyleProps) => ({
    display: step > lastVisitedStep ? 'none' : 'block',
    marginBottom: theme.spacing(4),
    opacity: step !== currentStep ? 0.3 : 1,
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
