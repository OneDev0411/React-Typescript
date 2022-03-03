import { useState, useMemo, Fragment } from 'react'

import { Tooltip } from '@material-ui/core'
import { mdiPencilOutline } from '@mdi/js'

import { useDealsRolesContext } from '@app/contexts/deals-roles-definitions/use-deals-roles-context'
import DealRole from 'components/DealRole'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'
import { getRoleTooltip } from 'deals/FormEdit/utils/get-role-tooltip'
import { getRolesList } from 'deals/FormEdit/utils/get-roles-list'
import { isBrokerageField } from 'deals/FormEdit/utils/is-brokerage-field'
import { normalizeRoleNames } from 'deals/FormEdit/utils/normalize-role-names'
import { isPrimaryAgent } from 'deals/utils/roles'

import { UnlinkFieldButton } from '../../../../components/UnlinkFieldButton'
import { AddRole } from '../AddRole'

import { RoleItem } from './styled'

export function RoleField(props) {
  const [activeRole, setRole] = useState(undefined)
  const { dealRolesByName } = useDealsRolesContext()

  const allowedRoles = normalizeRoleNames(props.deal, props.annotation.role)
  const roles = props.roles.filter(role => allowedRoles.includes(role.role))
  const isEmpty = !Object.values(props.values).join('').length
  const showBrokerageFields = isBrokerageField(props.annotation)

  const annotationRoles = useMemo(
    () =>
      getRolesList({
        roles,
        values: props.values,
        annotation: props.annotation,
        rectIndex: props.rectIndex
      }),
    [props.annotation, props.rectIndex, props.values, roles]
  )

  const tooltip = getRoleTooltip(
    dealRolesByName,
    props.annotation,
    props.annotation.type === 'Roles'
  )

  return (
    <>
      <div
        className="field-unlinkable"
        style={{
          ...props.style,
          display: 'flex',
          alignItems: 'center',
          cursor: annotationRoles.length > 0 ? props.style.cursor : 'normal',
          backgroundColor:
            annotationRoles.length > 0 ? '#d2e5f2' : 'transparent'
        }}
      >
        <Tooltip title={tooltip}>
          <div
            style={{
              display: 'inline-block'
            }}
          >
            {annotationRoles.map((role, index) => (
              <Fragment key={index}>
                <RoleItem
                  isActive={activeRole && role.id === activeRole.id}
                  style={{
                    fontSize: `${props.appearance.fontSize}px`
                  }}
                  onClick={() => setRole(role)}
                >
                  {role.value}
                </RoleItem>

                {index === annotationRoles.length - 1 ? '' : ', '}
              </Fragment>
            ))}

            {isEmpty &&
              props.annotation.type === 'Role' &&
              roles[props.annotation.number] && (
                <SvgIcon
                  path={mdiPencilOutline}
                  onClick={() => setRole(roles[props.annotation.number])}
                  size={props.style.height}
                  color={props.style.color}
                />
              )}
          </div>
        </Tooltip>

        <AddRole
          {...props}
          tooltip={annotationRoles.length === 0 && tooltip}
          roles={annotationRoles}
          deal={props.deal}
          showBrokerageFields={showBrokerageFields}
          onClick={() => setRole(null)}
          onUpsertRole={props.onUpsertRole}
        />
      </div>

      <UnlinkFieldButton
        style={{
          left: `${props.rect.left + props.rect.width - 16}px`,
          top: `${props.rect.top + props.rect.height / 10}px`,
          height: `${props.rect.height}px`
        }}
        onClick={props.onToggleUnlink}
      />

      {activeRole !== undefined && (
        <DealRole
          isOpen
          deal={props.deal}
          form={activeRole}
          showBrokerageFields={showBrokerageFields}
          allowedRoles={allowedRoles}
          onUpsertRole={props.onUpsertRole}
          onDeleteRole={props.onDeleteRole}
          isRoleRemovable={
            activeRole && !isPrimaryAgent(activeRole.role, props.deal.deal_type)
          }
          onClose={() => setRole(undefined)}
        />
      )}
    </>
  )
}
