import React, { useState, useEffect } from 'react'
import { FieldInputProps } from 'react-final-form'
import {
  Button,
  Popover,
  List,
  ListItem,
  ListItemText,
  makeStyles,
  Theme
} from '@material-ui/core'
import cn from 'classnames'
import { mdiChevronDown } from '@mdi/js'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'
import { muiIconSizes } from 'components/SvgIcons/icon-sizes'
import { REMINDER_SHORTHAND_OPTIONS } from 'views/utils/reminder'

export const useStyles = makeStyles((theme: Theme) => ({
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  shorthandType: {
    '& .MuiButton-root:not(:last-child)': {
      marginRight: theme.spacing(0.5)
    }
  },
  isTypeActive: {
    background: theme.palette.grey[300]
  },
  otherType: {}
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
    const isOtherTypeSelected = REMINDER_SHORTHAND_OPTIONS.otherItems?.some(
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
        {REMINDER_SHORTHAND_OPTIONS.shortHandItems?.map(type => (
          <Button
            variant="outlined"
            size="small"
            key={type.value}
            onClick={() => handleOnChange(type)}
            className={cn({
              [classes.isTypeActive]: value?.value === type.value
            })}
          >
            {type.title}
          </Button>
        ))}
      </div>
      <div className={classes.otherType}>
        <Button
          variant="outlined"
          size="small"
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
          {REMINDER_SHORTHAND_OPTIONS.otherItems.map(type => (
            <ListItem
              button
              key={type.value}
              onClick={() => {
                handleOnChange(type)
                handleCloseMore()
              }}
            >
              <ListItemText primary={type.title} />
            </ListItem>
          ))}
        </List>
      </Popover>
    </div>
  )
}
