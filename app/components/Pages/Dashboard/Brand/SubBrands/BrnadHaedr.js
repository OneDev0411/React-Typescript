import React from 'react'
import { connect } from 'react-redux'
import { Button } from 'react-bootstrap'
import cn from 'classnames'
import UserAvatar from '../../../../Partials/UserAvatar'
import ModalBrand from './ModalBrand'

import { getChildrenBrands, toggleBrand, editBrand } from '../../../../../store_actions/brandConsole'


const Row = ({
  brand,
  getChildrenBrands,
  toggleBrand,
  editBrand
}) => {
  const EditButton = ({
    clickHandler
  }) =>
    (<Button
      className="edit-button--brand-row"
      onClick={() => clickHandler()}
    >
        Edit
    </Button>
    )
  let members = {}
  if (brand.roles) {
    brand.roles.forEach(role =>
      role.members.map(member => {
        if (!members[member.id]) {
          members[member.id] = {
            ...member,
            roles: [role.role]
          }
        } else if (members[member.id].roles.indexOf(role.role) < 0) {
          members[member.id].roles.push(role.role)
        }
      }
      )
    )
  }

  return <div
    className={cn('brand-row', { active: brand.collapsed })}
    onClick={() => {
      if (!brand.brands) {
        getChildrenBrands(brand.id)
      }
      toggleBrand(brand.id)
    }}
  >
    <i
      className={cn(
        'fa icon',
        { 'fa-caret-right': !brand.collapsed },
        { 'fa-caret-down': brand.collapsed }
      )}
      aria-hidden="true"
    />
    <p className="brand-name">{brand.name}</p>
    <div className="avatars-container">
      {
        Object.keys(members).map((memberId, index) =>
          <div
            key={index}
            className="avatar"
          >
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
    <ModalBrand
      TriggerButton={EditButton}
      showOnly={false}
      inline
      title="Edit Team"
      buttonTitle="Edit"
      brand={brand}
      onButtonClick={(brandName) => {
        editBrand({
          id: brand.id,
          name: brandName
        })
      }}
    />
    <i
      onClick={(e) => {
        e.stopPropagation()
        // deleteTask(checklist, task.id)
      }}
      className="fa fa-times delete-button--brand-row"
      aria-hidden="true"
    />
  </div>
}

export default connect(
  null,
  ({ getChildrenBrands, toggleBrand, editBrand })
)(Row)