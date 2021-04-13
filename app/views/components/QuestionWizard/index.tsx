import React, { useEffect, useRef, useState } from 'react'

import { Box, Theme, useTheme } from '@material-ui/core'

import { useAsync } from 'react-use'

import { WizardContext, SectionContext } from './context'

import Loading from './Loading'

interface Props {
  children: boolean | React.ReactNode | React.ReactNode
  defaultStep?: number
  concurrent?: boolean
  useWindowScrollbar?: boolean
  questionPositionOffset?: number
  styles?: React.CSSProperties
  onStepChange?: (step: number) => void
  onFinish?: () => void | Promise<void>
}

export function QuestionWizard({
  children,
  concurrent = false,
  defaultStep = 1,
  useWindowScrollbar = false,
  questionPositionOffset = 80,
  styles = {},
  onStepChange = () => {},
  onFinish = () => {}
}: Props) {
  const refs = useRef<HTMLDivElement[]>([])
  const loadingRef = useRef<SVGSVGElement>(null)
  const theme = useTheme<Theme>()

  const sections = Array.isArray(children) ? children.flat() : [children]
  const sectionsCount = sections.filter(section => !!section).length

  const [currentStep, setCurrentStep] = useState(
    concurrent ? sections.length : defaultStep
  )
  const [lastVisitedStep, setLastVisitedStep] = useState(
    concurrent ? sections.length : defaultStep
  )

  const [showLoading, setShowLoading] = useState(false)

  const gotoStep = (step: number) => {
    if (concurrent) {
      return
    }

    if (step === currentStep) {
      return
    }

    setCurrentStep(step)
  }

  const gotoNext = async (delayNum?: number) => {
    if (concurrent) {
      return
    }

    if (delayNum) {
      await delay(delayNum)
    }

    if (currentStep + 1 > sectionsCount) {
      onFinish()

      return
    }

    const nextStep = Math.min(currentStep + 1, sectionsCount)

    setCurrentStep(nextStep)
  }

  const gotoPrevious = () => {
    if (concurrent) {
      return
    }

    setCurrentStep(Math.max(currentStep - 1, 1))
  }

  const setStep = (step: number) => {
    if (concurrent) {
      refs.current[step]?.scrollIntoView({
        block: 'center',
        behavior: 'smooth'
      })

      return
    }

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
    if (concurrent) {
      return
    }

    if (currentStep === 1) {
      refs.current[currentStep]?.scrollIntoView({
        block: 'nearest',
        behavior: 'smooth'
      })

      return
    }

    if (useWindowScrollbar) {
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
        goto: gotoStep,
        next: gotoNext,
        totalSteps: sectionsCount,
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
export * from './hooks/use-wizard-context'
export * from './hooks/use-section-context'
