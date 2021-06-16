import { Box, Button, Theme } from '@material-ui/core'
import { useTheme } from '@material-ui/styles'
import { mdiPlusCircleOutline } from '@mdi/js'

import { BaseDropdown } from 'components/BaseDropdown'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'
import { muiIconSizes } from 'components/SvgIcons/icon-sizes'
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
  const theme = useTheme<Theme>()

  const handleAddRecipient = (close: () => void, role: IDealRole) => {
    close()

    onAddRecipient(role)
  }

  return (
    <BaseDropdown
      renderDropdownButton={props => (
        <Button color="secondary" {...props}>
          <SvgIcon
            path={mdiPlusCircleOutline}
            rightMargined
            size={muiIconSizes.small}
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
            allowEditRole={false}
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
              <Box mt={1}>
                <Button
                  {...props}
                  color="secondary"
                  variant="outlined"
                  startIcon={<SvgIcon path={mdiPlusCircleOutline} />}
                >
                  Add New Contact
                </Button>
              </Box>
            )}
          />
        )
      }}
    />
  )
}
