import React from 'react'
import { connect } from 'react-redux'
import { Button } from 'react-bootstrap'
import cn from 'classnames'
import UserAvatar from '../../../../Partials/UserAvatar'

import { getChildrenBrands, toggleBrand } from '../../../../../store_actions/brandConsole'


const Row = ({
  onSelectItem,
  activeItem,
  brand,
  getChildrenBrands,
  toggleBrand
}) => {
  let members = {}
  if (brand.roles)
    brand.roles.forEach(role =>
      role.members.forEach(member => {
        if (!members[member.id])
          members[member.id] = {
            ...member,
            roles: [role.role]
          }
        else if (members[member.id].roles.indexOf(role.role) < 0)
          members[member.id].roles.push(role.role)
      }
      )
    )
  return <div
    className={cn('brandRow', { active: activeItem })}
    onClick={() => {
      if (!brand.brands) {
        getChildrenBrands(brand.id)
      }
      toggleBrand(brand.id)
      onSelectItem(brand.id)
    }}
  >
    <i
      className={cn(
        'fa icon',
        { 'fa-caret-right': !activeItem },
        { 'fa-caret-down': activeItem }
      )}
      aria-hidden="true"
    />
    <p className="brand-name">{brand.name}</p>
    <div className="avatars-container">
      {
        Object.keys(members).map(memberId => <div className="avatar">
          <UserAvatar
            userId={members[memberId].id}
            name={members[memberId].display_name}
            image={members[memberId].profile_image_url}
            size={30}
          />
        </div>)
      }
      <UserAvatar
        userId="addMember"
        name="&#43;"
        size={30}
        showStateIndicator={false}
        textSizeRatio={1.5}
      />
    </div>
    <Button
      className="editButton"
      onClick={() => clickHandler()}
    >
      Edit
    </Button>
    <i
      onClick={(e) => {
        e.stopPropagation()
        deleteTask(checklist, task.id)
      }}
      className="fa fa-times delete-icon"
      aria-hidden="true"
    />
  </div>
}

export default connect(
  null,
  ({ getChildrenBrands, toggleBrand })
)(Row)