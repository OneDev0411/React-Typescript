import React from 'react'

import PopOver from 'components/Popover'

import Deal from 'models/Deal'

import Avatar from 'components/Avatar'

import { roleName, getLegalFullName } from '../../../../utils/roles'

const Side = ({ deal, roles, rowId, rowsCount }) => {
  const sideName = Deal.get.side(deal)
  const relatedRole =
    deal.roles && deal.roles.find(id => roles[id].role === sideName)

  if (!deal.roles) {
    return <div>{Deal.get.side(deal)}</div>
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

export default Side
