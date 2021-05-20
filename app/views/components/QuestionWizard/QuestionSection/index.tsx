import React from 'react'

import { makeStyles, Theme } from '@material-ui/core'

import { useWizardContext } from '../hooks/use-wizard-context'
import { useSectionContext } from '../hooks/use-section-context'
import { SectionErrorContext } from '../context'

interface StyleProps {
  step: number
  currentStep: number
  lastVisitedStep: number
}

interface Props {
  children: React.ReactNode
  hidden?: boolean
  error?: string
}

const useStyles = makeStyles((theme: Theme) => ({
  root: ({ step, currentStep, lastVisitedStep }: StyleProps) => ({
    position: 'relative',
    padding: 0,
    display: step > lastVisitedStep ? 'none' : 'block',
    marginBottom: theme.spacing(4),
    opacity: step !== currentStep ? 0.9 : 1,
    '& .only-visible-in-step': {
      display: step === currentStep ? 'inherit' : 'none'
    },
    '&:hover': {
      opacity: 1
    }
  })
}))

export function QuestionSection({ children, hidden = false, error }: Props) {
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
      <SectionErrorContext.Provider
        value={!!error && currentStep > step ? error : undefined}
      >
        {children}
      </SectionErrorContext.Provider>
    </div>
  )
}
