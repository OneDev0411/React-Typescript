import React from 'react'
import { connect } from 'react-redux'
import { Button } from 'react-bootstrap'
import cn from 'classnames'
import UserAvatar from '../../../../Partials/UserAvatar'
import ModalBrand from './ModalBrand'
import Member from './Member'
import {
  getChildrenBrands,
  toggleBrand,
  editBrand,
  deleteBrand,
  deleteMembers,
  addMembers
} from '../../../../../store_actions/brandConsole'


const BrandHeader = ({
  brand,
  getChildrenBrands,
  toggleBrand,
  editBrand,
  deleteBrand,
  deleteMembers,
  addMembers
}) => {
  console.log(brand)
  const EditButton = ({
    clickHandler
  }) => <Button
    className="edit-button--brand-row"
    onClick={() => clickHandler()}
  >
    Edit
  </Button>
  let members = {}
  if (brand.roles) {
    brand.roles.forEach(role =>
      role.members.map(member => {
        let roles = members[member.id] ? members[member.id].roles : {}
        roles[role.id] = role
        members[member.id] = {
          ...member,
          roles
        }
      })
    )
  }

  return <div
    className={cn('brand-row', { active: brand.collapsed })}
  >
    <div
      className="bran-name-container"
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
      <div
        className="brand-name"

      >{brand.name}</div>
    </div>
    <div className="avatars-container">
      {
        Object.keys(members).map(memberId => <Member
          key={memberId}
          member={members[memberId]}
          roles={brand.roles}
          deleteMembers={deleteMembers}
          addMembers={addMembers}
        />)
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
        deleteBrand(brand)
      }}
      className="fa fa-times delete-button--brand-row"
      aria-hidden="true"
    />
  </div>
}

export default connect(
  null,
  ({
    getChildrenBrands,
    toggleBrand,
    editBrand,
    deleteBrand,
    deleteMembers,
    addMembers
  })
)(BrandHeader)