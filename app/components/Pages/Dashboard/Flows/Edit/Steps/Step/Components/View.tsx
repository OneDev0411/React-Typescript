import React from 'react'

import {
  Box,
  Grid,
  Tooltip,
  Typography,
  makeStyles,
  Theme
} from '@material-ui/core'
import { mdiDrag } from '@mdi/js'
import cn from 'classnames'
import { Draggable } from 'react-beautiful-dnd'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'
import useRaisedMuiCard from 'hooks/use-raised-mui-card'

import { StepTypeIcon } from './StepTypeIcon'

export const useStyles = makeStyles(
  (theme: Theme) => ({
    viewStepContainer: {
      display: 'flex',
      alignItems: 'center',
      padding: theme.spacing(1),
      background: theme.palette.background.paper,
      border: `1px solid ${theme.palette.divider}`,
      borderRadius: theme.shape.borderRadius,
      cursor: 'pointer',
      '&:hover': {
        background: theme.palette.grey[100]
      }
    },
    raised: {
      background: theme.palette.grey[100],
      boxShadow: theme.shadows[3]
    },
    dragBtn: {
      display: 'flex',
      margin: theme.spacing(0, 2)
    },
    stepTypeContainer: {
      marginRight: theme.spacing(2)
    },
    descriptionContainer: {}
  }),
  { name: 'StepItemView' }
)

interface Props {
  step: IBrandFlowStep
  disableEdit: boolean
  isEditing: boolean
  setIsEditing: (state: boolean) => void
  index: number
}

export function View({ disableEdit, index, step, setIsEditing }: Props) {
  const classes = useStyles()
  const { raise, stopRaise } = useRaisedMuiCard()

  const getTitle = () => {
    if (step.event) {
      return step.event.task_type
    }

    if (step.email) {
      return 'Basic Email'
    }

    return 'Marketing Email'
  }

  return (
    <Box position="relative">
      <Draggable
        isDragDisabled={disableEdit}
        key={step.id}
        draggableId={step.id}
        index={index}
      >
        {(draggableProvided, draggableSnapshot) => (
          <div
            ref={draggableProvided.innerRef}
            {...draggableProvided.draggableProps}
          >
            <Box>{index + 1}</Box>
            <Box
              onMouseOver={raise}
              onFocus={raise}
              onMouseOut={stopRaise}
              onBlur={stopRaise}
              onClick={() => {
                if (disableEdit) {
                  return
                }

                return setIsEditing(true)
              }}
              className={cn(classes.viewStepContainer, {
                [classes.raised]: draggableSnapshot.isDragging
              })}
            >
              <Box
                className={classes.dragBtn}
                {...draggableProvided.dragHandleProps}
              >
                <Tooltip
                  title="Drag step to reorder"
                  aria-label="drag to reorder step"
                  hidden={disableEdit}
                >
                  <SvgIcon path={mdiDrag} />
                </Tooltip>
              </Box>
              <Grid
                container
                item
                xs={12}
                alignItems="center"
                justifyContent="flex-start"
              >
                <Grid
                  container
                  item
                  xs={4}
                  wrap="nowrap"
                  alignItems="center"
                  justifyContent="flex-start"
                >
                  <Grid item className={classes.stepTypeContainer}>
                    <StepTypeIcon
                      type={step.event ? step.event.task_type : 'Email'}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Box className={classes.descriptionContainer}>
                      <Typography variant="body2">{getTitle()}</Typography>
                      <Typography variant="body2" color="textSecondary" noWrap>
                        {step.title}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Grid>
            </Box>
          </div>
        )}
      </Draggable>
    </Box>
  )
}
