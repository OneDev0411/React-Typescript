import React from 'react'
import cn from 'classnames'
import { Popover, OverlayTrigger, Checkbox, Button } from 'react-bootstrap'
import UserAvatar from '../../../../Partials/UserAvatar'


const Row = ({
  member,
  index
}) => {
  const popoverHoverFocus = (
    <Popover
      id="popover-brand-user-avatar"
      title={<strong>{member.display_name}</strong>}
    >
      <strong>Member Roles:</strong>
      {
        member.roles.map((role, index) =>
          <div
            key={index}
            className="row-container"
            onClick={() => {}}
          >
            <i
              className="fa fa-check check-box-icon"
              aria-hidden="true"
            />
            {role}
          </div>
        )
      }
    </Popover>
  )

  return <OverlayTrigger
    trigger="click"
    placement="bottom"
    rootClose
    overlay={popoverHoverFocus}
    key={index}
  >
    <div
      className="avatar"
    >
      <UserAvatar
        userId={member.id}
        name={member.display_name}
        image={member.profile_image_url}
        size={30}
      />
    </div>
  </OverlayTrigger>
}

export default Row