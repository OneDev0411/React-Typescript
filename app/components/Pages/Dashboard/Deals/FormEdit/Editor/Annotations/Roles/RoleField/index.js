import React, { useState, useMemo, Fragment } from 'react'

import { normalizeRoleNames } from 'deals/FormEdit/utils/normalize-role-names'
import { getRoleTooltip } from 'deals/FormEdit/utils/get-role-tooltip'
import { getRolesList } from 'deals/FormEdit/utils/get-roles-list'
import { isPrimaryAgent } from 'deals/utils/roles'

import Tooltip from 'components/tooltip'
import DealRole from 'components/DealRole'
import EditIcon from 'components/SvgIcons/Edit/EditIcon'

import { AddRole } from '../AddRole'
import { RoleItem } from './styled'

export function RoleField(props) {
  const [activeRole, setRole] = useState(undefined)

  const allowedRoles = normalizeRoleNames(props.deal, props.annotation.role)
  const roles = props.roles.filter(role => allowedRoles.includes(role.role))
  const isEmpty = !Object.values(props.values).join('').length

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
    props.annotation,
    props.annotation.type === 'Roles'
  )

  return (
    <Fragment>
      <div
        style={{
          ...props.style,
          backgroundColor:
            annotationRoles.length > 0 ? 'transparent' : '#d2e5f2'
        }}
      >
        <Tooltip caption={tooltip}>
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
                <EditIcon
                  onClick={() => setRole(roles[props.annotation.number])}
                  style={{
                    height: props.style.height,
                    fill: props.style.color
                  }}
                />
              )}
          </div>
        </Tooltip>

        <AddRole
          {...props}
          tooltip={annotationRoles.length === 0 && tooltip}
          roles={annotationRoles}
          deal={props.deal}
          onClick={() => setRole(null)}
          onUpsertRole={props.onUpsertRole}
        />
      </div>

      {activeRole !== undefined && (
        <DealRole
          isOpen
          deal={props.deal}
          form={activeRole}
          showBrokerageFields={props.annotation.attribute.includes(
            'agent.office'
          )}
          allowedRoles={allowedRoles}
          onUpsertRole={props.onUpsertRole}
          onDeleteRole={props.onDeleteRole}
          isRoleRemovable={
            activeRole && !isPrimaryAgent(activeRole.role, props.deal.deal_type)
          }
          onClose={() => setRole(undefined)}
        />
      )}
    </Fragment>
  )
}
