import React from 'react'
import { Field } from 'react-final-form'
import { Button, makeStyles, Theme } from '@material-ui/core'
import Flex from 'styled-flex-component'
import cn from 'classnames'

import { Dropdown } from 'components/Dropdown'
import { DropdownToggleButton } from 'components/DropdownToggleButton'
import { eventTypesIcons } from 'views/utils/event-types-icons'

const SHORTHAND_ITEMS = [
  {
    title: 'Call',
    value: 'Call'
  },
  {
    title: 'In-Person Meeting',
    value: 'In-Person Meeting'
  }
]

const OTHER_ITEMS = [
  {
    title: 'Text',
    value: 'Text'
  },
  {
    title: 'Chat',
    value: 'Chat'
  },
  {
    title: 'Mail',
    value: 'Mail'
  },
  {
    title: 'Email',
    value: 'Email'
  },
  {
    title: 'Other',
    value: 'Other'
  }
]

export const useStyles = makeStyles((theme: Theme) => ({
  container: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(1)
  },
  shorthandType: {
    '& .MuiButton-root:not(:last-child)': {
      marginRight: theme.spacing(0.5)
    }
  },
  isShorthandActive: {
    background: theme.palette.grey[300]
  },
  otherType: {
    marginRight: theme.spacing(1)
  }
}))

export function EventType() {
  const classes = useStyles()

  return (
    <Field
      name="task_type"
      render={({ input }) => {
        return (
          <div className={classes.container}>
            <div className={classes.shorthandType}>
              {SHORTHAND_ITEMS.map(type => (
                <Button
                  variant="outlined"
                  size="small"
                  key={type.value}
                  startIcon={eventTypesIcons[type.title].icon({})}
                  onClick={() => input.onChange(type)}
                  className={cn({
                    [classes.isShorthandActive]:
                      input.value?.value === type.value
                  })}
                >
                  {type.title}
                </Button>
              ))}
            </div>
            <div className={classes.otherType}>
              {/* @ts-ignore */}
              <Dropdown
                input={input}
                defaultSelectedItem={{ title: 'More' }}
                icons={eventTypesIcons}
                items={OTHER_ITEMS}
                fullHeight
                buttonRenderer={({ icon: Icon, iconColor, ...props }) => (
                  <DropdownToggleButton {...props} isActive={props.isOpen}>
                    <Flex alignCenter>
                      {Icon && (
                        <Icon
                          style={{
                            marginRight: '0.5em',
                            fill: iconColor || '#000'
                          }}
                        />
                      )}
                      {props.value}
                    </Flex>
                  </DropdownToggleButton>
                )}
              />
            </div>
          </div>
        )
      }}
    />
  )
}
