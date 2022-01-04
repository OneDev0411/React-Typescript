import React from 'react'

import { Typography } from '@material-ui/core'

import { Avatar } from 'components/Avatar'
import PopOver from 'components/Popover'
import { getSide } from 'models/Deal/helpers/context/get-side'

import { RoleName } from '../../../../components/Roles/RoleName'
import { getLegalFullName } from '../../../../utils/roles'

interface Props {
  deal: IDeal
  roles: Record<UUID, IDealRole>
  rowId: number
  rowsCount: number
}

export function Side({ deal, roles, rowId, rowsCount }: Props) {
  const sideName = getSide(deal)
  const dealRoles = (deal.roles || []) as unknown[]

  const relatedRole: UUID = dealRoles.find(
    (id: UUID) => roles[id].role === sideName
  ) as UUID

  if (!deal.roles) {
    return <Typography variant="caption">{getSide(deal)}</Typography>
  }

  let relatedRoleUser

  if (roles && roles[relatedRole]) {
    relatedRoleUser = roles[relatedRole].user
  }

  return (
    <PopOver
      containerStyle={{ display: 'inline-block' }}
      placement={rowId > 3 && rowId + 3 >= rowsCount ? 'top' : 'bottom'}
      id={`popover-trigger-sides-${deal.id}`}
      caption={
        <div className="roles">
          {dealRoles.map((id: UUID) => {
            const role = roles[id]

            return (
              <div key={`ROLE_${role.id}`} className="item">
                <div className="avatar">
                  <Avatar
                    alt={`${role.legal_first_name} ${role.legal_last_name}`}
                    user={role.user}
                  />
                </div>
                <div className="info">
                  <div className="role-name-container">
                    <div className="name">{`${getLegalFullName(role)},`}</div>

                    <div className="role">
                      <RoleName name={role.role} />
                    </div>
                  </div>
                  {role.user && <div className="email">{role.user.email}</div>}
                </div>
              </div>
            )
          })}
        </div>
      }
    >
      <div
        className="underline-on-hover"
        style={{
          cursor: 'help'
        }}
      >
        <Typography variant="caption">{sideName}</Typography>

        <Typography variant="caption">
          {relatedRoleUser && relatedRoleUser.last_name
            ? `: ${relatedRoleUser.last_name}`
            : ''}
        </Typography>
      </div>
    </PopOver>
  )
}
