import { useState } from 'react'

import {
  Avatar,
  Box,
  Typography,
  makeStyles,
  Theme,
  MenuItem
} from '@material-ui/core'
import { mdiAccountPlusOutline } from '@mdi/js'

import { useDealsRolesContext } from '@app/contexts/deals-roles-definitions/use-deals-roles-context'
import { useBrandPropertyTypeRoles } from '@app/hooks/use-brand-property-type-roles'
import { getField } from '@app/models/Deal/helpers/context'
import { BaseDropdown } from '@app/views/components/BaseDropdown'
import { muiIconSizes } from '@app/views/components/SvgIcons/icon-sizes'
import { SvgIcon } from '@app/views/components/SvgIcons/SvgIcon'

import { isPrimaryAgent } from '../../../utils/roles'
import RoleAgentIntegration from '../AgentIntegration'

const useStyles = makeStyles(
  (theme: Theme) => ({
    container: {
      position: 'relative',
      margin: theme.spacing(0, 3)
    },
    addButton: {
      display: 'flex',
      alignItems: 'center',
      cursor: 'pointer'
    },
    avatar: {
      width: theme.spacing(3),
      height: theme.spacing(3),
      backgroundColor: theme.palette.info.ultralight
    },
    menuContainer: {
      maxHeight: '30vh',
      overflow: 'auto'
    }
  }),
  {
    name: 'Deals-AddRole'
  }
)

interface Props {
  deal: IDeal
  allowedRoles: string[]
  showBrokerageFields: boolean
  isEmailRequired: boolean
  actionRenderer: (data: {
    disabled: boolean
    onClick: (item: { value: string }) => void
  }) => void
  onCreateRole: () => void
  onCloseDrawer: () => void
}

export default function AddRoleForm({
  deal,
  allowedRoles,
  showBrokerageFields,
  isEmailRequired,
  actionRenderer,
  onCreateRole,
  onCloseDrawer
}: Props) {
  const classes = useStyles()
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedRole, setSelectedRole] = useState<Nullable<string>>(null)

  const { roles } = useBrandPropertyTypeRoles(deal.property_type.label)
  const { dealRolesByName } = useDealsRolesContext()

  const getAllowedRoles = () => {
    if (!selectedRole) {
      return allowedRoles
    }

    return Array.isArray(allowedRoles)
      ? [...allowedRoles, selectedRole]
      : [selectedRole]
  }

  const getRoleItems = () => {
    const propertyRoles = (roles || [])
      .filter(item => !!item)
      .map(item => item.role)

    const list = getAllowedRoles() ?? propertyRoles

    return list
      .filter(name => !isPrimaryAgent(name, deal.deal_type))
      .map(name => ({
        label: dealRolesByName[name]?.title,
        value: name
      }))
  }

  const handleSelectRole = (item: { value: string }) => {
    setIsFormOpen(true)
    setSelectedRole(item ? item.value : null)
  }

  const handleCloseDrawer = () => {
    setIsFormOpen(false)
    setSelectedRole(null)
    onCloseDrawer?.()
  }

  const roleItems = getRoleItems()

  return (
    <div className={classes.container}>
      {actionRenderer ? (
        actionRenderer({
          disabled: roleItems.length === 0,
          onClick: handleSelectRole
        })
      ) : (
        <BaseDropdown
          PopperProps={{
            style: {
              width: '18rem',
              zIndex: 1
            }
          }}
          disablePortal
          renderDropdownButton={({ isActive, ...buttonProps }) => (
            <div className={classes.addButton} {...buttonProps}>
              <Box mr={1}>
                <Avatar className={classes.avatar}>
                  <SvgIcon
                    path={mdiAccountPlusOutline}
                    size={muiIconSizes.xsmall}
                    color="#0945EB"
                  />
                </Avatar>
              </Box>
              <Typography variant="body2">Add a New Contact</Typography>
            </div>
          )}
          renderMenu={({ close }) => (
            <div className={classes.menuContainer}>
              {roleItems.map((item, index) => (
                <MenuItem
                  key={index}
                  onClick={() => {
                    close()
                    handleSelectRole(item)
                  }}
                >
                  {item.label}
                </MenuItem>
              ))}
            </div>
          )}
        />
      )}

      {isFormOpen && (
        <RoleAgentIntegration
          deal={deal}
          allowedRoles={getAllowedRoles()}
          isEmailRequired={isEmailRequired}
          dealEnderType={getField(deal, 'ender_type')}
          showBrokerageFields={showBrokerageFields}
          isPrimaryAgent={['BuyerAgent', 'SellerAgent'].includes(
            selectedRole || ''
          )}
          onUpsertRole={onCreateRole}
          onClose={handleCloseDrawer}
        />
      )}
    </div>
  )
}
