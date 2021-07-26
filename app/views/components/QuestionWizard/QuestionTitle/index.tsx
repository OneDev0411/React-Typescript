import React, { CSSProperties } from 'react'

import { Typography, makeStyles, Theme, Box } from '@material-ui/core'
import classNames from 'classnames'

import { useSectionErrorContext } from '../hooks/use-section-error-context'

interface Props {
  children: React.ReactNode
  style?: CSSProperties
}

const useStyles = makeStyles(
  (theme: Theme) => ({
    root: {
      background: theme.palette.grey[100],
      borderRadius: theme.spacing(2, 2, 2, 0),
      display: 'inline-block',
      padding: theme.spacing(2, 4),
      maxWidth: '65%',
      border: `1px solid ${theme.palette.grey[100]}`,
      transition: theme.transitions.create('border-color')
    },
    rootError: { borderColor: theme.palette.error.main }
  }),
  {
    name: 'QuestionWizard-Title'
  }
)

export function QuestionTitle({ children, style = {} }: Props) {
  const classes = useStyles()
  const error = useSectionErrorContext()

  return (
    <>
      <Typography
        variant="h6"
        className={classNames(classes.root, !!error && classes.rootError)}
        style={style}
      >
        {children}
      </Typography>
      {error && (
        <Box p={1} color="error.main">
          {error}
        </Box>
      )}
    </>
  )
}
