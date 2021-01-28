import React, { useState } from 'react'
import { Draggable } from 'react-beautiful-dnd'
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

import { SvgIcon } from 'components/SvgIcons/SvgIcon'
import useRaisedMuiCard from 'hooks/use-raised-mui-card'

import {
  humanizeSeconds,
  formatTimeDigits,
  getNextStepStartFrom
} from '../../helpers'
import EventForm from '../New/EventForm'

import Icon from './Icon'
import { DescriptionRow, DescriptionColumn } from './styled'
import ScheduledEmailForm from '../New/ScheduledEmailForm'

const useStyles = makeStyles(
  (theme: Theme) => ({
    stepContainer: {
      display: 'flex',
      width: '100%',
      marginBottom: theme.spacing(2)
    },
    stepIndex: {
      width: theme.spacing(5),
      height: theme.spacing(5),
      marginRight: theme.spacing(1),
      borderRadius: '50%',
      color: theme.palette.text.secondary,
      border: `1px solid ${theme.palette.divider}`,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    },
    itemContent: {
      flexGrow: 1
    },
    viewStepContainer: {
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
    }
  }),
  { name: 'StepItem' }
)

interface Props {
  disableEdit: boolean
  index: number
  step: IBrandFlowStep
  prevStep?: IBrandFlowStep
  emailTemplates: IBrandEmailTemplate[]
  defaultSelectedEmailTemplate?: UUID
  onDelete: (step: IBrandFlowStep) => Promise<any>
  onUpdate: (step: IBrandFlowStepInput, stepId: UUID) => Promise<any>
  onNewEmailTemplateClick: () => void
  onReviewEmailTemplateClick: (template: IBrandEmailTemplate) => void
}

export default function Item({
  disableEdit,
  index,
  step,
  prevStep,
  emailTemplates,
  defaultSelectedEmailTemplate,
  onDelete,
  onUpdate,
  onNewEmailTemplateClick,
  onReviewEmailTemplateClick
}: Props) {
  const classes = useStyles()
  const { raise, stopRaise } = useRaisedMuiCard()
  const [isEditing, setIsEditing] = useState(false)

  const humanizedDiff = humanizeSeconds(step.due_in)

  const hours =
    humanizedDiff.hours >= 12
      ? formatTimeDigits(humanizedDiff.hours - 12)
      : formatTimeDigits(humanizedDiff.hours)
  const minutes = formatTimeDigits(humanizedDiff.minutes)
  const amPm = humanizedDiff.hours >= 12 ? 'PM' : 'AM'

  if (isEditing) {
    return (
      <Box className={classes.stepContainer} position="relative">
        <Box className={classes.stepIndex}>{index + 1}</Box>
        <Box className={classes.itemContent}>
          {step.event && (
            <EventForm
              onCancel={() => setIsEditing(false)}
              onSubmit={onUpdate}
              onDelete={() => onDelete(step)}
              step={step}
              startFrom={getNextStepStartFrom(prevStep)}
            />
          )}
          {step.email && (
            <ScheduledEmailForm
              onCancel={() => setIsEditing(false)}
              onSubmit={onUpdate}
              onDelete={() => onDelete(step)}
              step={step}
              templates={emailTemplates}
              defaultSelectedTemplate={defaultSelectedEmailTemplate}
              startFrom={getNextStepStartFrom(prevStep)}
              onNewTemplateClick={onNewEmailTemplateClick}
              onReviewTemplateClick={onReviewEmailTemplateClick}
            />
          )}
        </Box>
      </Box>
    )
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
            className={classes.stepContainer}
          >
            <Box className={classes.stepIndex}>{index + 1}</Box>
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
              className={cn(classes.itemContent, classes.viewStepContainer, {
                [classes.raised]: draggableSnapshot.isDragging
              })}
            >
              <Grid container item xs={12}>
                <Grid
                  container
                  item
                  alignItems="center"
                  justify="center"
                  xs={1}
                  {...draggableProvided.dragHandleProps}
                >
                  <Tooltip
                    title="Drag step to reorder"
                    aria-label="drag to reorder step"
                    hidden={disableEdit}
                  >
                    <SvgIcon path={mdiDrag} />
                  </Tooltip>
                </Grid>

                <Grid container justify="space-between" item xs={11}>
                  <Grid
                    container
                    item
                    alignItems="flex-end"
                    direction="column"
                    xs={4}
                  >
                    <Typography variant="subtitle1" color="textSecondary">
                      {step.wait_days === 0 && 'The same day'}
                      {step.wait_days > 0 && `Wait for ${step.wait_days} `}
                      {step.wait_days === 1 && 'day'}
                      {step.wait_days > 1 && 'days'}
                    </Typography>
                    <Typography variant="subtitle1" color="textSecondary">
                      {`${hours}:${minutes} ${amPm}`}
                    </Typography>
                  </Grid>
                  <Grid
                    container
                    item
                    alignItems="flex-start"
                    direction="column"
                    xs={6}
                  >
                    <DescriptionRow>
                      <DescriptionColumn>
                        <Icon
                          type={step.event ? step.event.task_type : 'Email'}
                        />
                      </DescriptionColumn>
                      <DescriptionColumn>
                        <DescriptionColumn>
                          <Typography variant="subtitle1">
                            {step.event && step.event.task_type}
                            {step.email && 'Scheduled Email'}
                          </Typography>
                        </DescriptionColumn>
                        <DescriptionColumn>
                          <Typography
                            variant="subtitle1"
                            color="textSecondary"
                            noWrap
                          >
                            {step.title}
                          </Typography>
                        </DescriptionColumn>
                      </DescriptionColumn>
                    </DescriptionRow>
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
