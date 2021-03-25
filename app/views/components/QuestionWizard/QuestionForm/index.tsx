import React from 'react'
import { Box } from '@material-ui/core'

import { useWizardContext } from '../hooks/use-wizard-context'
import { IWizardState } from '../context'

interface Props {
  width?: string
  children:
    | React.ReactNode
    | ((data: { wizard: IWizardState }) => React.ReactNode)
}

export function QuestionForm({ children, width = '50%' }: Props) {
  const wizard = useWizardContext()

  return (
    <Box mt={8} display="flex" flexDirection="column" alignItems="flex-end">
      <Box width={width}>
        {typeof children === 'function'
          ? children({
              wizard
            })
          : children}
      </Box>
    </Box>
  )
}
