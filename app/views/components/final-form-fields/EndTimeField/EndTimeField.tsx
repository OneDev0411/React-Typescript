import React, { useState } from 'react'
import fecha from 'fecha'
import { Field, FieldRenderProps } from 'react-final-form'
import {
  Box,
  Button,
  ClickAwayListener,
  Grow,
  Paper,
  Popper,
  Tooltip,
  Typography,
  useTheme
} from '@material-ui/core'
import { PopperPlacementType } from '@material-ui/core/Popper'

import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'

import TimeInput from 'components/TimeInput'
import IconClose from 'components/SvgIcons/Close/CloseIcon'

import { useIconStyles } from '../../../../styles/use-icon-styles'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    removeButton: {
      minWidth: 0
    },
    addButton: {
      marginLeft: theme.spacing(1)
    }
  })
)

interface Props {
  dueDate: Date
  placement?: PopperPlacementType
}

export function EndTimeField({ dueDate, placement = 'bottom-end' }: Props) {
  const theme = useTheme()
  const classes = useStyles()
  const iconClasses = useIconStyles()

  const anchorRef = React.useRef<HTMLButtonElement>(null)

  const [endDate, setEndDate] = useState<Date>(dueDate)

  const [isOpen, setIsOpen] = useState(false)
  const id = isOpen ? 'end-time-field' : undefined

  function handleToggle() {
    setIsOpen(prevOpen => !prevOpen)
  }

  function handleClose(event) {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return
    }

    setIsOpen(false)
  }

  return (
    <Field
      name="endDate"
      render={(fieldProps: FieldRenderProps<any>) => {
        const { value, onChange } = fieldProps.input
        const defaultDate = value || dueDate

        return (
          <Box display="flex" alignItems="center" pr={1}>
            {value && <Typography variant="body2">End Time:</Typography>}
            <Button
              aria-describedby={id}
              color="secondary"
              ref={anchorRef}
              onClick={handleToggle}
            >
              {value ? fecha.format(value, 'hh:mm A') : 'Add End Time'}
            </Button>
            {value && (
              <Tooltip placement={placement} title="Remove Time">
                <Button
                  color="secondary"
                  size="small"
                  // @ts-ignore FinalForm bug
                  onClick={() => onChange(null)}
                  className={classes.removeButton}
                >
                  <IconClose className={iconClasses.small} />
                </Button>
              </Tooltip>
            )}
            <Popper
              anchorEl={anchorRef.current}
              open={isOpen}
              placement={placement}
              style={{ zIndex: theme.zIndex.modal }}
              transition
            >
              {({ TransitionProps, placement }) => (
                <Grow
                  {...TransitionProps}
                  style={{
                    transformOrigin:
                      placement === 'bottom' ? 'center top' : 'center bottom'
                  }}
                >
                  <ClickAwayListener onClickAway={handleClose}>
                    <Paper id={id}>
                      <Box display="flex" alignItems="center" p={1}>
                        <TimeInput
                          defaultDate={defaultDate}
                          onChange={setEndDate}
                        />
                        <Button
                          onClick={e => {
                            // @ts-ignore FinalForm bug
                            onChange(endDate)
                            handleClose(e)
                          }}
                          size="small"
                          type="button"
                          color="secondary"
                          className={classes.addButton}
                        >
                          Add
                        </Button>
                      </Box>
                    </Paper>
                  </ClickAwayListener>
                </Grow>
              )}
            </Popper>
          </Box>
        )
      }}
    />
  )
}
