import { MouseEvent, useState } from 'react'

import { Button, makeStyles } from '@material-ui/core'
import { mdiChevronUp, mdiChevronDown } from '@mdi/js'

import useNotify from '@app/hooks/use-notify'
import { updateContactTouchReminder } from '@app/models/contacts/update-contact-touch-reminder'
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
  const notify = useNotify()

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
    onUpdateTouchFreq(normalizedNewValue)

    const oldValue = contactTouchFreq

    updateContactTouchReminder(contactId, normalizedNewValue).catch(e => {
      console.log(e)
      notify({
        status: 'error',
        message: 'Something went wrong. Please try again or contact support.'
      })
      // revert optimistic update if error
      onUpdateTouchFreq(oldValue)
    })
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
