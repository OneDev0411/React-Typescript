import React from 'react'
import { connect } from 'react-redux'
import { Button, Col } from 'react-bootstrap'
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
        className="edit-button"
        onClick={(e) => {
          e.stopPropagation()
          clickHandler()
        }}
      >
        Edit
      </Button>
    )

  return <div
    className={cn('checklist-row', { active: activeItem })}
    onClick={() => onSelectItem(checklist.id)}
  >
    <div
      className="checklist--row--first"
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
    </div>
    <div
      className="checklist--row--column-center"
      style={{ overflow: 'hidden' }}
    >
      {checklist.deal_type}
    </div>
    <div
      className="checklist--row--column-center"
    >
      {checklist.property_type}
    </div>
    <div
      className="checklist--row--column-center"
    >
      {checklist.order}
    </div>
    <div
      className="checklist--row--last"
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
        className="delete-icon"
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
    </div>
  </div>
}

export default connect(
  null,
  ({ editChecklist })
)(Row)