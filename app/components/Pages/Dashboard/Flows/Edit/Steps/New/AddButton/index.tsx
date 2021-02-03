import React from 'react'
import { Button, Box, makeStyles, Theme } from '@material-ui/core'
import cn from 'classnames'

import { useCommonStyles } from '../../Item/styles'

export const useStyles = makeStyles(
  (theme: Theme) => ({
    buttonContainer: {
      display: 'flex',
      padding: theme.spacing(2, 3),
      background: theme.palette.grey[100],
      border: `1px dashed ${theme.palette.divider}`,
      borderRadius: theme.shape.borderRadius,
      cursor: 'pointer',
      '&:hover': {
        background: theme.palette.grey[100]
      }
    },
    plusBadge: {
      background: theme.palette.grey[100],
      color: theme.palette.text.primary,
      borderStyle: 'dashed'
    },
    btn: {
      '&:not(:last-child)': {
        marginRight: theme.spacing(1)
      }
    }
  }),
  { name: 'AddStepButtons' }
)

interface Props {
  onNewEventClick: () => any
  onNewScheduledEmailClick: () => any
}

export const AddButton = ({
  onNewEventClick,
  onNewScheduledEmailClick
}: Props) => {
  const commonClasses = useCommonStyles()
  const classes = useStyles()

  return (
    <Box className={commonClasses.stepContainer} position="relative">
      <Box className={cn(commonClasses.stepIndex, classes.plusBadge)}>+</Box>
      <Box className={cn(commonClasses.itemContent, classes.buttonContainer)}>
        <Button
          variant="outlined"
          color="secondary"
          size="small"
          className={classes.btn}
          onClick={onNewEventClick}
        >
          Add Reminder
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          size="small"
          className={classes.btn}
          onClick={onNewScheduledEmailClick}
        >
          Add Basic Email
        </Button>
      </Box>
    </Box>
  )
}
