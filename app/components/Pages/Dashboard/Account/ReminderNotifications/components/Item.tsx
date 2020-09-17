import React, { useState, useLayoutEffect } from 'react'
import { makeStyles, Theme, useTheme } from '@material-ui/core'
import classNames from 'classnames'

import { BasicDropdown } from 'components/BasicDropdown'
import { CheckBoxButton } from 'components/Button/CheckboxButton'
import IconBell from 'components/SvgIcons/Bell/IconBell'
import LinkButton from 'components/Button/LinkButton'
import ArrowDropDown from 'components/SvgIcons/KeyboardArrowDown/IconKeyboardArrowDown'

import { oneDayInSeconds, oneWeekInSeconds } from '../constants'

import CustomReminder from './CustomReminder'

const zeroOption = {
  label: 'Day of',
  value: 0
} as const
const customOption = {
  label: 'Custom',
  value: 'CUSTOM'
} as const
const options = [
  zeroOption,
  {
    label: '1 day before',
    value: oneDayInSeconds
  },
  {
    label: '2 days before',
    value: 2 * oneDayInSeconds
  },
  {
    label: '3 days before',
    value: 3 * oneDayInSeconds
  },
  {
    label: '1 week before',
    value: oneWeekInSeconds
  },
  {
    label: '2 weeks before',
    value: 2 * oneWeekInSeconds
  },
  customOption
] as const

const useStyles = makeStyles(
  (theme: Theme) => ({
    container: {
      marginBottom: theme.spacing(4)
    },
    checkBoxContainer: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      paddingBottom: theme.spacing(1),
      width: 'fit-content',
      cursor: 'pointer',
      '&:last-child': {
        marginLeft: theme.spacing(0.5)
      }
    },
    dropButton: {
      paddingLeft: 0,
      width: theme.spacing(22),
      fontWeight: 500,
      justifyContent: 'space-between',
      backgroundColor: theme.palette.grey[50],
      color: theme.palette.common.black
    },
    dropButtonOpened: {
      color: theme.palette.primary.main
    },
    dropButtonEnabled: {
      ':hover > svg': {
        fill: theme.palette.primary.main
      }
    },
    dropIcon: {
      margin: theme.spacing(0.5, 0, 0, 2),
      position: 'relative'
    },
    dropIconOpened: {
      transform: 'rotateX(180deg)'
    }
  }),
  { name: 'ReminderNotifications-Item' }
)

interface Props {
  label: string
  selected: boolean
  reminderSeconds: number
  onChange: (selected: boolean, reminderSeconds: number) => void
}

export default function Item({
  label,
  selected,
  reminderSeconds,
  onChange
}: Props) {
  const [option, setOption] = useState(
    () => options.find(({ value }) => value === reminderSeconds) || customOption
  )

  function getReminderSeconds(): number {
    return option === customOption ? reminderSeconds : (option.value as number)
  }

  useLayoutEffect(() => {
    if (!selected) {
      setOption(zeroOption)
    } else if (reminderSeconds !== getReminderSeconds()) {
      setOption(
        options.find(({ value }) => value === reminderSeconds) ?? customOption
      )
    }
  }, [selected, reminderSeconds])

  function toggleSelected(): void {
    onChange(!selected, selected ? 0 : reminderSeconds)
  }

  const classes = useStyles()
  const theme = useTheme<Theme>()

  return (
    <div className={classes.container}>
      <div className={classes.checkBoxContainer} onClick={toggleSelected}>
        <CheckBoxButton onClick={toggleSelected} isSelected={selected} square />
        &nbsp;&nbsp;<span>{label}</span>
      </div>

      <BasicDropdown
        disabled={!selected}
        fullHeight
        items={options}
        selectedItem={option}
        buttonIcon={IconBell}
        onSelect={(option: typeof options[number]) => {
          setOption(option)

          if (option !== customOption) {
            onChange(selected, option.value as number)
          }
        }}
        menuStyle={{ width: theme.spacing(22) }}
        buttonRenderer={props => (
          <LinkButton
            {...props}
            inverse
            className={classNames(
              classes.dropButton,
              props.isOpen && classes.dropButtonOpened,
              !props.disabled && classes.dropButtonEnabled
            )}
          >
            <IconBell />
            {option.label}
            <ArrowDropDown
              className={classNames(
                classes.dropIcon,
                props.isOpen && classes.dropIconOpened
              )}
            />
          </LinkButton>
        )}
      />
      {option === customOption && (
        <CustomReminder
          seconds={reminderSeconds}
          onChange={seconds => onChange(selected, seconds)}
        />
      )}
    </div>
  )
}
