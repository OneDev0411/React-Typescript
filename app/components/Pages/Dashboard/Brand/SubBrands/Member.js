import React from 'react'
import cn from 'classnames'
import { Popover, OverlayTrigger } from 'react-bootstrap'
import UserAvatar from '../../../../Partials/UserAvatar'

const Member = ({ member, roles, deleteMembers, addMembers }) => {
  const popoverHoverFocus = (
    <Popover
      id="popover-brand-user-avatar"
      title={
        <div>
          <strong>{member.display_name}</strong>
          <p className="sub-title">{member.email}</p>
        </div>
      }
    >
      <strong>Member Roles:</strong>
      {roles.map((role, index) => {
        let active = member.roles[role.id]

        return (
          <div
            key={index}
            className="row-container"
            onClick={() => {
              if (active) {
                deleteMembers(member.roles[role.id], member.id)
              } else {
                addMembers(role.brand, role.id, { users: [member.id] })
              }
            }}
          >
            <i
              className={cn('fa fa-check check-box-icon', { active })}
              aria-hidden="true"
            />
            {role.role}
          </div>
        )
      })}
    </Popover>
  )

  return (
    <OverlayTrigger
      trigger="click"
      placement="bottom"
      rootClose
      overlay={popoverHoverFocus}
    >
      <div className="avatar">
        <UserAvatar
          userId={member.id}
          name={member.display_name}
          image={member.profile_image_url}
          size={30}
          color="#000000"
        />
      </div>
    </OverlayTrigger>
  )
}

export default Member
