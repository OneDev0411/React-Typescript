import { MouseEvent, useState } from 'react'

import { Button, makeStyles, Tooltip } from '@material-ui/core'
import { mdiBellOffOutline, mdiBellRing } from '@mdi/js'

import { muiIconSizes } from 'components/SvgIcons/icon-sizes'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'

import { frequencyToString } from './helper'
import { ManageRelationshipMenu } from './ManageRelationshipMenu'

interface Props {
  value: Nullable<number>
  onChange(newValue: Nullable<number>): void
  label?: string
}

const useStyles = makeStyles(
  theme => ({
    iconButton: {
      height: '36px',
      minWidth: '40px',
      padding: theme.spacing(0.75, 1)
    }
  }),
  { name: 'ManageRelationship' }
)

export function ManageRelationship({
  value,
  onChange,
  label = 'Manage Relationship'
}: Props) {
  const classes = useStyles()

  const [menuAnchorEl, setMenuAnchorEl] = useState<HTMLButtonElement | null>(
    null
  )
  const isMenuOpen = Boolean(menuAnchorEl)

  const handleOpenMenu = (event: MouseEvent<HTMLButtonElement>) => {
    setMenuAnchorEl(event.currentTarget)
  }

  const handleCloseMenu = () => {
    setMenuAnchorEl(null)
  }

  const onChangeTouchFreq = (newValue: Nullable<number>) => {
    handleCloseMenu()

    // Falsy values ('' / 0 / undefined) should be considered null in the backend
    const normalizedNewValue = newValue || null

    // To do the optimistic update,
    // we need to update the contact object in parent component
    onChange(normalizedNewValue)
  }

  return (
    <>
      <Tooltip
        title={`${value ? 'Auto reminder: ' : ''}${frequencyToString(
          value,
          label
        )}`}
      >
        <Button
          className={value ? classes.iconButton : ''}
          color="default"
          variant="outlined"
          onClick={handleOpenMenu}
          startIcon={
            !value ? (
              <SvgIcon
                path={value ? mdiBellRing : mdiBellOffOutline}
                size={muiIconSizes.small}
              />
            ) : undefined
          }
        >
          {value ? (
            <SvgIcon path={mdiBellRing} size={muiIconSizes.small} />
          ) : (
            'Auto Remind'
          )}
        </Button>
      </Tooltip>
      {isMenuOpen && (
        <ManageRelationshipMenu
          anchorEl={menuAnchorEl}
          onClose={handleCloseMenu}
          contactTouchFreq={value}
          onChangeTouchFreq={onChangeTouchFreq}
        />
      )}
    </>
  )
}
