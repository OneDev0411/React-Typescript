import React from 'react'
import { connect } from 'react-redux'
import { Button } from 'react-bootstrap'
import Compose from './ModalNewRole'
import { addRole } from '../../../../../store_actions/brandConsole'

const Header = ({ role, addRole }) => {
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
    <span className="button">
      <Compose
        TriggerButton={AddButton}
        showOnly={false}
        dropDownBox
        inline
        title="Give your role a name"
        buttonTitle="Add Role"
        onButtonClick={(newRole) => {
          addRole(role, newRole)
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

