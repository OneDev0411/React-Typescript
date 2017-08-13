import React from 'react'
import { connect } from 'react-redux'
import { Button } from 'react-bootstrap'
import Compose from '../Shared/ModalNewRole'
import { addRoles } from '../../../../../store_actions/brandConsole'

const Header = ({ role, addRoles }) => {
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

  return (<div className="toolbar">
    <span className="title">
      Assign Members to Roles
    </span>
    <span className="button">
      <Compose
        TriggerButton={AddButton}
        showOnly={false}
        dropDownBox
        inline
        title="Give your role a name"
        buttonTitle="Add Role"
        onButtonClick={(newRole) => {
          addRoles(role, newRole)
        }}
      />
    </span>
  </div>
  )
}

export default connect(
  null,
  ({ addRoles })
)(Header)

