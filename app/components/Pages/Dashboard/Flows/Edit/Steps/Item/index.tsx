import React, { useState } from 'react'
import { Draggable } from 'react-beautiful-dnd'
import {
  Box,
  Grid,
  Tooltip,
  Typography,
  Card,
  CardContent
} from '@material-ui/core'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import { mdiDrag } from '@mdi/js'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'
import useRaisedMuiCard from 'hooks/use-raised-mui-card'

import {
  humanizeSeconds,
  formatTimeDigits,
  getNextStepStartFrom
} from '../../helpers'
import EventForm from '../New/EventForm'

import { StepIndex } from '../styled'

import Icon from './Icon'
import { DescriptionRow, DescriptionColumn } from './styled'
import ScheduledEmailForm from '../New/ScheduledEmailForm'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    cardContent: {
      '&:last-child': {
        paddingBottom: `${theme.spacing(2)}px`
      }
    }
  })
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
  const { isRaised, raise, stopRaise } = useRaisedMuiCard()
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
      <Grid item xs={12} style={{ position: 'relative' }}>
        <StepIndex>{index + 1}</StepIndex>
        <Box m={2}>
          <Card>
            <CardContent className={classes.cardContent}>
              <Grid container item alignItems="center" xs={12}>
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
              </Grid>
            </CardContent>
          </Card>
        </Box>
      </Grid>
    )
  }

  return (
    <Grid item xs={12} style={{ position: 'relative' }}>
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
            <StepIndex>{index + 1}</StepIndex>
            <Box m={2} style={{ cursor: 'pointer' }}>
              <Card
                onMouseOver={raise}
                onFocus={raise}
                onMouseOut={stopRaise}
                onBlur={stopRaise}
                raised={isRaised || draggableSnapshot.isDragging}
                style={{ borderRadius: '8px' }}
                onClick={() => {
                  if (disableEdit) {
                    return
                  }

                  return setIsEditing(true)
                }}
              >
                <CardContent className={classes.cardContent}>
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
                </CardContent>
              </Card>
            </Box>
          </div>
        )}
      </Draggable>
    </Grid>
  )
}
