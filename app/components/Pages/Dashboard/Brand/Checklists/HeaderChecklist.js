import React from 'react'
import { connect } from 'react-redux'
import { Col, Button } from 'react-bootstrap'
import cn from 'classnames'
import Compose from './ModalChecklist'
import { editChecklist } from '../../../../../store_actions/brandConsole'

const Row = ({
  deleteChecklist,
  onSelectItem,
  checklist,
  activeItem,
  editChecklist
}) => {
  const AddButton = ({
    clickHandler
  }) =>
    (
      <Button
        className="editButton"
        onClick={() => clickHandler()}
      >
        Edit
      </Button>
    )
  return <div
    className={cn('checklistRow', { active: activeItem })}
    onClick={() => onSelectItem(checklist.id)}
  >
    <Col
      md={4}
      sm={4}
      xs={4}
      className="column"
    >
      <i
        className={cn(
          'fa icon',
          { 'fa-caret-right': !activeItem },
          { 'fa-caret-down': activeItem }
        )}
        aria-hidden="true"
      />
      {checklist.title}
    </Col>
    <Col
      md={2}
      sm={2}
      xs={2}
      className="column"
      style={{ overflow: 'hidden' }}
    >
      {checklist.deal_type}
    </Col>
    <Col
      md={2}
      sm={2}
      xs={2}
      className="column"
    >
      {checklist.property_type}
    </Col>
    <Col
      md={2}
      sm={2}
      xs={2}
      className="column"
    >
      {checklist.order}
    </Col>
    <Col
      md={2}
      sm={2}
      xs={2}
      className="column"
    >
      <Col
        md={8}
        sm={8}
        xs={8}
        className="edit-button-container"
      >
        <Compose
          TriggerButton={AddButton}
          showOnly={false}
          dropDownBox
          inline
          title="Edit Checklist"
          buttonTitle="Edit"
          onButtonClick={(editedChecklist) => {
            editChecklist({ ...checklist, ...editedChecklist })
          }}
          checklist={checklist}
          activeItem={activeItem}
        />
      </Col>
      <Col
        md={4}
        sm={4}
        xs={4}
        className="deleteIcon"
      >
        <i
          onClick={(e) => {
            e.stopPropagation()
            deleteChecklist(checklist)
          }}
          className="fa fa-times"
          aria-hidden="true"
        />
      </Col>
    </Col>
  </div>
}

export default connect(
  null,
  ({ editChecklist })
)(Row)