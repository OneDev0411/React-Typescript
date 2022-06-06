import { MouseEvent, useState } from 'react'

import { Button, makeStyles } from '@material-ui/core'
import { mdiChevronUp, mdiChevronDown } from '@mdi/js'

import { muiIconSizes } from 'components/SvgIcons/icon-sizes'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'

import { frequencyToString } from './helper'
import { ManageRelationshipMenu } from './ManageRelationshipMenu'

interface Props {
  contactId: UUID
  contactTouchFreq: Nullable<number>
  onUpdateTouchFreq(newValue: Nullable<number>): void
}

const useStyles = makeStyles(
  theme => ({
    buttonLabel: { marginLeft: theme.spacing(1) }
  }),
  { name: 'ManageRelationship' }
)

export function ManageRelationship({
  contactId,
  contactTouchFreq,
  onUpdateTouchFreq
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
    // Todo: update contactTouchFreq
    console.log('onChangeTouchFreq', contactId, newValue)
    onUpdateTouchFreq(newValue)
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
        {frequencyToString(contactTouchFreq)}
      </Button>

      {isMenuOpen && (
        <ManageRelationshipMenu
          anchorEl={menuAnchorEl}
          onClose={handleCloseMenu}
          contactTouchFreq={contactTouchFreq}
          onChangeTouchFreq={onChangeTouchFreq}
        />
      )}
    </>
  )
}
