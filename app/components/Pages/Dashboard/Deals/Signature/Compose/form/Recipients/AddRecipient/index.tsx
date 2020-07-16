import React from 'react'

import { Button, Theme } from '@material-ui/core'
import { useTheme } from '@material-ui/styles'
import cn from 'classnames'

import { BaseDropdown } from 'components/BaseDropdown'

import IconAdd from 'components/SvgIcons/AddCircleOutline/IconAddCircleOutline'
import { useIconStyles } from 'views/../styles/use-icon-styles'
import Roles from 'deals/components/Roles'

interface Props {
  deal: IDeal
  selectedRoles: Record<string, IDealRole>
  onAddRecipient: (role: IDealRole) => void
}

export function AddNewRecipient({
  deal,
  selectedRoles,
  onAddRecipient
}: Props) {
  const iconClasses = useIconStyles()
  const theme = useTheme<Theme>()

  const handleAddRecipient = (close: () => void, role: IDealRole) => {
    close()

    onAddRecipient(role)
  }

  return (
    <BaseDropdown
      renderDropdownButton={props => (
        <Button color="secondary" {...props}>
          <IconAdd
            className={cn(
              iconClasses.small,
              iconClasses.rightMargin,
              iconClasses.currentColor
            )}
          />
          Add New Recipient
        </Button>
      )}
      renderMenu={({ close }) => {
        const handleAddNewRecipient = handleAddRecipient.bind(null, close)

        return (
          <Roles
            showEmail
            isEmailRequired
            showTitle={false}
            deal={deal}
            allowDeleteRole={false}
            filter={role => !selectedRoles[role.id]}
            onSelect={handleAddNewRecipient}
            onUpsertRole={handleAddNewRecipient}
            onCreateRole={handleAddNewRecipient}
            containerStyle={{
              padding: theme.spacing(2, 0),
              maxHeight: '50vh',
              overflow: 'auto'
            }}
            addRoleActionRenderer={props => (
              <Button {...props} color="secondary" variant="outlined">
                <IconAdd
                  className={cn(
                    iconClasses.rightMargin,
                    iconClasses.currentColor
                  )}
                />
                Add New Contact
              </Button>
            )}
          />
        )
      }}
    />
  )
}
