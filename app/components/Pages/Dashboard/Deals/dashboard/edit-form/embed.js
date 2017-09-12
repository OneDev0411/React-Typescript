import React from 'react'
import { Row, Col } from 'react-bootstrap'
import Frame from './frame'

export default ({
  task,
  incompleteFields,
  buttonCaption,
  loaded,
  saving,
  onSave,
  onClose,
  onFrameRef
}) => (
  <div className="deal-edit-form">
    <Row className="header">
      <Col md={7} sm={7} xs={6}>
        <button
          className="deal-button exit"
          onClick={onClose}
        >
          X
        </button>

        <span className="name">{ task.title }</span>
      </Col>

      <Col md={5} sm={5} xs={6} className="btns">
        {
          loaded &&
          <span className="incomplete-fields">
            {
              incompleteFields.length > 0 ?
              `There are ${incompleteFields.length} incomplete fields` :
              'All fields completed'
            }
          </span>
        }

        <button
          className="deal-button save"
          disabled={!loaded || saving}
          onClick={() => onSave()}
        >
          { buttonCaption }
        </button>
      </Col>
    </Row>

    <Row>
      <Col md={12} sm={12} xs={12}>
        <Frame
          task={task}
          frameRef={ref => onFrameRef(ref)}
        />
      </Col>
    </Row>
  </div>
)
