import React, { useEffect, useRef, useState } from 'react'

import { Box, Theme, useTheme } from '@material-ui/core'

import { WizardContext, SectionContext } from './context'

import Loading from './Loading'

interface Props {
  children: boolean | React.ReactNode | React.ReactNode
  defaultStep?: number
  onStepChange?: (step: number) => void
  onFinish?: () => void | Promise<void>
}

export function QuestionWizard({
  children,
  defaultStep = 1,
  onStepChange = () => {},
  onFinish = () => {}
}: Props) {
  const refs = useRef<HTMLDivElement[]>([])
  const loadingRef = useRef<SVGSVGElement>(null)
  const theme = useTheme<Theme>()

  const [currentStep, setCurrentStep] = useState(defaultStep)
  const [lastVisitedStep, setLastVisitedStep] = useState(defaultStep)

  const [showLoading, setShowLoading] = useState(false)

  const sections = Array.isArray(children) ? children.flat() : [children]

  const gotoStep = (step: number) => {
    if (step === currentStep) {
      return
    }

    setCurrentStep(step)
  }

  const gotoNext = async () => {
    if (currentStep + 1 > sections.length) {
      onFinish()

      return
    }

    const nextStep = Math.min(currentStep + 1, sections.length)

    setCurrentStep(nextStep)
  }

  const gotoPrevious = () => {
    setCurrentStep(Math.max(currentStep - 1, 1))
  }

  const setStep = (step: number) => {
    setCurrentStep(step)
    setLastVisitedStep(step)
  }

  useEffect(() => {
    setLastVisitedStep(Math.max(currentStep, lastVisitedStep))
  }, [currentStep, lastVisitedStep])

  useEffect(() => {
    onStepChange(currentStep)
  }, [currentStep, onStepChange])

  useEffect(() => {
    if (currentStep === 1) {
      refs.current[currentStep]?.scrollIntoView({
        block: 'nearest',
        behavior: 'smooth'
      })

      return
    }

    window.scrollTo({
      top:
        refs.current[currentStep].getBoundingClientRect().top +
        window.pageYOffset -
        50,
      behavior: 'smooth'
    })
  }, [currentStep, lastVisitedStep])

  useEffect(() => {
    showLoading &&
      loadingRef.current?.scrollIntoView({
        block: 'center',
        inline: 'center'
      })
  }, [showLoading])

  return (
    <WizardContext.Provider
      value={{
        currentStep,
        lastVisitedStep,
        setStep,
        totalSteps: sections.length,
        goto: gotoStep,
        next: gotoNext,
        previous: gotoPrevious,
        isLoading: showLoading,
        setLoading: setShowLoading,
        first: () => gotoStep(1),
        last: () => gotoStep(sections.length)
      }}
    >
      <div
        style={{
          paddingBottom: '50%'
        }}
      >
        {sections
          .filter(section => {
            return !!section
          })
          .map((section, index) => {
            const step = index + 1

            return (
              <div
                key={step}
                ref={el => (refs.current[step] = el as HTMLDivElement)}
              >
                <SectionContext.Provider
                  value={{
                    step
                  }}
                >
                  {section}
                </SectionContext.Provider>
              </div>
            )
          })}

        {showLoading && (
          <Box
            style={{
              margin: theme.spacing(2)
            }}
          >
            <Loading
              ref={loadingRef}
              width={60}
              fill={theme.palette.secondary.main}
            />
          </Box>
        )}
      </div>
    </WizardContext.Provider>
  )
}

export * from './QuestionSection'
export * from './QuestionForm'
export * from './QuestionTitle'
