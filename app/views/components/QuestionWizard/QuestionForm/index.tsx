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
        marginLeft: '20%'
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
