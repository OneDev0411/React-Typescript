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

export function QuestionSection({ children }: Props) {
  const { currentStep, lastVisitedStep } = useWizardContext()
  const { step } = useSectionContext()

  const classes = useStyles({
    step,
    currentStep,
    lastVisitedStep
  })

  return <div className={classes.root}>{children}</div>
}
