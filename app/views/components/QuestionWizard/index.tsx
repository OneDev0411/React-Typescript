import React, { useEffect, useRef, useState } from 'react'

import { Box, Theme, useTheme } from '@material-ui/core'

import { Context } from './context'

import Loading from './Loading'

interface Props {
  children: boolean | React.ReactNode | React.ReactNode
  defaultStep?: number
}

export function QuestionWizard({ children, defaultStep = 0 }: Props) {
  const refs = useRef<HTMLDivElement[]>([])
  const loadingRef = useRef<SVGSVGElement>(null)

  const theme = useTheme<Theme>()

  const [currentStep, setCurrentStep] = useState(defaultStep)
  const [lastVisitedStep, setLastVisitedStep] = useState(defaultStep)

  const [showLoading, setShowLoading] = useState(false)

  const sections = Array.isArray(children) ? children : [children]

  const gotoStep = (step: number) => {
    if (step === currentStep) {
      return
    }

    setCurrentStep(step)
  }

  const gotoNext = async (delay: number = 700) => {
    const nextStep = Math.min(currentStep + 1, sections.length)

    if (nextStep > lastVisitedStep) {
      setShowLoading(true)
      await wait(delay)
    }

    setShowLoading(false)
    setCurrentStep(nextStep)
  }

  const gotoPrevious = () => {
    setCurrentStep(Math.max(currentStep - 1, 0))
  }

  useEffect(() => {
    setLastVisitedStep(Math.max(currentStep, lastVisitedStep))
  }, [currentStep, lastVisitedStep])

  useEffect(() => {
    refs.current[currentStep]?.scrollIntoView({
      block: 'center',
      inline: 'center',
      behavior: 'smooth'
    })
  }, [currentStep, lastVisitedStep])

  useEffect(() => {
    showLoading &&
      loadingRef.current?.scrollIntoView({
        block: 'center',
        inline: 'center',
        behavior: 'smooth'
      })
  }, [showLoading])

  return (
    <Context.Provider
      value={{
        currentStep,
        lastVisitedStep,
        totalSteps: sections.length,
        goto: gotoStep,
        next: gotoNext,
        previous: gotoPrevious,
        first: () => gotoStep(0),
        last: () => gotoStep(sections.length - 1)
      }}
    >
      <div>
        {sections
          .filter(section => {
            return !!section
          })
          .map((section, step) => (
            <div
              key={step}
              ref={el => (refs.current[step] = el as HTMLDivElement)}
              onClick={() => gotoStep(step)}
            >
              {React.cloneElement(section as React.ReactElement<any>, { step })}
            </div>
          ))}
      </div>

      {showLoading && (
        <Box
          style={{
            marginBottom: theme.spacing(4)
          }}
        >
          <Loading
            ref={loadingRef}
            width={60}
            fill={theme.palette.secondary.main}
          />
        </Box>
      )}
    </Context.Provider>
  )
}

const wait = (delay: number) =>
  new Promise(resolve => setTimeout(resolve, delay))

export * from './QuestionSection'
export * from './QuestionForm'
export * from './QuestionTitle'
