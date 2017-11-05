import React from 'react'
import { connect } from 'react-redux'
import { Button } from 'react-bootstrap'
import Compose from './ModalNewRole'
import { addRole } from '../../../../../store_actions/brandConsole'

const Header = ({
  brand,
  aclTypes,
  addRole
}) => {
  const AddButton = ({
    clickHandler
  }) => (
    <Button
      bsStyle="primary"
      onClick={() => clickHandler()}
    >
      Add New Role
    </Button>
  )

  return (
    <div className="toolbar">
      <span className="button">
        <Compose
          TriggerButton={AddButton}
          aclTypes={aclTypes}
          inline
          title="Give your role a name"
          buttonTitle="Add Role"
          onButtonClick={(newRole) => {
            addRole(brand, newRole)
          }}
        />
      </span>
    </div>
  )
}

export default connect(
  null,
  ({ addRole })
)(Header)

