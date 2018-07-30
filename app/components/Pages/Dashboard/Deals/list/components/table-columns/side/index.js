import React from 'react'
import { Popover, OverlayTrigger } from 'react-bootstrap'

import UserAvatar from '../../../../../../../Partials/UserAvatar'
import Deal from '../../../../../../../../models/Deal'
import { roleName } from '../../../../utils/roles'

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
    <OverlayTrigger
      trigger={['hover', 'focus']}
      placement={rowId > 3 && rowId + 3 >= rowsCount ? 'top' : 'bottom'}
      overlay={
        <Popover
          className="deal-list--popover push-left"
          id={`popover-trigger-sides-${deal.id}`}
        >
          <div className="roles">
            {deal.roles.map(id => {
              const role = roles[id]

              return (
                <div key={`ROLE_${role.id}`} className="item">
                  <div className="avatar">
                    <UserAvatar
                      name={`${role.legal_first_name} ${role.legal_last_name}`}
                      image={role.user ? role.user.profile_image_url : null}
                      size={26}
                      showStateIndicator={false}
                    />
                  </div>
                  <div className="info">
                    <div className="role-name-container">
                      <div className="name">
                        {`${role.legal_first_name} ${role.legal_last_name},`}
                      </div>

                      <div className="role">{roleName(role.role)}</div>
                    </div>
                    {role.user && (
                      <div className="email">{role.user.email}</div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </Popover>
      }
    >
      <div className="hoverable inline">
        <span>{sideName}</span>

        <span
          style={{
            color: '#5b6469',
            fontSize: '13px'
          }}
        >
          {relatedRoleUser && relatedRoleUser.last_name
            ? `: ${relatedRoleUser.last_name}`
            : ''}
        </span>
      </div>
    </OverlayTrigger>
  )
}

export default Side
