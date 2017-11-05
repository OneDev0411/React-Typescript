import React from 'react'
import { connect } from 'react-redux'
import { Button } from 'react-bootstrap'
import Compose from './ModalMember'
import { addMembers } from '../../../../../store_actions/brandConsole'

const AddMemberButton = ({
  brand,
  addMembers
}) => {
  const AddButton = ({
    clickHandler
  }) => (
    <button
      className="add-member--brand-row"
      onClick={() => clickHandler()}
    >
      <i className="fa fa-user-plus" aria-hidden="true" />
    </button>
  )

  return (
    <div>
      <span className="button">
        <Compose
          roles={brand.roles}
          TriggerButton={AddButton}
          showOnly={false}
          dropDownBox
          inline
          title="Add Member"
          buttonTitle="Add"
          onButtonClick={(activeRoles, recipients) => {
            activeRoles.forEach(role =>
              addMembers(brand.id, role, recipients)
            )
          }}
        />
      </span>
    </div>
  )
}

export default connect(
  ({ brandConsole, data }) => ({
    roles: brandConsole.roles || []
  }),
  ({ addMembers })
)(AddMemberButton)

