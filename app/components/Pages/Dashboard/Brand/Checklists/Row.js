import React from 'react'
import { Col } from 'react-bootstrap'
import cn from 'classnames'

const Row = ({
               deleteChecklist,
               onSelectItem,
               Checklist,
               activeItem
             }) =>
  (
    <div
      className={cn('checklistRow', { active: activeItem })}
      onClick={() => onSelectItem(Checklist.id)}
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
        {Checklist.title}
      </Col>
      <Col
        md={2}
        sm={2}
        xs={2}
        className="column"
        style={{ overflow: 'hidden' }}
      >
        {Checklist.deal_type}
      </Col>
      <Col
        md={2}
        sm={2}
        xs={2}
        className="column"
      >
        {Checklist.property_type}
      </Col>
      <Col
        md={2}
        sm={2}
        xs={2}
        className="column"
      >
        {Checklist.order}
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
          xs={8} className="editButton"
        >
          Edit
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
              deleteChecklist(Checklist)
            }}
            className="fa fa-times"
            aria-hidden="true"
          />
        </Col>
      </Col>
    </div>
  )

export default Row