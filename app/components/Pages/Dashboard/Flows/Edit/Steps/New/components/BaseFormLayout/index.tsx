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
import { Draggable, DraggableProvided } from 'react-beautiful-dnd'
import cn from 'classnames'
import { mdiDotsVertical, mdiDrag } from '@mdi/js'

import useRaisedMuiCard from 'hooks/use-raised-mui-card'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'
import { BaseDropdown } from 'components/BaseDropdown'

import { WaitFor } from '../BaseFields/WaitFor'
import { EventType } from '../BaseFields/EventType'
import { Time } from '../BaseFields/Time'
import { useStyles } from './styles'

interface Props {
  index: number
  title: string
  stepIcon: string
  step?: Nullable<IBrandFlowStep>
  disableEdit: boolean
  pristine: boolean
  submitting: boolean
  children: ReactNode
  onSubmit: () => void
  onDelete?: (data: IBrandFlowStep) => Promise<any>
}

const Layout = ({
  index,
  step,
  title,
  children,
  stepIcon,
  pristine,
  submitting,
  disableEdit,
  onSubmit,
  onDelete
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
        <Box className={classes.header}>
          <Grid container alignItems="center" justify="space-between">
            <Grid container alignItems="center" xs={6}>
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
              <Typography variant="body1">
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
            <Grid container xs={6} justify="flex-end">
              {!pristine && (
                <Button
                  variant="contained"
                  color="secondary"
                  disabled={submitting}
                  type="submit"
                  size="small"
                >
                  {submitting ? 'Saving' : 'Save'}
                </Button>
              )}

              {step && onDelete && (
                <Box ml={1}>
                  <BaseDropdown
                    PopperProps={{
                      placement: 'bottom-end'
                    }}
                    renderDropdownButton={buttonProps => (
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
                          onClick={e => {
                            close()
                            onDelete(step)
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
        </Box>
        <Box className={classes.commonFieldsContainer}>
          <Typography variant="subtitle2" className={classes.commonFieldsTitle}>
            When is this reminder for?
          </Typography>
          <Box className={classes.commonFields}>
            <Box className={classes.commonField} width={270}>
              <WaitFor />
            </Box>
            <Box className={classes.commonField} flexGrow={1} px={0.75}>
              <EventType />
            </Box>
            <Box className={classes.commonField} flexGrow={0}>
              <Time />
            </Box>
          </Box>
        </Box>
        <Box className={classes.otherFieldsContainer}>{children}</Box>
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
            <Box
              onMouseOver={raise}
              onFocus={raise}
              onMouseOut={stopRaise}
              onBlur={stopRaise}
              className={cn(classes.container, {
                [classes.raised]: draggableSnapshot.isDragging
              })}
            >
              {renderForm({ draggableProvided })}
            </Box>
          </div>
        )}
      </Draggable>
    )
  }

  return <Box className={classes.container}>{renderForm({})}</Box>
}

export const BaseFormLayout = memo(Layout)
