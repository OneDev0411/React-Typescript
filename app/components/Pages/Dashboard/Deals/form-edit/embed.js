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
      <Col md={6} sm={6} xs={6}>
        <span className="name">{ task.title }</span>
      </Col>

      <Col md={6} sm={6} xs={6} className="btns">
        {
          (saving || !loaded) ?
          <span style={{ marginRight: '20px' }}>
            <i className="fa fa-spin fa-spinner" />&nbsp;
            { buttonCaption }
          </span> :
          <button
            className="deal-button save"
            onClick={onSave}
          >
            { incompleteFields.length === 0 ? 'Save' : 'Save Draft' }
          </button>
        }

        <button
          className="deal-button exit"
          onClick={onClose}
        >
          X
        </button>
      </Col>
    </Row>

    <Row>
      <Col md={12} sm={12} xs={12} style={{ overflow: 'none' }}>
        <Frame
          task={task}
          frameRef={ref => onFrameRef(ref)}
        />
      </Col>
    </Row>
  </div>
)
