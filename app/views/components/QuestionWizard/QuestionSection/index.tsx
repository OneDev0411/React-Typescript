import React from 'react'

import { makeStyles, Theme } from '@material-ui/core'

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
}

const useStyles = makeStyles((theme: Theme) => ({
  root: ({ step, disabled, currentStep, lastVisitedStep }: StyleProps) => ({
    position: 'relative',
    display: step > lastVisitedStep ? 'none' : 'block',
    marginBottom: theme.spacing(4),
    opacity: step !== currentStep ? 0.3 : 1,
    filter: disabled ? 'none' : 'none', // TODO: BLOCKED BY PRODUCT
    '& .only-visible-in-step': {
      display: step === currentStep ? 'inherit' : 'none'
    },
    '&:hover': {
      opacity: 1
    }
  }),
  disabled: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    zIndex: 2
  }
}))

export function QuestionSection({ children, disabled = false }: Props) {
  const { currentStep, lastVisitedStep } = useWizardContext()
  const { step } = useSectionContext()

  const classes = useStyles({
    step,
    disabled,
    currentStep,
    lastVisitedStep
  })

  return (
    <div className={classes.root}>
      {disabled && <div className={classes.disabled} />}
      {children}
    </div>
  )
}
