import React from 'react'
import { connect } from 'react-redux'
import { Button } from 'react-bootstrap'
import Compose from './ModalMember'
import { addMembers } from '../../../../../store_actions/brandConsole'

const AddMemberButton = ({
  brand,
  roles,
  addMembers
}) => {
  const AddButton = ({
    clickHandler
  }) => (
    <Button
      className="edit-button--brand-row visible"
      onClick={() => clickHandler()}
    >
      Add Member
    </Button>
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
              addMembers(brand, role, recipients)
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

