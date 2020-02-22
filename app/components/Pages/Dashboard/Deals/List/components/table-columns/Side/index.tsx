import React from 'react'

import PopOver from 'components/Popover'

import Avatar from 'components/Avatar'

import { getSide } from 'models/Deal/helpers/context/get-side'

import { roleName, getLegalFullName } from '../../../../utils/roles'

interface Props {
  deal: IDeal
  roles: Record<UUID, IDealRole>
  rowId: number
  rowsCount: number
}

export function Side({ deal, roles, rowId, rowsCount }: Props) {
  const sideName = getSide(deal)
  const relatedRole =
    deal.roles && deal.roles.find(id => roles[id].role === sideName)

  if (!deal.roles) {
    return <span>{getSide(deal)}</span>
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
          {deal.roles.map(id => {
            const role = roles[id]

            return (
              <div key={`ROLE_${role.id}`} className="item">
                <div className="avatar">
                  <Avatar
                    title={`${role.legal_first_name} ${role.legal_last_name}`}
                    image={role.user ? role.user.profile_image_url : null}
                    size={40}
                  />
                </div>
                <div className="info">
                  <div className="role-name-container">
                    <div className="name">{`${getLegalFullName(role)},`}</div>

                    <div className="role">{roleName(role.role)}</div>
                  </div>
                  {role.user && <div className="email">{role.user.email}</div>}
                </div>
              </div>
            )
          })}
        </div>
      }
    >
      <div className="primaryHover">
        <span>{sideName}</span>

        <span
          style={{
            fontSize: '14px'
          }}
        >
          {relatedRoleUser && relatedRoleUser.last_name
            ? `: ${relatedRoleUser.last_name}`
            : ''}
        </span>
      </div>
    </PopOver>
  )
}
