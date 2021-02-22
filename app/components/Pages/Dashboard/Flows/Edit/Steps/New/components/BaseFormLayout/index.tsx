import React, { ReactNode } from 'react'
import { Box, Typography, Button, IconButton } from '@material-ui/core'

import { mdiTrashCanOutline } from '@mdi/js'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'

import { useStyles } from './styles'

interface Props {
  index: number
  title?: string
  step?: IBrandFlowStep
  submitting: boolean
  children: ReactNode
  handleSubmit: () => void
}

export const BaseFormLayout = ({
  index,
  title = 'Step',
  children,
  submitting,
  handleSubmit
}: Props) => {
  const classes = useStyles()

  return (
    <form onSubmit={handleSubmit} noValidate>
      <Box className={classes.container}>
        <Box className={classes.header}>
          <Typography variant="body1" className={classes.title}>
            {index}. {title}
          </Typography>
        </Box>
        <Box className={classes.content} />
        {children}
      </Box>
    </form>
  )
}
