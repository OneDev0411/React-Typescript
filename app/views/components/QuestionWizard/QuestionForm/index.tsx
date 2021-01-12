import React from 'react'

import { useWizardForm } from '../use-context'
import { IContextState } from '../context'

interface Props {
  children:
    | React.ReactNode
    | ((data: { wizard: IContextState }) => React.ReactNode)
}

export function QuestionForm({ children }: Props) {
  const context = useWizardForm()

  return (
    <div
      style={{
        margin: '5% 10%'
      }}
    >
      {typeof children === 'function'
        ? children({
            wizard: context
          })
        : children}
    </div>
  )
}
