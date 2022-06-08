import { MouseEvent, useState } from 'react'

import { Button, makeStyles } from '@material-ui/core'
import { mdiChevronUp, mdiChevronDown } from '@mdi/js'

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
    buttonLabel: { marginLeft: theme.spacing(1) }
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
      <Button
        classes={{ label: classes.buttonLabel }}
        color="primary"
        variant="contained"
        onClick={handleOpenMenu}
        endIcon={
          <SvgIcon
            path={isMenuOpen ? mdiChevronUp : mdiChevronDown}
            size={muiIconSizes.small}
          />
        }
      >
        {frequencyToString(value, label)}
      </Button>

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
