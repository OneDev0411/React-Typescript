import React, { useState, useEffect } from 'react'
import { FieldInputProps } from 'react-final-form'
import {
  Button,
  Popover,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  makeStyles,
  Theme
} from '@material-ui/core'
import cn from 'classnames'

import { mdiDotsVertical, mdiChevronDown } from '@mdi/js'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'
import { muiIconSizes } from 'components/SvgIcons/icon-sizes'
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
    alignItems: 'center'
  },
  shorthandType: {
    '& .MuiButton-root:not(:last-child)': {
      marginRight: theme.spacing(0.5)
    }
  },
  isTypeActive: {
    background: theme.palette.grey[300]
  },
  otherItemIcon: {
    minWidth: 'unset',
    marginRight: theme.spacing(2)
  }
}))

interface Props {
  input: FieldInputProps<any>
}

export function Selector({ input }: Props) {
  const classes = useStyles()
  const [value, setValue] = useState<FieldInputProps<any>>(input.value || null)
  const [moreEl, setMoreEl] = useState<HTMLButtonElement | null>(null)
  const [isMoreActive, setIsMoreActive] = useState<boolean>(false)

  useEffect(() => {
    const isOtherTypeSelected = OTHER_ITEMS.some(
      type => value.value === type.value
    )

    setIsMoreActive(isOtherTypeSelected)
  }, [value])

  const handleOpenMore = (event: React.MouseEvent<HTMLButtonElement>) => {
    setMoreEl(event.currentTarget)
  }

  const handleCloseMore = () => {
    setMoreEl(null)
  }

  const isMoreOpen = Boolean(moreEl)
  const moreContainerId = isMoreOpen ? 'more-popover' : undefined

  const handleOnChange = type => {
    setValue(type)
    input.onChange(type)
  }

  return (
    <div className={classes.container}>
      <div className={classes.shorthandType}>
        {SHORTHAND_ITEMS.map(type => (
          <Button
            variant="outlined"
            size="small"
            key={type.value}
            startIcon={eventTypesIcons[type.title].icon({
              size: muiIconSizes.small
            })}
            onClick={() => handleOnChange(type)}
            className={cn({
              [classes.isTypeActive]: value?.value === type.value
            })}
          >
            {type.title}
          </Button>
        ))}
        <Button
          variant="outlined"
          size="small"
          startIcon={
            isMoreActive ? (
              eventTypesIcons[value.title].icon({
                size: muiIconSizes.small
              })
            ) : (
              <SvgIcon path={mdiDotsVertical} size={muiIconSizes.small} />
            )
          }
          endIcon={<SvgIcon path={mdiChevronDown} size={muiIconSizes.small} />}
          onClick={handleOpenMore}
          className={cn({
            [classes.isTypeActive]: isMoreActive
          })}
        >
          {isMoreActive ? value.title : 'More'}
        </Button>
      </div>
      <Popover
        id={moreContainerId}
        open={isMoreOpen}
        anchorEl={moreEl}
        onClose={handleCloseMore}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center'
        }}
      >
        <List dense>
          {OTHER_ITEMS.map(type => (
            <ListItem
              button
              key={type.value}
              onClick={() => {
                handleOnChange(type)
                handleCloseMore()
              }}
            >
              <ListItemIcon className={classes.otherItemIcon}>
                {eventTypesIcons[type.title].icon({ size: muiIconSizes.small })}
              </ListItemIcon>
              <ListItemText primary={type.title} />
            </ListItem>
          ))}
        </List>
      </Popover>
    </div>
  )
}
