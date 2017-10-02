import React from 'react'
import { connect } from 'react-redux'
import { Button } from 'react-bootstrap'
import cn from 'classnames'
import Compose from './ModalNewRole'
import {
  editRole,
  deleteRole
} from '../../../../../store_actions/brandConsole'

const Row = ({
  role,
  aclTypes,
  activeItem,
  editRole,
  deleteRole
}) => {
  const AddButton = ({
    clickHandler
  }) =>
    (
      <Button
        className="edit-button"
        onClick={() => clickHandler()}
      >
        Edit
      </Button>
    )
  return <div
    className={cn('checklist-row', { active: activeItem })}
  >
    <div
      className="checklist--row--first"
    >
      {role.role}
    </div>
    {
      aclTypes.map(permission => {
        let active = role.acl && (role.acl.indexOf(permission) > -1)
        return <div
          key={permission}
          className="checklist--row--column-center"
          style={{ overflow: 'hidden' }}
        >
          <i
            className={cn('fa fa-check check-box-icon', { active })}
            aria-hidden="true"
          />
        </div>
      })
    }
    <div
      className="checklist--row--last"
    >
      <div
        className="edit-button-container"
      >
        <Compose
          TriggerButton={AddButton}
          showOnly={false}
          dropDownBox
          inline
          title="Edit Checklist"
          buttonTitle="Edit"
          onButtonClick={(editedRole) => {
            editRole({ ...role, ...editedRole })
          }}
          role={role}
          activeItem={activeItem}
          aclTypes={aclTypes}
        />
      </div>
      <div
        className="delete-icon"
      >
        <i
          onClick={(e) => {
            e.stopPropagation()
            deleteRole(role)
          }}
          className="fa fa-times"
          aria-hidden="true"
        />
      </div>
    </div>
  </div>
}

export default connect(
  null,
  ({
    editRole,
    deleteRole
  })
)(Row)