import React, { useEffect, useRef, useState } from 'react'

import { Box, Theme, useTheme } from '@material-ui/core'

import { useAsync } from 'react-use'

import { WizardContext, SectionContext } from './context'

import Loading from './Loading'

interface Props {
  children: boolean | React.ReactNode | React.ReactNode
  defaultStep?: number
  questionPosition?: 'Top' | 'Auto'
  questionPositionOffset?: number
  styles?: React.CSSProperties
  onStepChange?: (step: number) => void
  onFinish?: () => void | Promise<void>
}

export function QuestionWizard({
  children,
  defaultStep = 1,
  questionPosition = 'Auto',
  questionPositionOffset = 80,
  styles = {},
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
  const sectionsCount = sections.filter(section => !!section).length

  const gotoStep = (step: number) => {
    if (step === currentStep) {
      return
    }

    setCurrentStep(step)
  }

  const gotoNext = async () => {
    if (currentStep + 1 > sectionsCount) {
      onFinish()

      return
    }

    const nextStep = Math.min(currentStep + 1, sectionsCount)

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

  useAsync(async () => {
    if (currentStep === 1) {
      refs.current[currentStep]?.scrollIntoView({
        block: 'nearest',
        behavior: 'smooth'
      })

      return
    }

    if (questionPosition === 'Top') {
      await delay(50)

      window.scrollTo({
        top:
          refs.current[currentStep]?.getBoundingClientRect().top +
          window.pageYOffset -
          questionPositionOffset,
        behavior: 'smooth'
      })
    } else {
      refs.current[currentStep]?.scrollIntoView({
        block: 'nearest',
        behavior: 'smooth'
      })
    }
  }, [currentStep, lastVisitedStep])

  useEffect(() => {
    showLoading &&
      loadingRef.current?.scrollIntoView({
        block: 'nearest',
        behavior: 'smooth'
      })
  }, [showLoading])

  return (
    <WizardContext.Provider
      value={{
        currentStep,
        lastVisitedStep,
        setStep,
        totalSteps: sectionsCount,
        goto: gotoStep,
        next: gotoNext,
        previous: gotoPrevious,
        isLoading: showLoading,
        setLoading: setShowLoading,
        first: () => gotoStep(1),
        last: () => gotoStep(sectionsCount)
      }}
    >
      <div style={styles}>
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

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export * from './QuestionSection'
export * from './QuestionForm'
export * from './QuestionTitle'
