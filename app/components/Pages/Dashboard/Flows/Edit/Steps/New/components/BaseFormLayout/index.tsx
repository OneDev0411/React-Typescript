import React, { ReactNode, memo } from 'react'

import {
  Box,
  Chip,
  Typography,
  Grid,
  Button,
  Tooltip,
  IconButton,
  MenuItem
} from '@material-ui/core'
import { mdiDotsVertical, mdiDrag } from '@mdi/js'
import cn from 'classnames'
import { Draggable, DraggableProvided } from 'react-beautiful-dnd'

import { BaseDropdown } from 'components/BaseDropdown'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'
import useRaisedMuiCard from 'hooks/use-raised-mui-card'

import { BaseFormProps } from '../../types'
import { EventType } from '../BaseFields/EventType'
import { Time } from '../BaseFields/Time'
import { WaitFor } from '../BaseFields/WaitFor'

import { useStyles } from './styles'

interface Props extends Omit<BaseFormProps, 'onSubmit'> {
  index: number
  title: string
  stepIcon: string
  pristine: boolean
  submitting: boolean
  children: ReactNode
  onSubmit: () => void
}

const Layout = ({
  step,
  index,
  title,
  children,
  stepIcon,
  pristine,
  submitting,
  disableEdit = false,
  onSubmit,
  onDelete,
  onMoveUpStep,
  onMoveDownStep
}: Props) => {
  const classes = useStyles()
  const { raise, stopRaise } = useRaisedMuiCard()

  const renderForm = (props: { draggableProvided?: DraggableProvided }) => {
    const { draggableProvided } = props
    const dragHandleProps = draggableProvided
      ? draggableProvided.dragHandleProps
      : {}

    return (
      <form onSubmit={onSubmit} className={classes.form} noValidate>
        <header className={classes.header}>
          <Grid container alignItems="center" justifyContent="space-between">
            <Grid container alignItems="center" item xs={6}>
              {step && (
                <Box className={classes.dragBtn} {...dragHandleProps}>
                  <Tooltip
                    title="Drag step to reorder"
                    aria-label="drag to reorder step"
                    hidden={disableEdit}
                  >
                    <SvgIcon path={mdiDrag} />
                  </Tooltip>
                </Box>
              )}
              <SvgIcon path={stepIcon} className={classes.stepTypeIcon} />
              <Typography variant="body1" component="div">
                {index}. {title}{' '}
                {!step && (
                  <Chip
                    label="Draft"
                    variant="outlined"
                    color="secondary"
                    size="small"
                  />
                )}
              </Typography>
            </Grid>
            <Grid container item xs={6} justifyContent="flex-end">
              {!disableEdit && (
                <Button
                  variant="contained"
                  color="secondary"
                  disabled={submitting || pristine}
                  type="submit"
                  size="small"
                >
                  {submitting ? 'Saving' : 'Save'}
                </Button>
              )}

              {step && !disableEdit && (
                <Box ml={1}>
                  <BaseDropdown
                    PopperProps={{
                      placement: 'bottom-end'
                    }}
                    renderDropdownButton={({ isActive, ...buttonProps }) => (
                      <IconButton {...buttonProps} size="small">
                        <SvgIcon
                          path={mdiDotsVertical}
                          className={classes.moreBtn}
                        />
                      </IconButton>
                    )}
                    renderMenu={({ close }) => (
                      <div>
                        <MenuItem
                          disabled={!onMoveUpStep}
                          onClick={e => {
                            close()
                            onMoveUpStep && onMoveUpStep()
                          }}
                        >
                          <Typography>Move Up</Typography>
                        </MenuItem>
                        <MenuItem
                          disabled={!onMoveDownStep}
                          onClick={e => {
                            close()
                            onMoveDownStep && onMoveDownStep()
                          }}
                        >
                          <Typography>Move Down</Typography>
                        </MenuItem>
                        <MenuItem
                          disabled={!onDelete}
                          onClick={e => {
                            close()
                            onDelete && onDelete(step)
                          }}
                        >
                          <Typography color="error">Delete</Typography>
                        </MenuItem>
                      </div>
                    )}
                  />
                </Box>
              )}
            </Grid>
          </Grid>
        </header>
        <div className={classes.commonFieldsContainer}>
          <Typography variant="subtitle2" className={classes.commonFieldsTitle}>
            When is this reminder for?
          </Typography>
          <div className={classes.waitForContainer}>
            <WaitFor disabled={disableEdit} />
          </div>
          <div className={classes.commonFields}>
            <div className={cn(classes.commonField, classes.eventType)}>
              <EventType index={index} disabled={disableEdit} />
            </div>
            <div className={cn(classes.commonField, classes.time)}>
              <Time
                textFieldProps={{
                  disabled: disableEdit
                }}
              />
            </div>
          </div>
        </div>
        <div className={classes.otherFieldsContainer}>{children}</div>
      </form>
    )
  }

  if (step) {
    return (
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
            <div
              onMouseOver={raise}
              onFocus={raise}
              onMouseOut={stopRaise}
              onBlur={stopRaise}
              className={cn(classes.container, {
                [classes.raised]: draggableSnapshot.isDragging
              })}
            >
              {renderForm({ draggableProvided })}
            </div>
          </div>
        )}
      </Draggable>
    )
  }

  return <div className={classes.container}>{renderForm({})}</div>
}

export const BaseFormLayout = memo(Layout)
