import React from 'react'
import { Field } from 'react-final-form'
import { Theme, makeStyles } from '@material-ui/core'
import { mdiBellOutline } from '@mdi/js'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'
import { muiIconSizes } from 'components/SvgIcons/icon-sizes'
import { Dropdown } from 'components/Dropdown'
import { DropdownToggleButton } from 'components/DropdownToggleButton'
import { REMINDER_DROPDOWN_OPTIONS } from 'views/utils/reminder'

const useStyles = makeStyles(
  (theme: Theme) => ({
    icon: {
      marginRight: theme.spacing(0.5)
    }
  }),
  { name: 'Riminder' }
)

interface Props {
  dropDownProps?: object
  dueDate: Date
}

export function ReminderField({ dropDownProps = {}, dueDate }: Props) {
  const classes = useStyles()
  const now = Date.now()
  const dueDateTimestamp = dueDate.getTime()

  return (
    <Field
      name="reminder"
      render={({ input }) => (
        <>
          {/*
          // @ts-ignore js component */}
          <Dropdown
            {...dropDownProps}
            input={input}
            items={REMINDER_DROPDOWN_OPTIONS.filter(
              ({ value }) => value == null || value <= dueDateTimestamp - now
            )}
            fullHeight
            buttonRenderer={buttonProps => (
              <DropdownToggleButton {...buttonProps}>
                <SvgIcon
                  className={classes.icon}
                  path={mdiBellOutline}
                  size={muiIconSizes.small}
                />
                {buttonProps.value}
              </DropdownToggleButton>
            )}
          />
        </>
      )}
    />
  )
}
