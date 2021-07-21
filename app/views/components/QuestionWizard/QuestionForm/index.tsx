import React from 'react'

import { Box, BoxProps } from '@material-ui/core'

import { IWizardState } from '../context'
import { useWizardContext } from '../hooks/use-wizard-context'

export interface QuestionFormProps {
  children:
    | React.ReactNode
    | ((data: { wizard: IWizardState }) => React.ReactNode)
  width?: string
  containerProps?: BoxProps
}

export function QuestionForm({
  children,
  width = '50%',
  containerProps = {}
}: QuestionFormProps) {
  const wizard = useWizardContext()

  return (
    <Box
      mt={8}
      display="flex"
      flexDirection="column"
      alignItems="flex-end"
      {...containerProps}
    >
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
