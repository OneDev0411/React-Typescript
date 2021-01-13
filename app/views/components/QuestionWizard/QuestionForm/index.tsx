import React from 'react'
import { Box } from '@material-ui/core'

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
    <Box mt={8} display="flex" flexDirection="column" alignItems="flex-end">
      <Box width="60%">
        {typeof children === 'function'
          ? children({
              wizard: context
            })
          : children}
      </Box>
    </Box>
  )
}
